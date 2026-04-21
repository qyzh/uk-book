'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            router.push('/admin')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-slate-100 flex flex-col" style={{ fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace" }}>
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="border border-slate-700 bg-black bg-opacity-40 p-8">
                        <div className="text-center mb-8">
                            <div className="text-slate-500 text-xs uppercase tracking-widest mb-2">ukbook</div>
                            <h1 className="font-serif tracking-tight text-2xl font-bold text-slate-200">admin login</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="border border-red-800 bg-red-900 bg-opacity-30 text-red-300 p-3 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs text-slate-500 uppercase tracking-wide mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-black border border-slate-700 text-slate-200 focus:outline-none focus:border-[#d97757] transition"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs text-slate-500 uppercase tracking-wide mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-black border border-slate-700 text-slate-200 focus:outline-none focus:border-[#d97757] transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 border border-[#d97757] text-[#e09e72] hover:bg-[#d97757]/30 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'authenticating...' : 'login'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-slate-500 hover:text-slate-400 text-sm transition"
                            >
                                ← back to library
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-xs">
                crafted with ♡ • {new Date().getFullYear()}
            </footer>
        </div>
    )
}
