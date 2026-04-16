'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { GENRES, SUB_GENRES } from '@/lib/constants/library'
import Loading from '@/app/components/Loading'
import Image from 'next/image'
import { toast } from '@/lib/toast'
import { 
    Edit2, Trash2, Plus, X, LogOut, Star, Loader2
} from 'lucide-react'

interface Author {
    id: string
    name: string
    bio?: string
    nationality?: string
    birth_year?: number
    photo_url?: string
}

interface Book {
    id: string
    title: string
    isbn?: string
    cover_url?: string
    published_year?: number
    pages?: number
    publisher?: string
    summary?: string
    reading_status: string
    language: string
    genre?: string
    sub_genre?: string
    started_at?: string
    finished_at?: string
    current_page?: number
    authors: Author
}

interface Quote {
    id: string
    book_id: string
    text: string
    page_number?: number
    is_favorite: boolean
    created_at: string
    books?: { id: string; title: string }
}

interface Note {
    id: string
    book_id: string
    content: string
    note_type: string
    created_at: string
    updated_at: string
}

type TabType = 'books' | 'quotes' | 'notes' | 'authors'

export default function AdminPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabType>('books')
    const [books, setBooks] = useState<Book[]>([])
    const [authors, setAuthors] = useState<Author[]>([])
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<'book' | 'quote' | 'note' | 'author'>('book')
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        author_id: '',
        isbn: '',
        cover_url: '',
        published_year: new Date().getFullYear(),
        pages: '',
        publisher: '',
        summary: '',
        reading_status: 'to-read',
        language: 'id',
        genre: 'fiction',
        sub_genres: [] as string[],
        started_at: '',
        finished_at: '',
        current_page: '',
    })
    const [newSubGenre, setNewSubGenre] = useState('')
    const [customSubGenres, setCustomSubGenres] = useState<string[]>([])
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>('')
    const [uploadingCover, setUploadingCover] = useState(false)
    const [authorPhotoFile, setAuthorPhotoFile] = useState<File | null>(null)
    const [authorPhotoPreview, setAuthorPhotoPreview] = useState<string>('')
    const [uploadingAuthorPhoto, setUploadingAuthorPhoto] = useState(false)
    const [noteData, setNoteData] = useState({
        book_id: '',
        content: '',
        note_type: 'general',
    })
    const [authorData, setAuthorData] = useState({
        name: '',
        bio: '',
        nationality: '',
        birth_year: new Date().getFullYear(),
        photo_url: '',
    })
    const [quoteData, setQuoteData] = useState({
        book_id: '',
        text: '',
        page_number: '',
        is_favorite: false,
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchBooks()
        fetchAuthors()
        fetchQuotes()
        fetchNotes()
    }, [])

    const fetchBooks = async () => {
        try {
            const response = await fetch('/api/books')
            const { data } = await response.json()
            setBooks(data || [])
        } catch (error) {
            console.error('Failed to fetch books:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAuthors = async () => {
        try {
            const response = await fetch('/api/authors')
            const { data } = await response.json()
            setAuthors(data || [])
        } catch (error) {
            console.error('Failed to fetch authors:', error)
        }
    }

    const fetchQuotes = async () => {
        try {
            const response = await fetch('/api/quotes')
            const { data } = await response.json()
            setQuotes(data || [])
        } catch (error) {
            console.error('Failed to fetch quotes:', error)
        }
    }

    const fetchNotes = async () => {
        try {
            const response = await fetch('/api/notes')
            const { data } = await response.json()
            setNotes(data || [])
        } catch (error) {
            console.error('Failed to fetch notes:', error)
        }
    }

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setCoverFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setCoverPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleAuthorPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setAuthorPhotoFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setAuthorPhotoPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const uploadCoverToStorage = async (file: File): Promise<string> => {
        setUploadingCover(true)
        try {
            const supabase = createClient()
            const fileName = `${Date.now()}-${file.name}`
            const { error, data } = await supabase.storage
                .from('book-covers')
                .upload(fileName, file)

            if (error) throw error

            const { data: urlData } = supabase.storage.from('book-covers').getPublicUrl(fileName)
            return urlData.publicUrl
        } catch (error) {
            console.error('Upload failed:', error)
            throw error
        } finally {
            setUploadingCover(false)
        }
    }

    const uploadAuthorPhotoToStorage = async (file: File): Promise<string> => {
        setUploadingAuthorPhoto(true)
        try {
            const supabase = createClient()
            const fileName = `${Date.now()}-author-${file.name}`
            const { error, data } = await supabase.storage
                .from('book-covers')
                .upload(fileName, file)

            if (error) throw error

            const { data: urlData } = supabase.storage.from('book-covers').getPublicUrl(fileName)
            return urlData.publicUrl
        } catch (error) {
            console.error('Upload failed:', error)
            throw error
        } finally {
            setUploadingAuthorPhoto(false)
        }
    }

    const openModal = (type: 'book' | 'quote' | 'note' | 'author', book?: Book) => {
        setModalType(type)
        if (type === 'book' && book) {
            setEditingBook(book)
            setFormData({
                title: book.title,
                author_id: book.authors?.id || '',
                isbn: book.isbn || '',
                cover_url: book.cover_url || '',
                published_year: book.published_year || new Date().getFullYear(),
                pages: book.pages?.toString() || '',
                publisher: book.publisher || '',
                summary: book.summary || '',
                reading_status: book.reading_status || 'to-read',
                language: book.language || 'id',
                genre: book.genre || 'fiction',
                sub_genres: book.sub_genre ? book.sub_genre.split(',').map(s => s.trim()).filter(Boolean) : [],
                started_at: book.started_at || '',
                finished_at: book.finished_at || '',
                current_page: book.current_page?.toString() || '',
            })
            setCoverPreview(book.cover_url || '')
        } else {
            resetForm()
        }
        setShowModal(true)
    }

    const resetForm = () => {
        setEditingBook(null)
        setFormData({
            title: '',
            author_id: '',
            isbn: '',
            cover_url: '',
            published_year: new Date().getFullYear(),
            pages: '',
            publisher: '',
            summary: '',
            reading_status: 'to-read',
            language: 'id',
            genre: 'fiction',
            sub_genres: [],
            started_at: '',
            finished_at: '',
            current_page: '',
        })
        setNewSubGenre('')
        setCoverFile(null)
        setCoverPreview('')
        setAuthorPhotoFile(null)
        setAuthorPhotoPreview('')
        setNoteData({ book_id: '', content: '', note_type: 'general' })
        setAuthorData({ name: '', bio: '', nationality: '', birth_year: new Date().getFullYear(), photo_url: '' })
        setQuoteData({ book_id: '', text: '', page_number: '', is_favorite: false })
    }

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        try {
            let coverUrl = formData.cover_url
            if (coverFile) {
                coverUrl = await uploadCoverToStorage(coverFile)
            }

            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    cover_url: coverUrl,
                    published_year: formData.published_year ? parseInt(formData.published_year.toString()) : null,
                    pages: formData.pages ? parseInt(formData.pages.toString()) : null,
                    sub_genre: formData.sub_genres.join(', '),
                }),
            })

            if (!response.ok) throw new Error('Failed to add book')

            toast.success('Book added successfully')
            await fetchBooks()
            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('Error adding book:', error)
            toast.error('Failed to add book', error instanceof Error ? error.message : 'Please try again')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditBook = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingBook) return
        if (submitting) return
        setSubmitting(true)

        try {
            const response = await fetch(`/api/books/${editingBook.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    published_year: formData.published_year ? parseInt(formData.published_year.toString()) : null,
                    pages: formData.pages ? parseInt(formData.pages.toString()) : null,
                    sub_genre: formData.sub_genres.join(', '),
                }),
            })

            if (!response.ok) throw new Error('Failed to update book')

            toast.success('Book updated successfully')
            await fetchBooks()
            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('Error updating book:', error)
            toast.error('Failed to update book', error instanceof Error ? error.message : 'Please try again')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteBook = async (id: string) => {
        if (!confirm('Delete this book?')) return
        try {
            const response = await fetch(`/api/books/${id}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete book')
            toast.success('Book deleted successfully')
            await fetchBooks()
        } catch (error) {
            console.error('Error deleting book:', error)
            toast.error('Failed to delete book')
        }
    }

    const handleAddQuote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quoteData),
            })
            if (!response.ok) throw new Error('Failed to add quote')
            toast.success('Quote added successfully')
            await fetchQuotes()
            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('Error adding quote:', error)
            toast.error('Failed to add quote')
        } finally {
            setSubmitting(false)
        }
    }

    const handleToggleFavorite = async (quote: Quote) => {
        try {
            await fetch(`/api/quotes/${quote.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_favorite: !quote.is_favorite }),
            })
            await fetchQuotes()
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const handleDeleteQuote = async (id: string) => {
        if (!confirm('Delete this quote?')) return
        try {
            const response = await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete quote')
            toast.success('Quote deleted successfully')
            await fetchQuotes()
        } catch (error) {
            console.error('Error deleting quote:', error)
            toast.error('Failed to delete quote')
        }
    }

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData),
            })
            if (!response.ok) throw new Error('Failed to add note')
            toast.success('Note added successfully')
            await fetchNotes()
            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('Error adding note:', error)
            toast.error('Failed to add note')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Delete this note?')) return
        try {
            const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete note')
            toast.success('Note deleted successfully')
            await fetchNotes()
        } catch (error) {
            console.error('Error deleting note:', error)
            toast.error('Failed to delete note')
        }
    }

    const handleAddAuthor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        try {
            let photoUrl = authorData.photo_url
            if (authorPhotoFile) {
                photoUrl = await uploadAuthorPhotoToStorage(authorPhotoFile)
            }

            const response = await fetch('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...authorData, photo_url: photoUrl }),
            })
            if (!response.ok) throw new Error('Failed to add author')
            toast.success('Author added successfully')
            await fetchAuthors()
            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('Error adding author:', error)
            toast.error('Failed to add author')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <Loading text="loading admin" fullPage />
    }

    const tabs = [
        { id: 'books' as const, label: 'Books', count: books.length, color: 'purple' },
        { id: 'quotes' as const, label: 'Quotes', count: quotes.length, color: 'yellow' },
        { id: 'notes' as const, label: 'Notes', count: notes.length, color: 'amber' },
        { id: 'authors' as const, label: 'Authors', count: authors.length, color: 'slate' },
    ]

    const tabToModalType: Record<string, 'book' | 'quote' | 'note' | 'author'> = {
        books: 'book',
        quotes: 'quote',
        notes: 'note',
        authors: 'author',
    }

    return (
        <div className="min-h-screen bg-black text-slate-100" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
            {/* Header */}
            <header className="border-b border-slate-700 bg-slate-900 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="text-slate-200 hover:text-purple-300 transition text-lg font-bold">
                            ← ukbook
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-300 transition p-2 rounded hover:bg-slate-800"
                            title="logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-xs font-bold transition whitespace-nowrap rounded ${
                                    activeTab === tab.id
                                        ? tab.color === 'purple' ? 'bg-purple-600 text-white' :
                                          tab.color === 'yellow' ? 'bg-yellow-600 text-black' :
                                          tab.color === 'amber' ? 'bg-amber-600 text-black' :
                                          'bg-slate-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Books Tab */}
                {activeTab === 'books' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Total', value: books.length, color: 'slate' },
                                { label: 'Reading', value: books.filter(b => b.reading_status === 'reading').length, color: 'purple' },
                                { label: 'Completed', value: books.filter(b => b.reading_status === 'completed').length, color: 'green' },
                                { label: 'Wishlist', value: books.filter(b => b.reading_status === 'wishlist').length, color: 'blue' },
                            ].map((stat, i) => (
                                <div key={i} className={`border border-${stat.color}-700 bg-${stat.color}-900 bg-opacity-20 p-3 rounded`}>
                                    <div className={`text-${stat.color}-400 text-xs font-bold`}>{stat.label}</div>
                                    <div className="text-2xl font-bold text-slate-200">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {books.map((book) => (
                                <div key={book.id} className="border border-slate-700 bg-slate-900 bg-opacity-50 rounded-lg overflow-hidden hover:border-purple-500 transition">
                                    <div className="aspect-[3/4] relative bg-slate-800">
                                        {book.cover_url ? (
                                            <Image src={book.cover_url} alt={book.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-600">📖</div>
                                        )}
                                        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${
                                            book.reading_status === 'completed' ? 'bg-green-600 text-white' :
                                            book.reading_status === 'reading' ? 'bg-purple-600 text-white' :
                                            book.reading_status === 'wishlist' ? 'bg-blue-600 text-white' :
                                            'bg-slate-600 text-white'
                                        }`}>
                                            {book.reading_status}
                                        </span>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-slate-200 line-clamp-2 mb-1">{book.title}</h3>
                                        <p className="text-slate-500 text-xs mb-2">{book.authors?.name}</p>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {book.genre && (
                                                <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">{book.genre}</span>
                                            )}
                                            {book.sub_genre?.split(',').map((sg, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-purple-900 bg-opacity-50 text-purple-300 text-xs rounded">{sg.trim()}</span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal('book', book)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded transition"
                                            >
                                                <Edit2 className="w-3 h-3" /> edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBook(book.id)}
                                                className="p-1.5 border border-red-800 hover:bg-red-900 text-red-400 rounded transition"
                                                title="delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quotes Tab */}
                {activeTab === 'quotes' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border border-yellow-700 bg-yellow-900 bg-opacity-20 p-3 rounded">
                                <div className="text-yellow-400 text-xs font-bold">Total Quotes</div>
                                <div className="text-2xl font-bold text-slate-200">{quotes.length}</div>
                            </div>
                            <div className="border border-pink-700 bg-pink-900 bg-opacity-20 p-3 rounded">
                                <div className="text-pink-400 text-xs font-bold">Favorites</div>
                                <div className="text-2xl font-bold text-slate-200">{quotes.filter(q => q.is_favorite).length}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {quotes.map((quote) => (
                                <div key={quote.id} className={`border-l-4 p-4 rounded-r bg-slate-900 bg-opacity-50 ${quote.is_favorite ? 'border-l-yellow-400' : 'border-l-slate-600'}`}>
                                    <div className="flex justify-between items-start gap-3 mb-2">
                                        <span className="text-purple-300 text-xs font-bold">{quote.books?.title}</span>
                                        <button
                                            onClick={() => handleToggleFavorite(quote)}
                                            className={quote.is_favorite ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}
                                            title={quote.is_favorite ? 'remove from favorites' : 'add to favorites'}
                                        >
                                            <Star className={`w-4 h-4 ${quote.is_favorite ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                    <p className="text-slate-300 italic mb-2">"{quote.text}"</p>
                                    <div className="flex justify-between items-center">
                                        {quote.page_number && <span className="text-slate-500 text-xs">page {quote.page_number}</span>}
                                        <button
                                            onClick={() => handleDeleteQuote(quote.id)}
                                            className="text-red-400 hover:text-red-300 transition p-1 rounded hover:bg-red-900/30"
                                            title="delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        <div className="border border-amber-700 bg-amber-900 bg-opacity-20 p-3 rounded">
                            <div className="text-amber-400 text-xs font-bold">Total Notes</div>
                            <div className="text-2xl font-bold text-slate-200">{notes.length}</div>
                        </div>

                        <div className="space-y-3">
                            {notes.map((note) => {
                                const book = books.find(b => b.id === note.book_id)
                                return (
                                    <div key={note.id} className="border border-amber-800 bg-slate-900 p-4 rounded">
                                        <div className="flex justify-between items-start gap-3 mb-2">
                                            <div>
                                                <span className="text-amber-300 text-xs font-bold">{book?.title || 'Unknown'}</span>
                                                <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                                                    note.note_type === 'summary' ? 'bg-blue-900 text-blue-300' :
                                                    note.note_type === 'analysis' ? 'bg-purple-900 text-purple-300' :
                                                    note.note_type === 'idea' ? 'bg-green-900 text-green-300' :
                                                    'bg-slate-700 text-slate-300'
                                                }`}>
                                                    {note.note_type}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="text-red-400 hover:text-red-300 transition p-1 rounded hover:bg-red-900/30"
                                                title="delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-slate-300 whitespace-pre-wrap">{note.content}</p>
                                        <span className="text-slate-600 text-xs mt-2 block">{new Date(note.created_at).toLocaleDateString()}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Authors Tab */}
                {activeTab === 'authors' && (
                    <div className="space-y-4">
                        <div className="border border-slate-700 bg-slate-900 bg-opacity-50 p-3 rounded">
                            <div className="text-slate-400 text-xs font-bold">Total Authors</div>
                            <div className="text-2xl font-bold text-slate-200">{authors.length}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {authors.map((author) => (
                                <div key={author.id} className="border border-slate-700 bg-slate-900 bg-opacity-50 p-4 rounded-lg">
                                    <div className="flex gap-3 mb-3">
                                        <div className="w-16 h-20 bg-slate-800 relative overflow-hidden rounded flex-shrink-0">
                                            {author.photo_url ? (
                                                <Image src={author.photo_url} alt={author.name} fill sizes="64px" className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-600">👤</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-200">{author.name}</h3>
                                            <p className="text-slate-500 text-xs">{author.nationality || 'Unknown'}</p>
                                            {author.birth_year && <p className="text-slate-600 text-xs">b. {author.birth_year}</p>}
                                        </div>
                                    </div>
                                    {author.bio && <p className="text-slate-400 text-xs line-clamp-3">{author.bio}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Add Button */}
            <button
                onClick={() => openModal(tabToModalType[activeTab])}
                className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition"
                title="add new"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-4 py-3 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-200">
                                {modalType === 'book' && (editingBook ? 'Edit Book' : 'Add Book')}
                                {modalType === 'quote' && 'Add Quote'}
                                {modalType === 'note' && 'Add Note'}
                                {modalType === 'author' && 'Add Author'}
                            </h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm() }}
                                className="text-slate-400 hover:text-slate-200 transition p-1 rounded hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Book Form */}
                            {modalType === 'book' && (
                                <form onSubmit={editingBook ? handleEditBook : handleAddBook} className="space-y-4">
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">author *</label>
                                        <select
                                            value={formData.author_id}
                                            onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        >
                                            <option value="">select author...</option>
                                            {authors.map((author) => (
                                                <option key={author.id} value={author.id}>{author.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">isbn</label>
                                            <input
                                                type="text"
                                                value={formData.isbn}
                                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">year</label>
                                            <input
                                                type="number"
                                                value={formData.published_year}
                                                onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">pages</label>
                                            <input
                                                type="number"
                                                value={formData.pages}
                                                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">publisher</label>
                                            <input
                                                type="text"
                                                value={formData.publisher}
                                                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">language</label>
                                            <select
                                                value={formData.language}
                                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            >
                                                <option value="id">id</option>
                                                <option value="en">en</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">genre</label>
                                            <select
                                                value={formData.genre}
                                                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            >
                                                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">status</label>
                                            <select
                                                value={formData.reading_status}
                                                onChange={(e) => setFormData({ ...formData, reading_status: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            >
                                                <option value="to-read">to-read</option>
                                                <option value="reading">reading</option>
                                                <option value="completed">completed</option>
                                                <option value="wishlist">wishlist</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">current page</label>
                                            <input
                                                type="number"
                                                value={formData.current_page}
                                                onChange={(e) => setFormData({ ...formData, current_page: e.target.value })}
                                                disabled={formData.reading_status === 'to-read' || formData.reading_status === 'wishlist'}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {(formData.reading_status === 'reading' || formData.reading_status === 'completed') && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-slate-400 text-xs font-bold block mb-1">started</label>
                                                <input
                                                    type="date"
                                                    value={formData.started_at}
                                                    onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                                />
                                            </div>
                                            {formData.reading_status === 'completed' && (
                                                <div>
                                                    <label className="text-slate-400 text-xs font-bold block mb-1">finished</label>
                                                    <input
                                                        type="date"
                                                        value={formData.finished_at}
                                                        onChange={(e) => setFormData({ ...formData, finished_at: e.target.value })}
                                                        className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">sub-genres</label>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {formData.sub_genres.map((sg, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900 bg-opacity-50 border border-purple-600 text-purple-200 text-xs rounded">
                                                        {sg}
                                                        <button type="button" onClick={() => setFormData({ ...formData, sub_genres: formData.sub_genres.filter((_, idx) => idx !== i) })} className="text-purple-400 hover:text-purple-200 p-0.5 rounded hover:bg-purple-800">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                value=""
                                                onChange={(e) => {
                                                    if (e.target.value && !formData.sub_genres.includes(e.target.value)) {
                                                        setFormData({ ...formData, sub_genres: [...formData.sub_genres, e.target.value as typeof formData.sub_genres[number]] })
                                                    }
                                                }}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            >
                                                <option value="">+ add existing...</option>
                                                {SUB_GENRES.filter(sg => !formData.sub_genres.includes(sg)).map((sg) => (
                                                    <option key={sg} value={sg}>{sg}</option>
                                                ))}
                                            </select>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newSubGenre}
                                                    onChange={(e) => setNewSubGenre(e.target.value)}
                                                    placeholder="new sub-genre..."
                                                    className="flex-1 px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const trimmed = newSubGenre.trim()
                                                        if (trimmed && !formData.sub_genres.includes(trimmed)) {
                                                            setFormData({ ...formData, sub_genres: [...formData.sub_genres, trimmed] })
                                                            if (!(SUB_GENRES as readonly string[]).includes(trimmed)) {
                                                                setCustomSubGenres([...customSubGenres, trimmed])
                                                            }
                                                            setNewSubGenre('')
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded"
                                                >
                                                    add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">summary</label>
                                        <textarea
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            rows={4}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none resize-y"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">cover image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            disabled={uploadingCover}
                                            className="w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:bg-purple-600 file:border-0 file:text-white file:rounded file:cursor-pointer"
                                        />
                                        {uploadingCover && <p className="text-purple-300 text-xs mt-1">uploading...</p>}
                                        {coverPreview && (
                                            <div className="mt-2 w-20 h-28 bg-slate-800 relative overflow-hidden rounded">
                                                <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" disabled={submitting} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold rounded transition flex items-center justify-center gap-2">
                                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> saving...</> : editingBook ? 'update book' : 'save book'}
                                    </button>
                                </form>
                            )}

                            {/* Quote Form */}
                            {modalType === 'quote' && (
                                <form onSubmit={handleAddQuote} className="space-y-4">
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">book *</label>
                                        <select
                                            value={quoteData.book_id}
                                            onChange={(e) => setQuoteData({ ...quoteData, book_id: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        >
                                            <option value="">select book...</option>
                                            {books.map((book) => (
                                                <option key={book.id} value={book.id}>{book.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">page</label>
                                        <input
                                            type="number"
                                            value={quoteData.page_number}
                                            onChange={(e) => setQuoteData({ ...quoteData, page_number: e.target.value })}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">quote *</label>
                                        <textarea
                                            value={quoteData.text}
                                            onChange={(e) => setQuoteData({ ...quoteData, text: e.target.value })}
                                            required
                                            rows={4}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none resize-y"
                                            placeholder="the quote..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="favorite"
                                            checked={quoteData.is_favorite}
                                            onChange={(e) => setQuoteData({ ...quoteData, is_favorite: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="favorite" className="text-slate-400 text-sm">mark as favorite</label>
                                    </div>
                                    <button type="submit" disabled={submitting} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold rounded transition flex items-center justify-center gap-2">
                                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> saving...</> : 'save quote'}
                                    </button>
                                </form>
                            )}

                            {/* Note Form */}
                            {modalType === 'note' && (
                                <form onSubmit={handleAddNote} className="space-y-4">
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">book *</label>
                                        <select
                                            value={noteData.book_id}
                                            onChange={(e) => setNoteData({ ...noteData, book_id: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        >
                                            <option value="">select book...</option>
                                            {books.map((book) => (
                                                <option key={book.id} value={book.id}>{book.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">type</label>
                                        <select
                                            value={noteData.note_type}
                                            onChange={(e) => setNoteData({ ...noteData, note_type: e.target.value })}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        >
                                            <option value="general">general</option>
                                            <option value="summary">summary</option>
                                            <option value="analysis">analysis</option>
                                            <option value="idea">idea</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">note *</label>
                                        <textarea
                                            value={noteData.content}
                                            onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                                            required
                                            rows={6}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none resize-y"
                                            placeholder="your notes..."
                                        />
                                    </div>
                                    <button type="submit" disabled={submitting} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold rounded transition flex items-center justify-center gap-2">
                                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> saving...</> : 'save note'}
                                    </button>
                                </form>
                            )}

                            {/* Author Form */}
                            {modalType === 'author' && (
                                <form onSubmit={handleAddAuthor} className="space-y-4">
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">name *</label>
                                        <input
                                            type="text"
                                            value={authorData.name}
                                            onChange={(e) => setAuthorData({ ...authorData, name: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">nationality</label>
                                            <input
                                                type="text"
                                                value={authorData.nationality}
                                                onChange={(e) => setAuthorData({ ...authorData, nationality: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 text-xs font-bold block mb-1">birth year</label>
                                            <input
                                                type="number"
                                                value={authorData.birth_year}
                                                onChange={(e) => setAuthorData({ ...authorData, birth_year: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAuthorPhotoUpload}
                                            disabled={uploadingAuthorPhoto}
                                            className="w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:bg-purple-600 file:border-0 file:text-white file:rounded file:cursor-pointer"
                                        />
                                        {uploadingAuthorPhoto && <p className="text-purple-300 text-xs mt-1">uploading...</p>}
                                        <input
                                            type="url"
                                            value={authorData.photo_url}
                                            onChange={(e) => setAuthorData({ ...authorData, photo_url: e.target.value })}
                                            placeholder="or paste image URL..."
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none mt-2"
                                        />
                                        {(authorPhotoPreview || authorData.photo_url) && (
                                            <div className="mt-2 w-16 h-20 bg-slate-800 relative overflow-hidden rounded">
                                                <img 
                                                    src={authorPhotoPreview || authorData.photo_url} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold block mb-1">bio</label>
                                        <textarea
                                            value={authorData.bio}
                                            onChange={(e) => setAuthorData({ ...authorData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-sm rounded focus:border-purple-500 outline-none resize-y"
                                        />
                                    </div>
                                    <button type="submit" disabled={submitting} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold rounded transition flex items-center justify-center gap-2">
                                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> saving...</> : 'save author'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
