import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BookPageClient, { type BookData } from './BookPageClient'
import JsonLd from '@/app/components/JsonLd'

const BASE_URL = 'https://buku.kyxis.my.id'

// ─── Supabase helper ─────────────────────────────────────────────────────────

async function getSupabase() {
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
            // read-only context — ignore
          }
        },
      },
    }
  )
}

// ─── Server-side book fetch ───────────────────────────────────────────────────

// Raw shape returned by Supabase (authors is array due to join)
interface RawBook {
  id: string
  title: string
  isbn?: string
  cover_url?: string
  published_year?: number
  pages?: number
  publisher?: string
  genre?: string
  sub_genre?: string
  summary?: string
  reading_status: string
  language: string
  started_at?: string
  finished_at?: string
  current_page?: number
  authors: { id: string; name: string; bio?: string; nationality?: string }[] | { id: string; name: string; bio?: string; nationality?: string }
}

async function fetchBook(id: string): Promise<BookData | null> {
  try {
    const supabase = await getSupabase()
    const { data, error } = await supabase
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
        authors(id, name, bio, nationality)
      `)
      .eq('id', id)
      .single()

    if (error || !data) return null

    const raw = data as unknown as RawBook
    const author = Array.isArray(raw.authors) ? raw.authors[0] : raw.authors

    return {
      id: raw.id,
      title: raw.title,
      isbn: raw.isbn,
      cover_url: raw.cover_url,
      published_year: raw.published_year,
      pages: raw.pages,
      publisher: raw.publisher,
      genre: raw.genre || 'fiction',
      sub_genre: raw.sub_genre || '',
      summary: raw.summary || '',
      reading_status: raw.reading_status,
      language: raw.language,
      started_at: raw.started_at,
      finished_at: raw.finished_at,
      current_page: raw.current_page ?? undefined,
      authors: author,
    }
  } catch {
    return null
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params

  // Short IDs are resolved client-side; provide generic metadata for them
  if (id.length === 4) {
    return {
      title: 'Book Details',
      description: 'View book details, quotes, and reading progress.',
    }
  }

  const book = await fetchBook(id)

  if (!book) {
    return {
      title: 'Book Not Found',
      description: 'This book could not be found in the library.',
      robots: { index: false, follow: false },
    }
  }

  const title = `${book.title}${book.authors?.name ? ` by ${book.authors.name}` : ''}`
  const description =
    book.summary ||
    `${book.title}${book.authors?.name ? ` by ${book.authors.name}` : ''}. ${
      book.genre ? `Genre: ${book.genre}. ` : ''
    }${book.published_year ? `Published ${book.published_year}. ` : ''}${
      book.pages ? `${book.pages} pages.` : ''
    } Part of qyzh's personal reading library.`

  const url = `${BASE_URL}/books/${id}`
  const images = book.cover_url
    ? [{ url: book.cover_url, width: 400, height: 600, alt: `Cover of ${book.title}` }]
    : [{ url: '/og-image.png', width: 1200, height: 630, alt: book.title }]

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'book',
      url,
      title,
      description,
      images,
      ...(book.isbn ? { isbn: book.isbn } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [images[0].url],
    },
  }
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function BookPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Short IDs are resolved client-side
  if (id.length === 4) {
    return <BookPageClient bookId={id} />
  }

  const book = await fetchBook(id)

  if (!book) {
    notFound()
  }

  // Build JSON-LD Book structured data
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: book.authors?.name
      ? { '@type': 'Person', name: book.authors.name }
      : undefined,
    isbn: book.isbn || undefined,
    numberOfPages: book.pages || undefined,
    publisher: book.publisher
      ? { '@type': 'Organization', name: book.publisher }
      : undefined,
    datePublished: book.published_year ? `${book.published_year}` : undefined,
    image: book.cover_url || undefined,
    description: book.summary || undefined,
    inLanguage: book.language || undefined,
    url: `${BASE_URL}/books/${book.id}`,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <BookPageClient bookId={id} initialBook={book} />
    </>
  )
}
