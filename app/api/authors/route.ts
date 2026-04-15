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

// GET - Fetch all authors
export async function GET() {
  try {
    const supabase = await getServerSupabaseClient()
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch authors' },
      { status: 500 }
    )
  }
}

// POST - Create a new author
export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, nationality, birth_year, photo_url } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Author name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('authors')
      .insert([
        {
          name,
          bio,
          nationality,
          birth_year,
          photo_url,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create author' },
      { status: 500 }
    )
  }
}
