'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function TestPage() {
    const [books, setBooks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBooks() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('books')
                .select(`
          *,
          authors (name),
          quotes (text)
        `)

            if (error) {
                console.error('Error:', error)
            } else {
                setBooks(data || [])
            }
            setLoading(false)
        }

        fetchBooks()
    }, [])

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
            <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(books, null, 2)}
            </pre>
        </div>
    )
}