'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { GENRES, SUB_GENRES } from '@/lib/constants/library'

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

export default function AdminPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [books, setBooks] = useState<Book[]>([])
    const [authors, setAuthors] = useState<Author[]>([])
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [showAuthorForm, setShowAuthorForm] = useState(false)
    const [showQuoteForm, setShowQuoteForm] = useState(false)
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
        sub_genre: '',
        started_at: '',
        finished_at: '',
        current_page: '',
    })
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>('')
    const [uploadingCover, setUploadingCover] = useState(false)
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

    useEffect(() => {
        fetchBooks()
        fetchAuthors()
        fetchQuotes()
    }, [])

    const fetchBooks = async () => {
        try {
            setLoading(true)
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

    const uploadCoverToStorage = async (file: File): Promise<string> => {
        setUploadingCover(true)
        try {
            const supabase = createClient()
            const fileName = `${Date.now()}-${file.name}`
            const { error, data } = await supabase.storage
                .from('book-covers')
                .upload(fileName, file)

            if (error) throw error

            const { data: publicData } = supabase.storage
                .from('book-covers')
                .getPublicUrl(data.path)

            return publicData.publicUrl
        } catch (error) {
            console.error('Error uploading cover:', error)
            throw error
        } finally {
            setUploadingCover(false)
        }
    }

    const handleAddAuthor = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authorData),
            })

            if (!response.ok) throw new Error('Failed to add author')

            await fetchAuthors()
            setShowAuthorForm(false)
            setAuthorData({
                name: '',
                bio: '',
                nationality: '',
                birth_year: new Date().getFullYear(),
                photo_url: '',
            })
        } catch (error) {
            console.error('Error adding author:', error)
        }
    }

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            let coverUrl = formData.cover_url

            // Upload cover image if selected
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
                }),
            })

            if (!response.ok) throw new Error('Failed to add book')

            await fetchBooks()
            setShowForm(false)
            resetForm()
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

    const handleEditBook = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingBook) return

        try {
            const response = await fetch(`/api/books/${editingBook.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    published_year: formData.published_year ? parseInt(formData.published_year.toString()) : null,
                    pages: formData.pages ? parseInt(formData.pages.toString()) : null,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update book')
            }

            await fetchBooks()
            setEditingBook(null)
            resetForm()
        } catch (error) {
            console.error('Error updating book:', error)
        }
    }

    const handleDeleteBook = async (id: string) => {
        if (!confirm('Are you sure you want to delete this book?')) return

        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete book')

            await fetchBooks()
        } catch (error) {
            console.error('Error deleting book:', error)
        }
    }

    const handleAddQuote = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...quoteData,
                    page_number: quoteData.page_number ? parseInt(quoteData.page_number) : null,
                }),
            })

            if (!response.ok) throw new Error('Failed to add quote')

            await fetchQuotes()
            setShowQuoteForm(false)
            setQuoteData({ book_id: '', text: '', page_number: '', is_favorite: false })
        } catch (error) {
            console.error('Error adding quote:', error)
        }
    }

    const handleToggleFavorite = async (quote: Quote) => {
        try {
            const response = await fetch(`/api/quotes/${quote.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...quote,
                    is_favorite: !quote.is_favorite,
                }),
            })

            if (!response.ok) throw new Error('Failed to toggle favorite')

            await fetchQuotes()
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const handleDeleteQuote = async (id: string) => {
        if (!confirm('Delete this quote?')) return

        try {
            const response = await fetch(`/api/quotes/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete quote')

            await fetchQuotes()
        } catch (error) {
            console.error('Error deleting quote:', error)
        }
    }

    const handleEdit = (book: Book) => {
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
            sub_genre: book.sub_genre || '',
            started_at: book.started_at || '',
            finished_at: book.finished_at || '',
            current_page: book.current_page?.toString() || '',
        })
        setShowForm(true)
    }

    const resetForm = () => {
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
            sub_genre: '',
            started_at: '',
            finished_at: '',
            current_page: '',
        })
        setCoverFile(null)
        setCoverPreview('')
        setEditingBook(null)
        setShowForm(false)
    }

    return (
        <div className="min-h-screen bg-black text-slate-100 font-mono" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
            {/* Terminal Header */}
            <div className="border-b border-slate-700 bg-black bg-opacity-60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-slate-300 text-lg font-bold">➜<Link href="/"> uk-books</Link></div>
                        <div className="text-slate-600 text-xs">admin@terminal</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition font-bold"
                        >
                            exit
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'BOOKS', value: books.length, color: '#64748b' },
                        { label: 'AUTHORS', value: authors.length, color: '#64748b' },
                        { label: 'READING', value: books.filter(b => b.reading_status === 'reading').length, color: '#7c3aed' },
                        { label: 'DONE', value: books.filter(b => b.reading_status === 'completed').length, color: '#64748b' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="border border-slate-700 bg-black bg-opacity-40 p-4 transition hover:bg-opacity-60"
                            style={{
                                borderColor: stat.color,
                                boxShadow: `inset 0 0 1px ${stat.color}60`
                            }}
                        >
                            <div className="text-xs font-bold tracking-wide text-slate-400" style={{ color: stat.color }}>
                                {stat.label}
                            </div>
                            <div className="text-2xl font-bold mt-2 text-slate-100">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Books Management */}
                    <div className="lg:col-span-2 border-2 border-slate-600 bg-black">
                        <div className="border-b border-slate-600 px-4 py-2 flex justify-between items-center bg-slate-600 bg-opacity-5">
                            <div className="text-slate-300 font-bold text-sm">$ books --manage</div>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-slate-300 hover:text-slate-200 font-bold text-xs border border-slate-600 px-2 py-1 transition"
                                >
                                    [+] new
                                </button>
                            )}
                        </div>

                        {/* Add Book Form */}
                        {showForm && (
                            <div className="p-4 border-b border-slate-600 space-y-4 bg-black bg-opacity-50 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <div className="text-slate-300 text-xs font-bold">▶ add-book-form</div>
                                <form onSubmit={editingBook ? handleEditBook : handleAddBook} className="space-y-4">
                                    {/* Basic Info Section */}
                                    <div className="border border-slate-700 p-3 space-y-2 bg-black bg-opacity-30">
                                        <div className="text-slate-400 text-xs font-bold mb-2">▸ basic info</div>
                                        <div>
                                            <label className="text-slate-200 text-xs font-bold block mb-1">title *</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 focus:ring-1 focus:ring-purple-600 outline-none font-mono rounded"
                                                placeholder="book title..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-200 text-xs font-bold block mb-1">author *</label>
                                            <select
                                                value={formData.author_id}
                                                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 focus:ring-1 focus:ring-purple-600 outline-none font-mono rounded"
                                            >
                                                <option value="" className="bg-black text-slate-200">select author...</option>
                                                {authors.map((author) => (
                                                    <option key={author.id} value={author.id} className="bg-black text-slate-200">
                                                        {author.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">isbn</label>
                                                <input
                                                    type="text"
                                                    value={formData.isbn}
                                                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                    placeholder="isbn..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">year</label>
                                                <input
                                                    type="number"
                                                    value={formData.published_year}
                                                    onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">pages</label>
                                                <input
                                                    type="number"
                                                    value={formData.pages}
                                                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">publisher</label>
                                                <input
                                                    type="text"
                                                    value={formData.publisher}
                                                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                    placeholder="publisher..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Section - Full Width */}
                                    <div className="border border-slate-700 p-3 space-y-2 bg-black bg-opacity-30">
                                        <div className="text-slate-400 text-xs font-bold mb-2">▸ summary</div>
                                        <textarea
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded resize-vertical"
                                            placeholder="book summary (long text)..."
                                            rows={6}
                                        />
                                        <div className="text-slate-500 text-xs">{formData.summary.length} characters</div>
                                    </div>

                                    {/* Classification Section */}
                                    <div className="border border-slate-700 p-3 space-y-2 bg-black bg-opacity-30">
                                        <div className="text-slate-400 text-xs font-bold mb-2">▸ classification</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">language</label>
                                                <select
                                                    value={formData.language}
                                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                >
                                                    <option value="id" className="bg-black">id</option>
                                                    <option value="en" className="bg-black">en</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">genre</label>
                                                <select
                                                    value={formData.genre}
                                                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                >
                                                    {GENRES.map((genre) => (
                                                        <option key={genre} value={genre} className="bg-black">
                                                            {genre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">sub-genre</label>
                                                <select
                                                    value={formData.sub_genre}
                                                    onChange={(e) => setFormData({ ...formData, sub_genre: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                >
                                                    <option value="" className="bg-black">none</option>
                                                    {SUB_GENRES.map((subGenre) => (
                                                        <option key={subGenre} value={subGenre} className="bg-black">
                                                            {subGenre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reading Status Section */}
                                    <div className="border border-slate-700 p-3 space-y-2 bg-black bg-opacity-30">
                                        <div className="text-slate-400 text-xs font-bold mb-2">▸ reading status</div>
                                        <div>
                                            <label className="text-slate-200 text-xs font-bold block mb-1">status</label>
                                            <select
                                                value={formData.reading_status}
                                                onChange={(e) => setFormData({ ...formData, reading_status: e.target.value })}
                                                className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                            >
                                                <option value="to-read" className="bg-black">to-read</option>
                                                <option value="reading" className="bg-black">reading</option>
                                                <option value="completed" className="bg-black">completed</option>
                                                <option value="wishlist" className="bg-black">wishlist</option>
                                            </select>
                                        </div>

                                        {(formData.reading_status === 'reading' || formData.reading_status === 'completed') && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-slate-200 text-xs font-bold block mb-1">started</label>
                                                    <input
                                                        type="date"
                                                        value={formData.started_at}
                                                        onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                                                        className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                    />
                                                </div>
                                                {formData.reading_status === 'completed' && (
                                                    <div>
                                                        <label className="text-slate-200 text-xs font-bold block mb-1">finished</label>
                                                        <input
                                                            type="date"
                                                            value={formData.finished_at}
                                                            onChange={(e) => setFormData({ ...formData, finished_at: e.target.value })}
                                                            className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {formData.reading_status === 'reading' && (
                                            <div>
                                                <label className="text-slate-200 text-xs font-bold block mb-1">current page</label>
                                                <input
                                                    type="number"
                                                    value={formData.current_page}
                                                    onChange={(e) => setFormData({ ...formData, current_page: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs focus:border-purple-400 outline-none font-mono rounded"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Cover Image Section */}
                                    <div className="border border-slate-700 p-3 space-y-2 bg-black bg-opacity-30">
                                        <div className="text-slate-400 text-xs font-bold mb-2">▸ cover image</div>
                                        <div className="flex gap-3 items-start flex-col sm:flex-row">
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCoverUpload}
                                                    disabled={uploadingCover}
                                                    className="w-full px-3 py-2 bg-black border border-slate-600 text-slate-200 text-xs cursor-pointer file:cursor-pointer file:bg-purple-600 file:border-0 file:px-3 file:py-1 file:text-black file:font-bold file:text-xs rounded"
                                                />
                                                {uploadingCover && <p className="text-purple-300 text-xs mt-1 font-bold">⟳ uploading...</p>}
                                            </div>
                                            {coverPreview && (
                                                <div className="w-24 h-32 border border-slate-500 bg-black overflow-hidden flex-shrink-0 rounded">
                                                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-black transition font-bold text-xs rounded"
                                        >
                                            {editingBook ? '⟳ update' : '✓ save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition font-bold text-xs rounded"
                                        >
                                            ✕ cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Books List */}
                        {loading ? (
                            <div className="p-4 text-purple-300 text-xs">
                                ⟳ loading books...
                            </div>
                        ) : books.length === 0 ? (
                            <div className="p-4 text-slate-500 text-xs">
                                <span className="text-slate-600">root@terminal:</span> no books found. use <span className="text-slate-300">[+] new</span> to add
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-600 bg-slate-600 bg-opacity-5">
                                            <th className="px-3 py-2 text-left text-slate-300 font-bold">TITLE</th>
                                            <th className="px-3 py-2 text-left text-slate-300 font-bold">AUTHOR</th>
                                            <th className="px-3 py-2 text-left text-slate-300 font-bold">YEAR</th>
                                            <th className="px-3 py-2 text-left text-slate-300 font-bold">SUB-GENRE</th>
                                            <th className="px-3 py-2 text-left text-slate-300 font-bold">STATUS</th>
                                            <th className="px-3 py-2 text-right text-slate-300 font-bold">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.map((book, idx) => (
                                            <tr
                                                key={book.id}
                                                className="border-b border-slate-600 border-opacity-30 hover:bg-slate-600 hover:bg-opacity-5 transition"
                                            >
                                                <td className="px-3 py-2 text-slate-200">{book.title}</td>
                                                <td className="px-3 py-2 text-slate-400">{book.authors?.name || '-'}</td>
                                                <td className="px-3 py-2 text-slate-500">{book.published_year || '-'}</td>
                                                <td className="px-3 py-2 text-slate-500">{book.sub_genre || '-'}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`text-xs font-bold ${book.reading_status === 'completed' ? 'text-slate-400' :
                                                        book.reading_status === 'reading' ? 'text-purple-300' :
                                                            'text-slate-500'
                                                        }`}>
                                                        [{book.reading_status}]
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-right space-x-1">
                                                    <button
                                                        onClick={() => handleEdit(book)}
                                                        className="text-purple-300 hover:text-purple-200 font-bold transition"
                                                    >
                                                        edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="text-slate-600 hover:text-slate-400 font-bold transition"
                                                    >
                                                        del
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Quotes Management */}
                    <div className="border-2 border-purple-700 bg-black lg:col-span-4">
                        <div className="border-b border-purple-700 px-4 py-2 flex justify-between items-center bg-purple-700 bg-opacity-5">
                            <div className="text-purple-300 font-bold text-sm">$ quotes --loved</div>
                            {!showQuoteForm && (
                                <button
                                    onClick={() => setShowQuoteForm(true)}
                                    className="text-purple-300 hover:text-purple-200 font-bold text-xs border border-purple-700 px-2 py-1 transition"
                                >
                                    [+] new
                                </button>
                            )}
                        </div>

                        {/* Add Quote Form */}
                        {showQuoteForm && (
                            <div className="p-4 border-b border-purple-700 space-y-3 bg-black bg-opacity-50">
                                <div className="text-purple-300 text-xs font-bold">▶ capture-quote</div>
                                <form onSubmit={handleAddQuote} className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-purple-200 text-xs font-bold block mb-1">book *</label>
                                            <select
                                                value={quoteData.book_id}
                                                onChange={(e) => setQuoteData({ ...quoteData, book_id: e.target.value })}
                                                required
                                                className="w-full px-2 py-1 bg-black border border-purple-700 text-purple-200 text-xs focus:border-yellow-300 outline-none font-mono"
                                            >
                                                <option value="" className="bg-black">select book...</option>
                                                {books.map((book) => (
                                                    <option key={book.id} value={book.id} className="bg-black">
                                                        {book.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-purple-200 text-xs font-bold block mb-1">page</label>
                                            <input
                                                type="number"
                                                value={quoteData.page_number}
                                                onChange={(e) => setQuoteData({ ...quoteData, page_number: e.target.value })}
                                                className="w-full px-2 py-1 bg-black border border-purple-700 text-purple-200 text-xs outline-none font-mono"
                                                placeholder="page number..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-purple-200 text-xs font-bold block mb-1">quote *</label>
                                        <textarea
                                            value={quoteData.text}
                                            onChange={(e) => setQuoteData({ ...quoteData, text: e.target.value })}
                                            required
                                            className="w-full px-2 py-1 bg-black border border-purple-700 text-purple-200 text-xs outline-none font-mono"
                                            placeholder="the quote you loved..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={quoteData.is_favorite}
                                            onChange={(e) => setQuoteData({ ...quoteData, is_favorite: e.target.checked })}
                                            className="cursor-pointer"
                                        />
                                        <label className="text-purple-200 text-xs font-bold">mark as favorite</label>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="submit"
                                            className="px-3 py-1 border border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-black transition font-bold text-xs"
                                        >
                                            save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowQuoteForm(false)}
                                            className="px-3 py-1 border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition font-bold text-xs"
                                        >
                                            cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Quotes List */}
                        {quotes.length === 0 ? (
                            <div className="p-4 text-slate-600 text-xs">
                                <span className="text-slate-600">root@terminal:</span> no quotes yet. capture one with <span className="text-purple-300">[+] new</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                {quotes.map((quote) => (
                                    <div
                                        key={quote.id}
                                        className={`p-3 border-l-4 hover:bg-opacity-5 hover:bg-purple-700 transition text-xs ${quote.is_favorite ? 'border-l-yellow-400 bg-purple-700 bg-opacity-5' : 'border-l-gray-600'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <div className="text-purple-200 font-bold truncate flex-1">
                                                {quote.books?.title}
                                            </div>
                                            <button
                                                onClick={() => handleToggleFavorite(quote)}
                                                className={`flex-shrink-0 ${quote.is_favorite ? 'text-purple-400 hover:text-purple-300' : 'text-slate-500 hover:text-purple-300'} transition`}
                                                title="mark as favorite"
                                            >
                                                {quote.is_favorite ? '❤' : '♡'}
                                            </button>
                                        </div>
                                        <div className="text-slate-300 mb-2 line-clamp-2 italic">"{quote.text}"</div>
                                        <div className="flex gap-2 items-center text-slate-600 mb-2">
                                            {quote.page_number && <span>pg {quote.page_number}</span>}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteQuote(quote.id)}
                                            className="text-red-400 hover:text-red-300 font-bold transition text-xs"
                                        >
                                            [delete]
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Authors Sidebar */}
                    <div className="border-2 border-slate-500 bg-black h-fit lg:col-span-1">
                        <div className="border-b border-slate-500 px-4 py-2 bg-slate-500 bg-opacity-5 flex justify-between items-center">
                            <div className="text-slate-300 font-bold text-sm">$ authors</div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/authors"
                                    className="text-slate-300 hover:text-slate-200 font-bold text-xs border border-slate-500 px-2 py-1 transition"
                                >
                                    list
                                </Link>
                                <Link
                                    href="/authors/add"
                                    className="text-slate-300 hover:text-slate-200 font-bold text-xs border border-slate-500 px-2 py-1 transition"
                                >
                                    new
                                </Link>
                                {!showAuthorForm && (
                                    <button
                                        onClick={() => setShowAuthorForm(true)}
                                        className="text-slate-300 hover:text-slate-200 font-bold text-xs border border-slate-500 px-2 py-1 transition"
                                    >
                                        [+]
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Add Author Form */}
                        {showAuthorForm && (
                            <div className="p-3 border-b border-slate-500 space-y-2 bg-black bg-opacity-50">
                                <form onSubmit={handleAddAuthor} className="space-y-2">
                                    <div>
                                        <input
                                            type="text"
                                            value={authorData.name}
                                            onChange={(e) => setAuthorData({ ...authorData, name: e.target.value })}
                                            required
                                            className="w-full px-2 py-1 bg-black border border-slate-500 text-slate-300 text-xs outline-none font-mono"
                                            placeholder="name..."
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={authorData.nationality}
                                            onChange={(e) => setAuthorData({ ...authorData, nationality: e.target.value })}
                                            className="w-full px-2 py-1 bg-black border border-slate-500 text-slate-300 text-xs outline-none font-mono"
                                            placeholder="nationality..."
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 px-2 py-1 border border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-black transition font-bold text-xs"
                                        >
                                            add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAuthorForm(false)}
                                            className="flex-1 px-2 py-1 border border-slate-500 text-slate-400 hover:bg-slate-500 hover:text-black transition font-bold text-xs"
                                        >
                                            esc
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Authors List */}
                        <div className="max-h-96 overflow-y-auto">
                            {authors.map((author) => (
                                <div
                                    key={author.id}
                                    className="px-4 py-2 border-b border-slate-500 border-opacity-30 hover:bg-slate-500 hover:bg-opacity-5 transition text-xs"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-slate-300 font-bold">{author.name}</div>
                                        <Link
                                            href={`/authors/${author.id}/edit`}
                                            className="text-slate-500 hover:text-slate-300 border border-slate-600 px-1.5 py-0.5 text-[10px] transition"
                                        >
                                            edit
                                        </Link>
                                    </div>
                                    {author.nationality && (
                                        <div className="text-slate-500 text-xs">◆ {author.nationality}</div>
                                    )}
                                </div>
                            ))}
                            {authors.length === 0 && (
                                <div className="p-4 text-slate-600 text-xs">
                                    no authors yet...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
