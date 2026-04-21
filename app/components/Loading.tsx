'use client'

import { useEffect, useState } from 'react'

interface LoadingProps {
  text?: string
  fullPage?: boolean
}

export default function Loading({ text = 'loading', fullPage = false }: LoadingProps) {
  const [dots, setDots] = useState('')
  const [spinnerIdx, setSpinnerIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)

    const spinnerInterval = setInterval(() => {
      setSpinnerIdx((prev) => (prev + 1) % spinners.length)
    }, 80)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 10))
    }, 200)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(spinnerInterval)
      clearInterval(progressInterval)
    }
  }, [spinners.length])

  const content = (
    <div className="flex flex-col items-center justify-center gap-6 p-12 font-mono">
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl text-[#d97757] animate-pulse">{spinners[spinnerIdx]}</div>
        <div className="text-slate-400 text-sm tracking-widest uppercase">
          {text}
          <span className="inline-block w-8 text-left">{dots}</span>
        </div>
      </div>

      <div className="w-64 h-1 bg-neutral-800 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-[#d97757] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(217,119,87,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-[10px] text-slate-600 flex justify-between w-64 uppercase tracking-tighter">
        <span>system_boot</span>
        <span>{Math.floor(progress)}%</span>
      </div>
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}
