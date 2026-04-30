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

// GET - Fetch all quotes with book info and tags
export async function GET(request: NextRequest) {
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
        },
      }
    )
  }

  try {
    const supabase = await getServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('book_id')
    const tagSlug = searchParams.get('tag') // optional filter by tag slug

    let query = supabase
      .from('quotes')
      .select(`
        id,
        book_id,
        text,
        page_number,
        is_favorite,
        created_at,
        books(id, title),
        quote_tags(
          tag_id,
          tags(id, name, slug, color)
        )
      `)
      .order('created_at', { ascending: false })

    if (bookId) {
      query = query.eq('book_id', bookId)
    }

    const { data, error } = await query

    if (error) throw error

    // Flatten quote_tags → tags array for each quote
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalized = (data ?? []).map((q: any) => {
      const tags = (q.quote_tags ?? [])
        .map((qt: { tags: unknown }) => qt.tags)
        .filter(Boolean)
      return { ...q, tags, quote_tags: undefined }
    })

    // Optional: filter by tag slug after flattening
    const result = tagSlug
      ? normalized.filter((q) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          q.tags.some((t: any) => t.slug === tagSlug)
        )
      : normalized

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// POST - Create new quote (with optional tags)
export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { book_id, text, page_number, is_favorite, tag_ids } = body

    if (!book_id || !text) {
      return NextResponse.json(
        { error: 'book_id and text are required' },
        { status: 400 }
      )
    }

    // 1. Insert the quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        book_id,
        text,
        page_number,
        is_favorite: is_favorite || false,
      })
      .select('id, book_id, text, page_number, is_favorite, created_at, books(id, title)')
      .single()

    if (quoteError) throw quoteError

    // 2. Attach tags if any were provided
    let tags: unknown[] = []
    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      const junctionRows = tag_ids.map((tag_id: string) => ({
        quote_id: quote.id,
        tag_id,
      }))

      const { error: tagError } = await supabase
        .from('quote_tags')
        .insert(junctionRows)

      if (tagError) throw tagError

      // 3. Fetch the tag details to return in the response
      const { data: tagData, error: tagFetchError } = await supabase
        .from('tags')
        .select('id, name, slug, color')
        .in('id', tag_ids)

      if (tagFetchError) throw tagFetchError
      tags = tagData ?? []
    }

    return NextResponse.json({ data: { ...quote, tags } }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create quote' },
      { status: 500 }
    )
  }
}
