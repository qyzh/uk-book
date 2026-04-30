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

// PUT - Update quote fields and replace its tags
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await getServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { text, page_number, is_favorite, tag_ids } = body

    // 1. Update quote fields
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .update({ text, page_number, is_favorite })
      .eq('id', id)
      .select('id, book_id, text, page_number, is_favorite, created_at, books(id, title)')
      .single()

    if (quoteError) throw quoteError

    // 2. Replace tags if tag_ids was explicitly sent in the request body
    let tags: unknown[] = []
    if (Array.isArray(tag_ids)) {
      // Delete all existing tag relations for this quote
      const { error: deleteError } = await supabase
        .from('quote_tags')
        .delete()
        .eq('quote_id', id)

      if (deleteError) throw deleteError

      // Insert the new set (if any)
      if (tag_ids.length > 0) {
        const junctionRows = tag_ids.map((tag_id: string) => ({
          quote_id: id,
          tag_id,
        }))

        const { error: insertError } = await supabase
          .from('quote_tags')
          .insert(junctionRows)

        if (insertError) throw insertError

        // Fetch tag details to return in the response
        const { data: tagData, error: tagFetchError } = await supabase
          .from('tags')
          .select('id, name, slug, color')
          .in('id', tag_ids)

        if (tagFetchError) throw tagFetchError
        tags = tagData ?? []
      }
    } else {
      // tag_ids not in payload → read existing tags and return them unchanged
      const { data: existingTags } = await supabase
        .from('quote_tags')
        .select('tags(id, name, slug, color)')
        .eq('quote_id', id)

      tags = (existingTags ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((row: any) => row.tags)
        .filter(Boolean)
    }

    return NextResponse.json({ data: { ...quote, tags } }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update quote' },
      { status: 500 }
    )
  }
}

// DELETE - Delete quote (cascade removes quote_tags via FK)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await getServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('quotes').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Quote deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete quote' },
      { status: 500 }
    )
  }
}
