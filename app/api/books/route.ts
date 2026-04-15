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

// GET - Fetch all books with author info
export async function GET() {
  try {
    const supabase = await getServerSupabaseClient()
    let result: any = await supabase
      .from('books')
      .select(`
        id,
        title,
        isbn,
        cover_url,
        published_year,
        pages,
        publisher,
        genre,
        summary,
        reading_status,
        language,
        started_at,
        finished_at,
        current_page,
        authors(id, name)
      `)
      .order('created_at', { ascending: false })

    // If error with current_page, try again without it
    if (result.error && result.error.message?.includes('current_page')) {
      result = await supabase
        .from('books')
        .select(`
          id,
          title,
          isbn,
          cover_url,
          published_year,
          pages,
          publisher,
          genre,
          summary,
          reading_status,
          language,
          started_at,
          finished_at,
          authors(id, name)
        `)
        .order('created_at', { ascending: false })
    }

    const { data, error } = result
    if (error) throw error

    // Add default values for optional fields
    const booksWithFields = (data || []).map((book: any) => ({
      ...book,
      genre: (book as any).genre || 'fiction',
      summary: (book as any).summary || '',
      current_page: (book as any).current_page || null
    }))

    return NextResponse.json({ data: booksWithFields }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST - Create a new book
export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      author_id, 
      isbn, 
      cover_url, 
      published_year, 
      pages, 
      publisher, 
      reading_status, 
      language,
      genre,
      summary,
      started_at,
      finished_at,
      current_page
    } = body

    if (!title || !author_id) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      )
    }

    // Build insert object with standard fields
    const insertData: any = {
      title,
      author_id,
      isbn,
      cover_url,
      published_year,
      pages,
      publisher,
      reading_status: reading_status || 'to-read',
      language: language || 'id',
      started_at: started_at || null,
      finished_at: finished_at || null,
      current_page: current_page ? parseInt(current_page) : null,
    }

    // Try to include genre if provided
    if (genre) {
      insertData.genre = genre
    }
    
    // Try to include summary if provided
    if (summary) {
      insertData.summary = summary
    }

    let result: any = await supabase
      .from('books')
      .insert([insertData])
      .select(`
        id,
        title,
        isbn,
        cover_url,
        published_year,
        pages,
        publisher,
        genre,
        summary,
        reading_status,
        language,
        started_at,
        finished_at,
        current_page,
        authors(id, name)
      `)

    // If error with genre/summary/current_page, try again without those fields
    if (result.error && (result.error.message?.includes('genre') || result.error.message?.includes('summary') || result.error.message?.includes('current_page'))) {
      const safeInsertData = {
        title,
        author_id,
        isbn,
        cover_url,
        published_year,
        pages,
        publisher,
        reading_status: reading_status || 'to-read',
        language: language || 'id',
        started_at: started_at || null,
        finished_at: finished_at || null,
      }

      result = await supabase
        .from('books')
        .insert([safeInsertData])
        .select(`
          id,
          title,
          isbn,
          cover_url,
          published_year,
          pages,
          publisher,
          genre,
          summary,
          reading_status,
          language,
          started_at,
          finished_at,
          current_page,
          authors(id, name)
        `)
    }

    const { data, error } = result

    if (error) throw error

    // Add optional fields with default values if not in response
    const booksWithFields = (data || []).map((book: any) => ({
      ...book,
      genre: (book as any).genre || genre || 'fiction',
      summary: (book as any).summary || summary || '',
      current_page: (book as any).current_page || null
    }))

    return NextResponse.json({ data: booksWithFields }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create book' },
      { status: 500 }
    )
  }
}
