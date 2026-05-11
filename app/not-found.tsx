import Link from 'next/link'
import { PixelArtIcon } from '@/lib/components/PixelArtIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-[var(--background)] text-[var(--foreground)] px-8 sm:px-16 md:px-24 lg:px-32 relative overflow-hidden">
      
      {/* Noise overlay for texture matching the image's grainy feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 z-10">
        
        <div className="flex flex-col gap-6 md:gap-8 w-full max-w-2xl animate-fade-in-up">
          <p className="text-sm tracking-wider font-medium text-[var(--color-text-secondary)]">
            Error 404
          </p>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05] font-[family-name:var(--font-playfair)]">
            There&apos;s no<br />
            light in here
          </h1>

          <p className="text-[var(--color-text-secondary)] text-base sm:text-lg lg:text-xl leading-relaxed mt-2 max-w-lg">
            The page you were looking for doesn&apos;t exist. You may have mistyped the address or the page may have moved.
          </p>

          <div className="pt-8 sm:pt-12">
            <Link 
              href="/"
              className="inline-block text-[var(--foreground)] hover:text-[var(--color-accent)] border-b border-[var(--foreground)] hover:border-[var(--color-accent)] pb-1 transition-colors duration-300 text-sm sm:text-base tracking-wide"
            >
              Return to homepage
            </Link>
          </div>
        </div>

        {/* Decorative Pixel Art Icon replacing a traditional illustration/image */}
        <div className="hidden md:flex justify-center items-center text-[var(--color-text-secondary)] opacity-[0.07] rotate-12 reveal in-view">
          <PixelArtIcon name="LightbulbOff" size={96} />
        </div>

      </div>
    </div>
  )
}
