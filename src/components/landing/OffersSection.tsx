'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Truck } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData, getFontClass } from '@/lib/section-config'
import { parseOfferData } from '@/lib/offer-helper'

function OfferImageSlideshow({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(i => (i - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(i => (i + 1) % images.length)
  }

  return (
    <div className="relative select-none w-full">
      {/* 4:3 Aspect Ratio - Big edge-to-edge on mobile with 0 margin to screen corners */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden sm:rounded-2xl shadow-sm">
        <img
          key={current}
          src={images[current]}
          alt={`${alt} - ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          decoding="async"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/65 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md z-10 shadow-sm">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails below if multiple */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 px-3 sm:px-0 justify-center flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setCurrent(i)
              }}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all border ${
                i === current ? 'ring-2 ring-primary scale-105 shadow-sm border-transparent' : 'opacity-60 hover:opacity-100 border-gray-200'
              }`}
            >
              <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function OffersSection({ section, offers }: any) {
  const parsed = parseSectionData(section)

  // Strictly sort offers according to admin display_order
  const sortedOffers = [...(offers || [])].sort((a: any, b: any) => {
    const ordA = Number(a.display_order ?? 0)
    const ordB = Number(b.display_order ?? 0)
    return ordA - ordB
  })

  return (
    <section id="offers" className="py-6 sm:py-10 bg-gray-50/70">
      {/* px-0 on mobile so images touch the corners of the screen with 0 margin */}
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <SectionHeading
            title={parsed.title || 'عروضنا الحصرية'}
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
        </div>

        {sortedOffers.length === 0 ? (
          <div className="mx-4 sm:mx-0 text-center text-gray-500 py-10 bg-white rounded-3xl border border-dashed border-gray-200">
            لا توجد عروض حالياً. أضف عروضاً من لوحة التحكم.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
            {sortedOffers.map((offer: any) => {
              const offerData = parseOfferData(offer)
              const offerFontClass = getFontClass(offerData.fontFamily || parsed.fontFamily)
              const customTitleColor = offerData.titleColor || parsed.titleColor || ''
              const customButtonColor = offerData.buttonColor || ''
              const customBadgeColor = offerData.badgeColor || '#dc2626'
              const badgeLabel = offerData.badgeText || (offer.discount > 0 ? `تخفيض ${offer.discount}%` : null)
              const buttonLabel = offerData.buttonText || 'اطلب العرض الآن'

              return (
                <div 
                  key={offer.id} 
                  className={`bg-white sm:rounded-3xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${offerFontClass}`}
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
                    {badgeLabel && (
                      <div 
                        className="glow-badge text-white font-extrabold px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg flex items-center gap-1 backdrop-blur-sm"
                        style={{ backgroundColor: customBadgeColor }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>{badgeLabel}</span>
                      </div>
                    )}
                    {offerData.isFreeDelivery && (
                      <div className="text-white font-extrabold px-3 py-0.5 rounded-full text-xs shadow-md flex items-center gap-1 bg-emerald-600 backdrop-blur-sm animate-pulse">
                        <Truck className="w-3.5 h-3.5 text-white" />
                        <span>توصيل مجاني 🚚</span>
                      </div>
                    )}
                  </div>

                  {/* 4:3 Image (full width with 0 margin to screen corners on mobile) */}
                  {offerData.images.length > 0 && (
                    <OfferImageSlideshow images={offerData.images} alt={offer.name} />
                  )}

                  {/* Offer Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        className="text-xl sm:text-2xl font-black mb-1.5 leading-snug glow-title"
                        style={customTitleColor ? { color: customTitleColor } : { color: '#0f172a' }}
                      >
                        {offer.name}
                      </h3>

                      {offer.short_description && (
                        <p className="text-gray-500 text-sm mb-3 min-h-[36px] whitespace-pre-line text-start leading-relaxed">
                          {offer.short_description}
                        </p>
                      )}
                      
                      {/* Price with clean text glow in matching color */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span 
                          className="text-3xl sm:text-4xl font-black glow-price"
                          style={customButtonColor ? { color: customButtonColor } : { color: 'var(--primary-color, #2563eb)' }}
                        >
                          {offer.price}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-gray-500">DA</span>
                        {offer.old_price > 0 && (
                          <span className="text-sm text-gray-400 line-through mr-2">{offer.old_price} DA</span>
                        )}
                      </div>
                      
                      <ul className="space-y-2 mb-5 text-sm sm:text-base">
                        <li className="flex items-center text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2 shrink-0" />
                          <span className="font-medium">الكمية: {offer.quantity_included}</span>
                        </li>
                        {offerData.isFreeDelivery && (
                          <li className="flex items-center text-emerald-700 font-bold">
                            <Truck className="w-4 h-4 text-emerald-600 ml-2 shrink-0" />
                            <span>توصيل مجاني لجميع الولايات (58 ولاية)</span>
                          </li>
                        )}
                        {offer.gifts && (
                          <li className="flex items-center text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2 shrink-0" />
                            <span className="font-medium text-emerald-700">الهدايا: {offer.gifts}</span>
                          </li>
                        )}
                        {offer.full_description && (
                          <li className="flex items-start text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2 shrink-0 mt-0.5" />
                            <span className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">{offer.full_description}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <a 
                      href="#order-form"
                      onClick={(e) => {
                        e.preventDefault()
                        window.dispatchEvent(new CustomEvent('selectOffer', { detail: offer.id }))
                        const target = document.getElementById('order-form') || document.getElementById('order')
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                      style={customButtonColor ? { backgroundColor: customButtonColor } : {}}
                      className={`glow-button relative overflow-hidden block w-full py-3.5 sm:py-4 text-center font-black text-base sm:text-lg text-white rounded-xl sm:rounded-2xl shadow-md transition-all hover:brightness-95 hover:scale-[1.01] active:scale-[0.98] mt-2 after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_3s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent ${
                        !customButtonColor ? 'bg-primary' : ''
                      }`}
                    >
                      {buttonLabel}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
