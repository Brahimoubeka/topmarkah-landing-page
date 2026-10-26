'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'

export function StickyOrderButton() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the order form is visible, hide the button
          if (entry.isIntersecting) {
            setIsVisible(false)
          } else {
            setIsVisible(true)
          }
        })
      },
      { 
        // Trigger when at least 10% of the order form is in view
        threshold: 0.1,
        // Also trigger slightly before it enters if needed, but threshold 0.1 is fine 
      }
    )

    const orderSection = document.getElementById('order-form')
    if (orderSection) {
      observer.observe(orderSection)
    }

    return () => {
      if (orderSection) {
        observer.unobserve(orderSection)
      }
    }
  }, [])

  return (
    <div 
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
    >
      <a 
        href="#order-form" 
        className="flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-sm sm:text-base rounded-full hover:scale-105 active:scale-95 transition-all duration-300 animate-wave-glow group"
      >
        <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
        <span>اطلب الآن</span>
      </a>
    </div>
  )
}
