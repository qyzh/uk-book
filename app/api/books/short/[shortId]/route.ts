import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/utils/rate-limit'

async function getServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // handle error
          }
        },
      },
    }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  const ip = getClientIP(request)
  const { success, remaining, resetIn } = rateLimit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
        }
      }
    )
  }

  try {
    const { shortId } = await params
    const supabase = await getServerSupabaseClient()

    // Fetch all books and find the one where id ends with shortId
    const { data: books, error } = await supabase
      .from('books')
      .select('id')
      .limit(1000)

    if (error) throw error

    // Find book with matching short ID (last 4 characters)
    const matchingBook = books?.find(book => book.id.endsWith(shortId))

    if (!matchingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { id: matchingBook.id, shortId },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to find book' },
      { status: 500 }
    )
  }
}
