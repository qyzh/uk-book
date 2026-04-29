import Link from 'next/link'
import { X, Globe } from 'lucide-react'

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

interface SocialLink {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number }>
}

interface NavLink {
  href: string
  label: string
}

const socialLinks: SocialLink[] = [
  { href: 'https://twitter.com/asetdunia', label: 'Twitter @asetdunia', Icon: X },
  { href: 'https://instagram.com/syauqashdllh', label: 'Instagram syauqashdllh', Icon: InstagramIcon },
  { href: 'https://kyxis.my.id', label: 'kyxis.my.id', Icon: Globe },
]

const navLinks: NavLink[] = [
  { href: '/browse', label: 'explore' },
  { href: '/wishlist', label: 'wishlist' },
  { href: '/quotes', label: 'quotes' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#30302e] bg-[#141413]">

      <div className="max-w-7xl mx-auto px-12 py-8">

        {/* Profile row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-6">

          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-[#d97757] border-2 border-[#d97757]"
            style={{ background: 'linear-gradient(135deg, #1f1e1d, #2a2926)' }}
            aria-label="qyzh avatar"
          >
            q
          </div>

          {/* Name + bio */}
          <div className="flex-1">
            <p className="text-[#faf9f5] text-sm font-bold leading-none mb-1">qyzh</p>
            <p className="text-[#87867f] text-[11px] leading-relaxed">
              Personal book tracker &amp; quote collector.<br />
              Reading one page at a time.
            </p>
          </div>

          {/* Social icon buttons */}
          <div className="flex items-center gap-2.5 sm:ml-auto">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1a1918] border border-[#30302e] text-[#87867f] transition-colors duration-200 hover:border-[#d97757] hover:text-[#d97757]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {/* Big decorative display text */}
        <div className="relative overflow-hidden select-none pointer-events-none" aria-hidden="true">
          <p
            className="text-center font-bold leading-none text-[#faf9f5]"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(80px, 18vw, 220px)",
              opacity: 0.07,
              letterSpacing: "-0.02em",
              marginBottom: "-0.15em",
            }}
          >
            ukbuku
          </p>
        </div>
        {/* Divider */}
        <div className="border-t border-[#30302e] mb-4" />

        {/* Nav + copyright row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <nav className="flex items-center gap-5" aria-label="Footer navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#87867f] text-[11px] font-mono hover:text-[#faf9f5] transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-[#87867f] text-[10px] font-mono">
            © {new Date().getFullYear()} qyzh · Rak Buku Online
          </p>
        </div>

      </div>
    </footer>
  )
}
