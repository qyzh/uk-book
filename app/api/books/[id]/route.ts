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

// GET - Fetch a single book
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
        .eq('id', id)
        .single()
    }

    const { data, error } = result
    if (error) throw error

    // Add optional fields with default values if they don't exist
    const bookWithFields = data ? {
      ...data,
      genre: (data as any).genre || 'fiction',
      sub_genre: (data as any).sub_genre || '',
      summary: (data as any).summary || '',
      current_page: (data as any).current_page || null
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
    const updateData: any = {
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

    let result: any = await supabase
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

      result = await supabase
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
    }

    const { data, error } = result

    if (error) {
      console.error('Supabase update error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        updateData: updateData
      })
      throw error
    }

    // Add optional fields with default/provided values
    const booksWithFields = (data || []).map((book: any) => ({
      ...book,
      genre: (book as any).genre || genre || 'fiction',
      sub_genre: (book as any).sub_genre || sub_genre || '',
      summary: (book as any).summary || summary || '',
      current_page: (book as any).current_page || null
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
