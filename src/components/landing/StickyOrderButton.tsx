'use client'

import { useState, useEffect } from 'react'

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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
    >
      <a 
        href="#order-form" 
        className="flex items-center justify-center px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] hover:scale-105 transition-all duration-300 animate-bounce group"
      >
        <span>اطلب الآن</span>
      </a>
    </div>
  )
}
