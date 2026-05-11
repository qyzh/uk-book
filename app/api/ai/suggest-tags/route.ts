import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getGeminiClient } from '@/lib/ai/gemini'

async function getServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI not configured', code: 'NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Quote text is required' }, { status: 400 })
    }

    // Fetch existing tags
    const supabase = await getServerSupabaseClient()
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .select('id, name, slug')

    if (tagError) throw tagError
    if (!tags || tags.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    const tagNames = tags.map((t) => t.name)

    // Call Gemini
    const ai = getGeminiClient()
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a quote categorizer. Given a quote and a list of available categories, pick which categories best fit the quote. Only choose from the provided list. Return 1-3 most relevant categories.

Available categories: ${tagNames.join(', ')}

Quote: "${text.trim()}"

Return a JSON array of the category names that best fit this quote.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    })

    const suggested: string[] = JSON.parse(response.text ?? '[]')

    // Map names back to tag IDs (case-insensitive match)
    const tagIds = suggested
      .map((name) => tags.find((t) => t.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean)
      .map((t) => t!.id)

    return NextResponse.json({ data: tagIds }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to suggest tags' },
      { status: 500 }
    )
  }
}
