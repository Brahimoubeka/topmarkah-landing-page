'use client'

import React, { useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Truck } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData, getFontClass } from '@/lib/section-config'
import { parseOfferData, OfferFeatureIcon } from '@/lib/offer-helper'

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
      {/* 1:1 Square Contained image with top rounded corners */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-t-2xl sm:rounded-t-3xl shadow-sm">
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
              <img src={src} alt={`Thumb ${i + 1}`} width={56} height={56} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function OffersSection({ section, offers, isAlt = false }: any) {
  const parsed = parseSectionData(section)

  // Strictly sort offers according to admin display_order
  const sortedOffers = [...(offers || [])].sort((a: any, b: any) => {
    const ordA = Number(a.display_order ?? 0)
    const ordB = Number(b.display_order ?? 0)
    return ordA - ordB
  })

  // Columns per row logic
  let gridColumnsClass = 'max-w-5xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (parsed.offerColumns === '1') {
    gridColumnsClass = 'max-w-sm sm:max-w-md mx-auto grid-cols-1'
  } else if (parsed.offerColumns === '2') {
    gridColumnsClass = 'max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2'
  } else if (parsed.offerColumns === '3') {
    gridColumnsClass = 'max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  } else if (sortedOffers.length === 1) {
    gridColumnsClass = 'max-w-sm sm:max-w-md mx-auto grid-cols-1'
  } else if (sortedOffers.length === 2) {
    gridColumnsClass = 'max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2'
  }

  const sectionStyle: React.CSSProperties = {}
  if (parsed.backgroundColor) sectionStyle.backgroundColor = parsed.backgroundColor

  return (
    <section
      id="offers"
      className={`py-6 sm:py-10 transition-colors ${
        !parsed.backgroundColor ? (isAlt ? 'bg-slate-50/80' : 'bg-white') : ''
      }`}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div>
          <SectionHeading
            title={parsed.title || 'عروضنا الحصرية'}
            subtitle={parsed.subtitle}
            icon={parsed.icon}
            titleColor={parsed.titleColor}
            subtitleColor={parsed.subtitleColor}
            fontSize={parsed.fontSize}
            titleFontSize={parsed.titleFontSize}
            subtitleFontSize={parsed.subtitleFontSize}
            fontFamily={parsed.fontFamily}
            hideTitle={parsed.hideTitle}
            className="mb-4 sm:mb-8"
          />
          {parsed.body && (
            <p
              className="text-center text-sm sm:text-base text-gray-600 max-w-2xl mx-auto -mt-2 mb-6 whitespace-pre-line"
              style={parsed.textColor ? { color: parsed.textColor } : undefined}
            >
              {parsed.body}
            </p>
          )}
        </div>

        {sortedOffers.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-gray-200">
            لا توجد عروض حالياً. أضف عروضاً من لوحة التحكم.
          </div>
        ) : (
          <div className={`grid gap-5 sm:gap-6 ${gridColumnsClass}`}>
            {sortedOffers.map((offer: any) => {
              const offerData = parseOfferData(offer)
              const offerFontClass = getFontClass(offerData.fontFamily || parsed.fontFamily)
              const customTitleColor = offerData.titleColor || parsed.titleColor || ''
              const customButtonColor = offerData.buttonColor || ''
              const customBadgeColor = offerData.badgeColor || '#dc2626'
              const badgeLabel = offerData.badgeText || (offer.discount > 0 ? `تخفيض ${offer.discount}%` : null)
              const buttonLabel = offerData.buttonText || 'اطلب العرض الآن'

              const cardBorderColor = offerData.borderColor || parsed.offerBorderColor || ''
              const cardBgColor = parsed.offerCardBgColor || (isAlt ? '#ffffff' : '#f8fafc')
              const cardTextColor = parsed.offerCardTextColor || ''

              // Dynamic font sizes
              const titleSize = parsed.offerTitleSize ? `${parsed.offerTitleSize}px` : undefined
              const priceSize = parsed.offerPriceSize ? `${parsed.offerPriceSize}px` : undefined
              const bodySize = parsed.offerBodySize ? `${parsed.offerBodySize}px` : undefined
              const oldPriceColor = parsed.offerOldPriceColor || '#ef4444'

              // Visibility of sections on this offer card
              const showImage = parsed.showOfferImage !== false && offerData.images.length > 0
              const showDescription = parsed.showOfferDescription !== false && !!offer.short_description
              const showQuantity = parsed.showOfferQuantity !== false
              const showDelivery = parsed.showOfferDelivery !== false && offerData.isFreeDelivery
              const showGifts = parsed.showOfferGifts !== false && !!offer.gifts
              const showFeatures = parsed.showOfferFeatures !== false && !!offer.full_description
              const showButton = parsed.showOfferButton !== false

              return (
                <div 
                  key={offer.id} 
                  className={`rounded-2xl sm:rounded-3xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${offerFontClass} shadow-sm border ${
                    cardBorderColor ? '' : 'border-gray-200/60'
                  }`}
                  style={{
                    backgroundColor: cardBgColor,
                    borderColor: cardBorderColor || undefined,
                    borderWidth: cardBorderColor ? '1.5px' : undefined,
                    borderStyle: cardBorderColor ? 'solid' : undefined,
                  }}
                >
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
                    {badgeLabel && (
                      <div 
                        className="glow-badge text-white font-extrabold px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs shadow-md flex items-center gap-1 backdrop-blur-sm"
                        style={{ backgroundColor: customBadgeColor }}
                      >
                        <Sparkles className="w-3 h-3 text-white" />
                        <span>{badgeLabel}</span>
                      </div>
                    )}
                    {offerData.isFreeDelivery && (
                      <div className="text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs shadow-md flex items-center gap-1 bg-emerald-600 backdrop-blur-sm animate-pulse">
                        <Truck className="w-3 h-3 text-white" />
                        <span>توصيل مجاني 🚚</span>
                      </div>
                    )}
                  </div>

                  {/* 1:1 Contained Image */}
                  {showImage && (
                    <OfferImageSlideshow images={offerData.images} alt={offer.name} />
                  )}

                  {/* Offer Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Offer Title */}
                      <h3 
                        className="font-black mb-1 leading-snug glow-title"
                        style={{
                          color: customTitleColor || '#0f172a',
                          fontSize: titleSize || '1.25rem',
                        }}
                      >
                        {offer.name}
                      </h3>

                      {/* Offer Short Description */}
                      {showDescription && (
                        <p
                          className="text-gray-500 mb-2.5 min-h-[28px] whitespace-pre-line text-start leading-relaxed"
                          style={{
                            color: cardTextColor || undefined,
                            fontSize: bodySize || '0.875rem',
                          }}
                        >
                          {offer.short_description}
                        </p>
                      )}
                      
                      {/* Price - Promotion old price is bold red */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span 
                          className="font-black glow-price"
                          style={{
                            color: customButtonColor || parsed.offerPriceColor || 'var(--primary-color, #2563eb)',
                            fontSize: priceSize || '1.875rem',
                          }}
                        >
                          {offer.price}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-gray-500">DA</span>
                        {offer.old_price > 0 && (
                          <span
                            className="font-bold line-through decoration-red-500/80 mr-2"
                            style={{
                              color: oldPriceColor,
                              fontSize: bodySize ? `calc(${bodySize} + 1px)` : '0.95rem',
                            }}
                          >
                            {offer.old_price} DA
                          </span>
                        )}
                      </div>
                      
                      {/* Feature Bullet Points / Includes List */}
                      <ul
                        className="space-y-2 mb-4"
                        style={{
                          color: cardTextColor || undefined,
                          fontSize: offerData.featuresSize ? `${offerData.featuresSize}px` : bodySize || '0.875rem',
                          lineHeight: offerData.featuresSize ? `${Math.round(offerData.featuresSize * 1.45)}px` : undefined,
                        }}
                      >
                        {showQuantity && (
                          <li className="flex items-center text-gray-700" style={cardTextColor ? { color: cardTextColor } : {}}>
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-500 ml-2 shrink-0"
                              style={offerData.featuresIconColor ? { color: offerData.featuresIconColor } : {}}
                            />
                            <span className="font-medium">الكمية: {offer.quantity_included}</span>
                          </li>
                        )}
                        {showDelivery && (
                          <li className="flex items-center text-emerald-700 font-bold">
                            <Truck
                              className="w-4 h-4 text-emerald-600 ml-2 shrink-0"
                              style={offerData.featuresIconColor ? { color: offerData.featuresIconColor } : {}}
                            />
                            <span>توصيل مجاني لجميع الولايات</span>
                          </li>
                        )}
                        {showGifts && (
                          <li className="flex items-center text-gray-700" style={cardTextColor ? { color: cardTextColor } : {}}>
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-500 ml-2 shrink-0"
                              style={offerData.featuresIconColor ? { color: offerData.featuresIconColor } : {}}
                            />
                            <span className="font-medium text-emerald-700">الهدايا: {offer.gifts}</span>
                          </li>
                        )}

                        {/* What the offer includes (Features / Items list with check icons) */}
                        {showFeatures && offerData.featuresList && offerData.featuresList.length > 0 && (
                          offerData.featuresList.map((item, idx) => (
                            <li
                              key={item.id || idx}
                              className="flex items-start text-gray-700 leading-snug"
                              style={cardTextColor ? { color: cardTextColor } : {}}
                            >
                              <span className="ml-2 shrink-0 mt-0.5">
                                <OfferFeatureIcon
                                  icon={item.icon || 'check-circle'}
                                  className="w-4 h-4 text-emerald-500"
                                  style={offerData.featuresIconColor ? { color: offerData.featuresIconColor } : {}}
                                />
                              </span>
                              <span className="font-medium">{item.text}</span>
                            </li>
                          ))
                        )}

                        {/* Additional Notes & Description (الملاحظات والشرح الإضافي) */}
                        {showFeatures && offer.full_description && (
                          <li
                            className="flex items-start text-gray-600 pt-2 border-t border-gray-100/90 leading-relaxed text-xs"
                            style={cardTextColor ? { color: cardTextColor } : {}}
                          >
                            <span className="whitespace-pre-line text-start">{offer.full_description}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {/* Order Button */}
                    {showButton && (
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
                        className={`glow-button relative overflow-hidden block w-full py-3 sm:py-3.5 text-center font-black text-sm sm:text-base text-white rounded-xl sm:rounded-2xl shadow-sm transition-all hover:brightness-95 hover:scale-[1.01] active:scale-[0.98] mt-1 after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_3s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent ${
                          !customButtonColor ? 'bg-primary' : ''
                        }`}
                      >
                        {buttonLabel}
                      </a>
                    )}
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
