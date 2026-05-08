'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { toast } from '@/lib/toast'
import Loading from '@/app/components/Loading'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import * as PixelIcons from 'pixelarticons/react'
import AdminSidebar, { type AdminSection } from './components/AdminSidebar'
import DetailPanel from './components/DetailPanel'
import BookList from './components/BookList'
import QuoteList from './components/QuoteList'
import NoteList from './components/NoteList'
import AuthorList from './components/AuthorList'
import BookForm, {
  type BookFormData,
  EMPTY_BOOK_FORM,
  bookToFormData,
} from './components/BookForm'
import QuoteForm, { type QuoteFormData, EMPTY_QUOTE_FORM } from './components/QuoteForm'
import NoteForm, { type NoteFormData, EMPTY_NOTE_FORM } from './components/NoteForm'
import AuthorForm, { type AuthorFormData, EMPTY_AUTHOR_FORM } from './components/AuthorForm'
import type { Book, Author, Tag } from '@/lib/types/library'

interface Quote {
  id: string
  book_id: string
  text: string
  page_number?: number
  is_favorite: boolean
  books?: { id: string; title: string }
  tags?: Tag[]
}

interface Note {
  id: string
  book_id: string
  content: string
  note_type: string
  created_at: string
  updated_at: string
}

type PanelMode = 'new-book' | 'edit-book' | 'new-quote' | 'edit-quote' | 'new-note' | 'new-author' | null

export default function AdminPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  const [section, setSection] = useState<AdminSection>('books')
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  const [bookForm, setBookForm] = useState<BookFormData>(EMPTY_BOOK_FORM)
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>(EMPTY_QUOTE_FORM)
  const [noteForm, setNoteForm] = useState<NoteFormData>(EMPTY_NOTE_FORM)
  const [authorForm, setAuthorForm] = useState<AuthorFormData>(EMPTY_AUTHOR_FORM)

  // ── Data fetching ──────────────────────────────────────────────

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch('/api/books')
      const { data } = await res.json()
      setBooks(data ?? [])
    } catch { /* silent */ }
  }, [])

  const fetchAuthors = useCallback(async () => {
    try {
      const res = await fetch('/api/authors')
      const { data } = await res.json()
      setAuthors(data ?? [])
    } catch { /* silent */ }
  }, [])

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch('/api/quotes')
      const { data } = await res.json()
      setQuotes(data ?? [])
    } catch { /* silent */ }
  }, [])

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes')
      const { data } = await res.json()
      setNotes(data ?? [])
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    Promise.all([fetchBooks(), fetchAuthors(), fetchQuotes(), fetchNotes()]).finally(() =>
      setLoading(false)
    )
  }, [fetchBooks, fetchAuthors, fetchQuotes, fetchNotes])

  // ── Storage helpers ────────────────────────────────────────────

  const uploadToStorage = async (file: File, prefix = ''): Promise<string> => {
    const supabase = createClient()
    const fileName = `${Date.now()}${prefix}-${file.name}`
    const { error } = await supabase.storage.from('book-covers').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('book-covers').getPublicUrl(fileName)
    return data.publicUrl
  }

  // ── Panel helpers ──────────────────────────────────────────────

  const closePanel = () => {
    setPanelMode(null)
    setEditingBook(null)
    setEditingQuote(null)
    setBookForm(EMPTY_BOOK_FORM)
    setQuoteForm(EMPTY_QUOTE_FORM)
    setNoteForm(EMPTY_NOTE_FORM)
    setAuthorForm(EMPTY_AUTHOR_FORM)
  }

  const openNewBook   = () => { setBookForm(EMPTY_BOOK_FORM); setPanelMode('new-book') }
  const openEditBook  = (book: Book) => { setEditingBook(book); setBookForm(bookToFormData(book)); setPanelMode('edit-book') }
  const openNewQuote  = () => { setQuoteForm(EMPTY_QUOTE_FORM); setPanelMode('new-quote') }
  const openEditQuote = (quote: Quote) => {
    setEditingQuote(quote)
    setQuoteForm({
      book_id:     quote.book_id,
      text:        quote.text,
      page_number: quote.page_number ? String(quote.page_number) : '',
      is_favorite: quote.is_favorite,
      tag_ids:     (quote.tags ?? []).map((t) => t.id),
    })
    setPanelMode('edit-quote')
  }
  const openNewNote   = () => { setNoteForm(EMPTY_NOTE_FORM); setPanelMode('new-note') }
  const openNewAuthor = () => { setAuthorForm(EMPTY_AUTHOR_FORM); setPanelMode('new-author') }

  // ── Handlers ───────────────────────────────────────────────────

  const handleSaveBook = async (data: BookFormData, coverFile: File | null) => {
    if (submitting) return
    setSubmitting(true)
    try {
      let coverUrl = data.cover_url
      if (coverFile) coverUrl = await uploadToStorage(coverFile)

      const payload = {
        ...data,
        cover_url: coverUrl,
        published_year: data.published_year ? parseInt(String(data.published_year)) : null,
        pages: data.pages ? parseInt(String(data.pages)) : null,
        sub_genre: data.sub_genres.join(', '),
      }

      const url = panelMode === 'edit-book' && editingBook ? `/api/books/${editingBook.id}` : '/api/books'
      const method = panelMode === 'edit-book' ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to save book')

      toast.success(panelMode === 'edit-book' ? 'Book updated' : 'Book added')
      await fetchBooks()
      closePanel()
    } catch (err) {
      toast.error('Failed to save book', err instanceof Error ? err.message : 'Please try again')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Delete this book?')) return
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Book deleted')
      await fetchBooks()
      closePanel()
    } catch {
      toast.error('Failed to delete book')
    }
  }

  const handleSaveQuote = async (data: QuoteFormData) => {
    if (submitting) return
    setSubmitting(true)
    try {
      const payload = {
        book_id: data.book_id,
        text: data.text,
        page_number: data.page_number ? parseInt(data.page_number) : undefined,
        is_favorite: data.is_favorite,
        tag_ids: data.tag_ids ?? [],
      }
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success('Quote added')
      await fetchQuotes()
      closePanel()
    } catch {
      toast.error('Failed to add quote')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateQuote = async (data: QuoteFormData) => {
    if (submitting || !editingQuote) return
    setSubmitting(true)
    try {
      const payload = {
        text:        data.text,
        page_number: data.page_number ? parseInt(data.page_number) : undefined,
        is_favorite: data.is_favorite,
        tag_ids:     data.tag_ids ?? [],
      }
      const res = await fetch(`/api/quotes/${editingQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success('Quote updated')
      await fetchQuotes()
      closePanel()
    } catch {
      toast.error('Failed to update quote')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleFavorite = async (quote: Quote) => {
    try {
      await fetch(`/api/quotes/${quote.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_favorite: !quote.is_favorite }) })
      await fetchQuotes()
    } catch { /* silent */ }
  }

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Delete this quote?')) return
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Quote deleted')
      await fetchQuotes()
    } catch {
      toast.error('Failed to delete quote')
    }
  }

  const handleSaveNote = async (data: NoteFormData) => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error()
      toast.success('Note added')
      await fetchNotes()
      closePanel()
    } catch {
      toast.error('Failed to add note')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Note deleted')
      await fetchNotes()
    } catch {
      toast.error('Failed to delete note')
    }
  }

  const handleSaveAuthor = async (data: AuthorFormData, photoFile: File | null) => {
    if (submitting) return
    setSubmitting(true)
    try {
      let photoUrl = data.photo_url
      if (photoFile) photoUrl = await uploadToStorage(photoFile, '-author')
      const res = await fetch('/api/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, photo_url: photoUrl }) })
      if (!res.ok) throw new Error()
      toast.success('Author added')
      await fetchAuthors()
      closePanel()
    } catch {
      toast.error('Failed to add author')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Derived values ─────────────────────────────────────────────

  const nonWishlist = books.filter(b => b.reading_status !== 'wishlist')
  const counts = {
    books:   nonWishlist.length,
    quotes:  quotes.length,
    notes:   notes.length,
    authors: authors.length,
  }
  const stats = {
    total:     nonWishlist.length,
    reading:   books.filter(b => b.reading_status === 'reading').length,
    completed: books.filter(b => b.reading_status === 'completed').length,
  }

  const panelOpen = panelMode !== null
  const panelTitle =
    panelMode === 'edit-book'   ? 'Edit Book'   :
    panelMode === 'new-book'    ? 'New Book'    :
    panelMode === 'new-quote'   ? 'New Quote'   :
    panelMode === 'edit-quote'  ? 'Edit Quote'  :
    panelMode === 'new-note'    ? 'New Note'    :
    panelMode === 'new-author'  ? 'New Author'  : ''

  // ── Render ─────────────────────────────────────────────────────

  if (loading) return <Loading text="loading admin" fullPage />

  return (
    <div
      className="flex flex-col h-screen bg-[#0f0e0d] text-[#faf9f5] overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#30302e] shrink-0 bg-[#0f0e0d] z-10">
        <Link href="/" className="text-xs text-[#87867f] hover:text-[#d97757] transition font-bold flex items-center gap-1.5">
          <span className="text-[#d97757]">←</span> Back to library
        </Link>
        <span className="text-[11px] text-[#87867f] bg-[#1a1918] border border-[#30302e] px-3 py-1 rounded-full capitalize font-bold">
          {section}
        </span>
        <div className="w-28" />
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          active={section}
          counts={counts}
          stats={stats}
          onSelect={s => { setSection(s); closePanel() }}
          onLogout={async () => { await signOut(); router.push('/') }}
        />

        {/* List panel */}
        <main className="flex-1 overflow-hidden">
          {section === 'books' && (
            <BookList
              books={books}
              onEdit={openEditBook}
              onDelete={handleDeleteBook}
              onNew={openNewBook}
            />
          )}
          {section === 'quotes' && (
            <QuoteList
              quotes={quotes}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteQuote}
              onEdit={openEditQuote}
              onNew={openNewQuote}
            />
          )}
          {section === 'notes' && (
            <NoteList
              notes={notes}
              books={books}
              onDelete={handleDeleteNote}
              onNew={openNewNote}
            />
          )}
          {section === 'authors' && (
            <AuthorList
              authors={authors}
              onNew={openNewAuthor}
            />
          )}
        </main>

        {/* Detail panel */}
        <DetailPanel
          open={panelOpen}
          title={panelTitle}
          onClose={closePanel}
          onSave={panelOpen ? () => {} : undefined}
          onDelete={
            panelMode === 'edit-book' && editingBook
              ? () => handleDeleteBook(editingBook.id)
              : panelMode === 'edit-quote' && editingQuote
              ? () => handleDeleteQuote(editingQuote.id)
              : undefined
          }
          saving={submitting}
        >
          {(panelMode === 'new-book' || panelMode === 'edit-book') && (
            <BookForm
              formId="detail-form"
              data={bookForm}
              authors={authors}
              onChange={setBookForm}
              onSubmit={handleSaveBook}
            />
          )}
          {(panelMode === 'new-quote' || panelMode === 'edit-quote') && (
            <QuoteForm
              formId="detail-form"
              data={quoteForm}
              books={books}
              mode={panelMode === 'edit-quote' ? 'edit' : 'new'}
              onChange={setQuoteForm}
              onSubmit={panelMode === 'edit-quote' ? handleUpdateQuote : handleSaveQuote}
            />
          )}
          {panelMode === 'new-note' && (
            <NoteForm
              formId="detail-form"
              data={noteForm}
              books={books}
              onChange={setNoteForm}
              onSubmit={handleSaveNote}
            />
          )}
          {panelMode === 'new-author' && (
            <AuthorForm
              formId="detail-form"
              data={authorForm}
              onChange={setAuthorForm}
              onSubmit={handleSaveAuthor}
            />
          )}
        </DetailPanel>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden flex border-t border-[#30302e] bg-[#0f0e0d] shrink-0">
        {([
          { id: 'books',   iconName: 'Library' as keyof typeof PixelIcons },
          { id: 'quotes',  iconName: 'QuoteTextInline' as keyof typeof PixelIcons },
          { id: 'notes',   iconName: 'Notebook' as keyof typeof PixelIcons },
          { id: 'authors', iconName: 'Users' as keyof typeof PixelIcons },
        ] as { id: AdminSection; iconName: keyof typeof PixelIcons }[]).map(({ id, iconName }) => (
          <button
            key={id}
            onClick={() => { setSection(id); closePanel() }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] capitalize transition ${
              section === id ? 'text-[#d97757]' : 'text-[#87867f]'
            }`}
          >
            <PixelArtIcon name={iconName} size={16} />
            {id}
          </button>
        ))}
      </nav>
    </div>
  )
}
