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

// GET - Fetch all tags (public)
export async function GET() {
  try {
    const supabase = await getServerSupabaseClient()

    const { data, error } = await supabase
      .from('tags')
      .select('id, name, slug, color, created_at')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST - Create a new tag (authenticated)
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
    const { name, color = 'gray' } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const { data, error } = await supabase
      .from('tags')
      .insert({ name: name.trim(), slug, color })
      .select('id, name, slug, color, created_at')
      .single()

    if (error) {
      // Unique constraint violation → tag already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Tag "${name.trim()}" already exists` },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create tag' },
      { status: 500 }
    )
  }
}
