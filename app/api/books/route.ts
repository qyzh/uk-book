import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/utils/rate-limit'
import type { Book, Author } from '@/lib/types/library'

interface BooksResponse {
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

interface BooksResponseFallback {
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

// GET - Fetch all books with author info
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
        }
      }
    )
  }

  try {
    const supabase = await getServerSupabaseClient()
    let result: { data: BooksResponse[] | null; error: Error | null } = await supabase
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
      .order('created_at', { ascending: false })

    // If error with newer optional fields, retry with safe select
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
        .order('created_at', { ascending: false })
      
      result = {
        data: fallback.data?.map(b => ({
          ...b,
          sub_genre: null,
          current_page: null
        })) || null,
        error: fallback.error
      }
    }

    const { data, error } = result
    if (error) throw error

    // Add default values for optional fields
    const booksWithFields = (data || []).map((book) => ({
      ...book,
      genre: book.genre || 'fiction',
      sub_genre: book.sub_genre || '',
      summary: book.summary || '',
      current_page: book.current_page ?? null
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
      sub_genre,
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
    const insertData: Record<string, unknown> = {
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

    if (sub_genre) {
      insertData.sub_genre = sub_genre
    }
    
    // Try to include summary if provided
    if (summary) {
      insertData.summary = summary
    }

    let result: { data: BooksResponse[] | null; error: Error | null } = await supabase
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

      const fallback = await supabase
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

    if (error) throw error

    // Add optional fields with default values if not in response
    const booksWithFields = (data || []).map((book) => ({
      ...book,
      genre: book.genre || genre || 'fiction',
      sub_genre: book.sub_genre || sub_genre || '',
      summary: book.summary || summary || '',
      current_page: book.current_page ?? null
    }))

    return NextResponse.json({ data: booksWithFields }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create book' },
      { status: 500 }
    )
  }
}
