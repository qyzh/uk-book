import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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

// GET - Fetch all quotes with book info
export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('book_id')

    let query = supabase
      .from('quotes')
      .select(`
        id,
        book_id,
        text,
        page_number,
        is_favorite,
        created_at,
        books(id, title)
      `)
      .order('created_at', { ascending: false })

    if (bookId) {
      query = query.eq('book_id', bookId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// POST - Create new quote
export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { book_id, text, page_number, is_favorite } = body

    if (!book_id || !text) {
      return NextResponse.json(
        { error: 'book_id and text are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('quotes')
      .insert({
        book_id,
        text,
        page_number,
        is_favorite: is_favorite || false,
      })
      .select(`
        id,
        book_id,
        text,
        page_number,
        is_favorite,
        created_at,
        books(id, title)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create quote' },
      { status: 500 }
    )
  }
}
