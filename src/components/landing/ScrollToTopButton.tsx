'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls down 300px
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all hover:-translate-y-1"
      aria-label="Go to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
