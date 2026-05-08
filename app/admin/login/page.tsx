'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'
import RevealSection from '@/app/components/RevealSection'

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
            <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d97757] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-md z-10">
                    <RevealSection as="div" variant="up" className="ukbox p-8 md:p-10 relative overflow-hidden group">
                        {/* Glassmorphism Inner Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        <div className="text-center mb-8 relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <PixelArtIcon name="Lock" size={16} color="#d97757" />
                                <div className="text-slate-500 text-xs uppercase tracking-widest">ukbook system</div>
                            </div>
                            <h1 className="font-serif tracking-tight text-3xl font-bold text-slate-200">admin login</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {error && (
                                <div className="border border-red-900/50 bg-red-950/40 text-red-400 p-3 text-sm rounded-lg animate-fade-in-up">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-xs text-slate-400 uppercase tracking-widest mb-2 font-medium">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="ukinput w-full px-4 py-3 rounded-lg text-slate-200 focus:outline-none focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]/50 transition-all bg-black/50"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs text-slate-400 uppercase tracking-widest mb-2 font-medium">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="ukinput w-full px-4 py-3 rounded-lg text-slate-200 focus:outline-none focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]/50 transition-all bg-black/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-[#d97757] text-white font-medium hover:bg-[#e09e72] transition-colors shadow-[0_0_15px_rgba(217,119,87,0.3)] hover:shadow-[0_0_25px_rgba(217,119,87,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'authenticating...' : 'login'}
                            </button>
                        </form>

                        <div className="mt-8 text-center relative z-10">
                            <Link
                                href="/"
                                className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300"
                            >
                                ← back to library
                            </Link>
                        </div>
                    </RevealSection>
                </div>
            </main>
        </div>
    )
}
