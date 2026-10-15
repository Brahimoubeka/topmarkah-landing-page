'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData, getFontClass } from '@/lib/section-config'

export function TestimonialsSection({ section, testimonials }: any) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily)

  const activeTestimonials = (testimonials || []).filter((t: any) => t.is_active !== false)
  const [current, setCurrent] = useState(0)

  if (activeTestimonials.length === 0) return null

  const currentItem = activeTestimonials[current] || activeTestimonials[0]

  const prev = () => setCurrent(i => (i - 1 + activeTestimonials.length) % activeTestimonials.length)
  const next = () => setCurrent(i => (i + 1) % activeTestimonials.length)

  return (
    <section id="testimonials" className="py-6 sm:py-10 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={parsed.title || 'آراء عملائنا'}
          subtitle={parsed.subtitle}
          icon={parsed.icon}
          titleColor={parsed.titleColor}
          fontSize={parsed.fontSize}
          fontFamily={parsed.fontFamily}
          className="mb-4 sm:mb-8"
        />

        {parsed.body && (
          <p className="text-center text-sm sm:text-base text-gray-600 max-w-2xl mx-auto -mt-2 mb-6 whitespace-pre-line">
            {parsed.body}
          </p>
        )}

        {/* ── Customer Reviews Image Carousel (Scrolls like product images) ── */}
        <div className={`bg-gray-50/80 rounded-2xl sm:rounded-3xl border border-gray-200/80 p-3 sm:p-6 shadow-sm ${fontClass}`}>
          <div className="relative select-none w-full max-w-xl mx-auto">
            {currentItem.image_url ? (
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] bg-gray-900/5 border border-gray-200 flex items-center justify-center shadow-inner">
                <img
                  key={current}
                  src={currentItem.image_url}
                  alt={currentItem.customer_name || `Review ${current + 1}`}
                  className="w-full h-full object-contain transition-opacity duration-300"
                  loading="lazy"
                  decoding="async"
                />

                {activeTestimonials.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-10"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-10"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}

                {/* Counter badge */}
                {activeTestimonials.length > 1 && (
                  <div className="absolute top-2.5 right-2.5 bg-black/65 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md z-10">
                    {current + 1} / {activeTestimonials.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-white border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <Quote className="w-10 h-10 text-primary/30 mb-3" />
                {currentItem.comment && (
                  <p className="text-gray-700 text-base sm:text-lg italic mb-2">"{currentItem.comment}"</p>
                )}
              </div>
            )}

            {/* Thumbnails row below */}
            {activeTestimonials.length > 1 && (
              <div className="flex gap-2.5 mt-3 justify-center flex-wrap">
                {activeTestimonials.map((t: any, i: number) => (
                  <button
                    key={t.id || i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`w-13 h-13 sm:w-15 sm:h-15 rounded-xl overflow-hidden transition-all border ${
                      i === current ? 'ring-2 ring-primary scale-105 shadow-md border-transparent' : 'opacity-60 hover:opacity-100 border-gray-200 bg-white'
                    }`}
                  >
                    {t.image_url ? (
                      <img src={t.image_url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">#{i + 1}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Feedback Details */}
          <div className="mt-4 pt-3 border-t border-gray-200/80 text-center max-w-xl mx-auto">
            {/* Stars */}
            <div className="flex justify-center items-center gap-1 mb-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < (currentItem.rating || 5)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            {currentItem.comment && (
              <p className="text-gray-700 text-sm sm:text-base italic mb-1.5 whitespace-pre-line leading-relaxed">
                "{currentItem.comment}"
              </p>
            )}

            {/* Customer Name */}
            {currentItem.customer_name && (
              <p className="font-bold text-gray-900 text-sm sm:text-base">
                {currentItem.customer_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
