import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

interface BookResponse {
  id: string
  title: string
  isbn: string | null
  cover_url: string | null
  published_year: number | null
  pages: number | null
  publisher: string | null
  genre: string | null
  sub_genre: string | null
  summary: string | null
  reading_status: string
  language: string
  started_at: string | null
  finished_at: string | null
  current_page: number | null
  authors: { id: string; name: string }[]
}

interface BookResponseFallback {
  id: string
  title: string
  isbn: string | null
  cover_url: string | null
  published_year: number | null
  pages: number | null
  publisher: string | null
  genre: string | null
  summary: string | null
  reading_status: string
  language: string
  started_at: string | null
  finished_at: string | null
  authors: { id: string; name: string }[]
}

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

// GET - Fetch a single book
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await getServerSupabaseClient()
    let result: { data: BookResponse | null; error: Error | null } = await supabase
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
        sub_genre,
        summary,
        reading_status,
        language,
        started_at,
        finished_at,
        current_page,
        authors(id, name)
      `)
      .eq('id', id)
      .single()

    // If error with newer optional fields, try again without them
    if (
      result.error &&
      (result.error.message?.includes('current_page') || result.error.message?.includes('sub_genre'))
    ) {
      const fallback = await supabase
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
        .eq('id', id)
        .single()

      result = {
        data: fallback.data ? {
          ...fallback.data,
          sub_genre: null,
          current_page: null
        } : null,
        error: fallback.error
      }
    }

    const { data, error } = result
    if (error) throw error

    // Add optional fields with default values if they don't exist
    const bookWithFields = data ? {
      ...data,
      genre: data.genre || 'fiction',
      sub_genre: data.sub_genre || '',
      summary: data.summary || '',
      current_page: data.current_page ?? null
    } : data

    return NextResponse.json({ data: bookWithFields }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

// PUT - Update a book
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      sub_genre,
      summary,
      started_at,
      finished_at,
      current_page
    } = body

    // Build update object with all standard fields
    // Convert empty date strings to null
    const updateData: Record<string, unknown> = {
      title,
      author_id,
      isbn,
      cover_url,
      published_year,
      pages,
      publisher,
      reading_status,
      language,
      started_at: started_at || null,
      finished_at: finished_at || null,
      current_page: current_page ? parseInt(current_page) : null,
    }

    // Only include genre and summary if they have values
    if (genre) {
      updateData.genre = genre
    }
    
    if (summary) {
      updateData.summary = summary
    }

    if (sub_genre) {
      updateData.sub_genre = sub_genre
    }

    let result: { data: BookResponse[] | null; error: Error | null } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        title,
        isbn,
        cover_url,
        published_year,
        pages,
        publisher,
        genre,
        sub_genre,
        summary,
        reading_status,
        language,
        started_at,
        finished_at,
        current_page,
        authors(id, name)
      `)

    // If error with optional fields, try again without those fields
    if (
      result.error &&
      (
        result.error.message?.includes('genre') ||
        result.error.message?.includes('sub_genre') ||
        result.error.message?.includes('summary') ||
        result.error.message?.includes('current_page')
      )
    ) {
      const safeUpdateData = {
        title,
        author_id,
        isbn,
        cover_url,
        published_year,
        pages,
        publisher,
        reading_status,
        language,
        started_at: started_at || null,
        finished_at: finished_at || null,
      }

      const fallback = await supabase
        .from('books')
        .update(safeUpdateData)
        .eq('id', id)
        .select(`
          id,
          title,
          isbn,
          cover_url,
          published_year,
          pages,
          publisher,
          reading_status,
          language,
          started_at,
          finished_at,
          authors(id, name)
        `)

      result = {
        data: fallback.data?.map(b => ({
          ...b,
          sub_genre: null,
          current_page: null,
          genre: null,
          summary: null
        })) || null,
        error: fallback.error
      }
    }

    const { data, error } = result

    if (error) {
      const err = error as { message?: string; code?: string; details?: string; hint?: string }
      console.error('Supabase update error:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        updateData: updateData
      })
      throw error
    }

    // Add optional fields with default/provided values
    const booksWithFields = (data || []).map((book) => ({
      ...book,
      genre: book.genre || genre || 'fiction',
      sub_genre: book.sub_genre || sub_genre || '',
      summary: book.summary || summary || '',
      current_page: book.current_page ?? null
    }))

    return NextResponse.json({ data: booksWithFields }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update book' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a book
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await getServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Book deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete book' },
      { status: 500 }
    )
  }
}
