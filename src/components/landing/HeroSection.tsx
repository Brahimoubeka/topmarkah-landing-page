'use client'

import React, { useState } from 'react'
import { CheckCircle2, ShieldCheck, Truck, Package, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import {
  parseSectionData,
  SectionIcon,
  getFontClass,
  isYouTubeUrl,
  extractYouTubeId,
  getAspectRatioStyle,
  getAspectRatioClass,
} from '@/lib/section-config'

function YouTubeEmbed({ url }: { url: string }) {
  const id = extractYouTubeId(url)
  const [playing, setPlaying] = useState(false)

  if (!id) return null

  return (
    <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-black w-full shadow-sm">
      {!playing ? (
        <div
          className="relative aspect-video bg-gray-900 cursor-pointer group"
          onClick={() => setPlaying(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
            onError={e => {
              ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
            }}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            شاهد الفيديو
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title="Product video"
          />
        </div>
      )}
    </div>
  )
}

function DirectVideoPlayer({
  url,
  autoplay = false,
  loop = false,
  muted = false,
}: {
  url: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}) {
  return (
    <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-md flex items-center justify-center select-none">
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        autoPlay={autoplay}
        muted={muted || autoplay}
        loop={loop}
        className="w-full h-auto max-h-[85vh] object-contain block mx-auto"
      />
    </div>
  )
}

function ImageSlideshow({
  images,
  aspectRatio = 'auto',
  topOverlay,
  middleOverlay,
  bottomOverlay,
  imageFit = 'cover',
}: {
  images: string[]
  aspectRatio?: string
  topOverlay?: React.ReactNode
  middleOverlay?: React.ReactNode
  bottomOverlay?: React.ReactNode
  imageFit?: 'cover' | 'contain'
}) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  const isAuto = !aspectRatio || aspectRatio === 'auto'
  const aspectStyle = !isAuto ? getAspectRatioStyle(aspectRatio) : undefined

  return (
    <div className="relative select-none w-full">
      <div
        className={`group relative w-full bg-gray-900 overflow-hidden rounded-none sm:rounded-3xl shadow-xl sm:border border-gray-100/60 ${
          isAuto ? 'aspect-auto' : ''
        }`}
        style={aspectStyle ? { aspectRatio: aspectStyle } : undefined}
      >
        <img
          key={current}
          src={images[current]}
          alt={`Product ${current + 1}`}
          className={`w-full ${
            isAuto
              ? 'h-auto block'
              : imageFit === 'contain'
              ? 'h-full object-contain'
              : 'h-full object-cover'
          } transition-all duration-500 group-hover:scale-[1.01]`}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />

        {/* ── TOP GRADIENT SHADE ── */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/25 to-transparent pointer-events-none" />

        {/* ── SMOOTH FADING DARK FROM BOTTOM UP THROUGH THE TITLE & DESCRIPTION ── */}
        <div className="absolute inset-x-0 bottom-0 h-4/5 sm:h-3/4 bg-gradient-to-t from-gray-950 via-gray-950/75 via-45% to-transparent pointer-events-none transition-opacity duration-300">
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-40 rounded-full blur-3xl opacity-75 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundColor: 'var(--primary-color, #2563eb)' }}
          />
        </div>

        {/* ── UNIFIED VERTICAL OVERLAY: TOP (LOGO) + MIDDLE (TITLE & DESC) + BOTTOM (ORDER BUTTON) ── */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-6 pointer-events-none">
          <div className="w-full pointer-events-auto">
            {topOverlay}
          </div>

          <div className="my-auto w-full pointer-events-auto flex items-center justify-center py-2">
            {middleOverlay}
          </div>

          <div className="w-full pointer-events-auto flex justify-center items-center pb-2 sm:pb-3">
            {bottomOverlay}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-30"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-30"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <div className="absolute top-14 right-3 bg-black/65 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md z-30 shadow-sm">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 mt-3 px-3 sm:px-0 justify-center flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-13 h-13 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all border ${
                i === current
                  ? 'ring-2 ring-primary scale-105 shadow-md border-transparent'
                  : 'opacity-60 hover:opacity-100 border-gray-200 bg-white'
              }`}
            >
              <img
                src={src}
                alt={`Thumb ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function HeroSection({ section, product, isAlt = false, logoUrl }: any) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily)

  // Title styling
  const titleStyle: React.CSSProperties = {}
  if (parsed.titleColor) titleStyle.color = parsed.titleColor
  else titleStyle.color = '#ffffff'

  if (parsed.titleFontSize) {
    const num = typeof parsed.titleFontSize === 'number' ? parsed.titleFontSize : parseFloat(String(parsed.titleFontSize))
    if (!isNaN(num) && num > 0) {
      titleStyle.fontSize = `${num}px`
      titleStyle.lineHeight = `${Math.round(num * 1.2)}px`
    }
  }

  // Paragraph styling with full dynamic font size support
  const paragraphNum = typeof parsed.paragraphFontSize === 'number'
    ? parsed.paragraphFontSize
    : parseFloat(String(parsed.paragraphFontSize || 15))
  const pFontSize = !isNaN(paragraphNum) && paragraphNum > 0 ? `${paragraphNum}px` : '15px'
  const pLineHeight = !isNaN(paragraphNum) && paragraphNum > 0 ? `${Math.round(paragraphNum * 1.5)}px` : '22px'

  const pStyle: React.CSSProperties = {
    fontSize: pFontSize,
    lineHeight: pLineHeight,
  }
  if (parsed.textColor) {
    pStyle.color = parsed.textColor
  }

  // Media
  const media: Array<{ id: string; media_url: string; media_type: string; display_order: number }> =
    product?.product_media || []

  const youtubeEntry = media.find(m => m.media_type === 'youtube')
  const images = media
    .filter(m => m.media_type === 'image')
    .sort((a, b) => a.display_order - b.display_order)
    .map(m => m.media_url)

  // Custom section image or video (if added in section editor)
  const customVideoUrl = parsed.videoUrl
  const customHeroImage = parsed.imageUrl && parsed.imageUrl.trim().length > 0 ? parsed.imageUrl.trim() : null
  const allImages = customHeroImage
    ? [customHeroImage, ...images.filter(img => img !== customHeroImage)]
    : images

  const hasMedia = customVideoUrl || youtubeEntry || allImages.length > 0

  // Custom Badges & Buttons (only Order Now, See Details button removed)
  const ctaButtonText = parsed.ctaButtonText || 'اطلب الآن'

  const badge1 = parsed.badge1 !== undefined ? parsed.badge1 : 'توصيل سريع'
  const badge2 = parsed.badge2 !== undefined ? parsed.badge2 : 'جودة مضمونة'
  const badge3 = parsed.badge3 !== undefined ? parsed.badge3 : 'دفع عند الاستلام'

  const hasAnyBadge = (badge1 && badge1.trim()) || (badge2 && badge2.trim()) || (badge3 && badge3.trim())

  const heroTitle = parsed.hideTitle ? null : (parsed.title || product?.name)
  const heroDescription = parsed.body || parsed.subtitle

  // Top floating overlay: Logo & topmarkah phrase
  const renderTopOverlay = () => (
    <div className="relative flex items-center justify-between w-full px-1 sm:px-2 py-0.5 pointer-events-auto">
      {/* Logo */}
      <div className="flex items-center">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 sm:h-11 w-auto object-contain drop-shadow-md" />
        ) : (
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold text-white border border-white/25 shadow-sm">
            شعار
          </div>
        )}
      </div>

      {/* Top Center: topmarkah phrase */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <span className="text-white/95 font-medium text-xs sm:text-sm tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-sm">
          topmarkah
        </span>
      </div>
    </div>
  )

  // Middle overlay: Title, Price & Description smoothly over the image (no sharp box)
  const renderMiddleOverlay = () => (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4 py-2 text-center">
      {/* Product Title */}
      {heroTitle && (
        <h1
          className={`font-black tracking-tight leading-tight inline-flex items-center gap-2 justify-center drop-shadow-md mb-1.5 ${
            !titleStyle.fontSize ? 'text-2xl sm:text-4xl' : ''
          } ${fontClass} glow-title`}
          style={titleStyle}
        >
          {parsed.icon && parsed.icon !== 'none' && (
            <span
              className="inline-flex items-center justify-center p-1 rounded-lg bg-white/10 text-white shrink-0"
            >
              <SectionIcon name={parsed.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          )}
          <span>{heroTitle}</span>
        </h1>
      )}

      {/* Price display directly under the title */}
      {product && product.price > 0 && (
        <div className="flex items-baseline gap-2 justify-center mb-1.5 sm:mb-2">
          <span className="text-2xl sm:text-4xl font-black text-amber-400 glow-price">
            {product.price}
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-300">DA</span>
          {product.old_price > 0 && (
            <span className="text-xs sm:text-sm font-bold text-red-400 line-through decoration-red-400/80 mr-1.5">
              {product.old_price} DA
            </span>
          )}
        </div>
      )}

      {/* Description with dynamic font size */}
      {heroDescription && (
        <p
          className="text-white/95 font-medium drop-shadow text-center whitespace-pre-line leading-relaxed max-w-lg mx-auto line-clamp-3"
          style={pStyle}
        >
          {heroDescription}
        </p>
      )}
    </div>
  )

  // Bottom overlay: Order Now button only
  const renderBottomButton = () => (
    ctaButtonText ? (
      <a
        href="#order-form"
        className="glow-button relative overflow-hidden inline-flex items-center justify-center px-8 sm:px-11 py-3 sm:py-3.5 text-base sm:text-lg font-black rounded-full text-white bg-primary hover:brightness-110 transition-all hover:scale-105 shadow-2xl active:scale-95 after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_3s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent"
      >
        {ctaButtonText}
      </a>
    ) : null
  )

  return (
    <section
      id="hero-section"
      className={`relative overflow-hidden pt-0 pb-6 sm:pb-10 transition-colors ${
        !parsed.backgroundColor ? (isAlt ? 'bg-slate-50/75' : 'bg-white') : ''
      }`}
      style={parsed.backgroundColor ? { backgroundColor: parsed.backgroundColor } : undefined}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/10 opacity-50 blur-3xl pointer-events-none"></div>

      <div className="relative mx-auto max-w-4xl px-0 sm:px-6 lg:px-8 text-center">
        {/* ── PRODUCT MEDIA STARTING RIGHT UNDER THE RED ROLLING BUNDLE ── */}
        <div className="relative mx-auto w-full max-w-2xl px-0">
          <div className="hidden sm:block absolute top-0 -inset-4 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-[3rem] blur-2xl opacity-75"></div>
          <div className="relative space-y-4">
            {/* 1. Custom Video or direct MP4 */}
            {customVideoUrl && (
              isYouTubeUrl(customVideoUrl) ? (
                <YouTubeEmbed url={customVideoUrl} />
              ) : (
                <DirectVideoPlayer
                  url={customVideoUrl}
                  autoplay={parsed.videoAutoplay}
                  loop={parsed.videoLoop}
                  muted={parsed.videoMuted}
                />
              )
            )}

            {/* 2. YouTube Entry from product */}
            {!customVideoUrl && youtubeEntry && (
              <YouTubeEmbed url={youtubeEntry.media_url} />
            )}

            {/* 3. Image slideshow or single image with floating header & bottom overlay */}
            {allImages.length > 1 ? (
              <ImageSlideshow
                images={allImages}
                aspectRatio={parsed.imageAspectRatio || 'auto'}
                imageFit={parsed.imageFit}
                topOverlay={renderTopOverlay()}
                middleOverlay={renderMiddleOverlay()}
                bottomOverlay={renderBottomButton()}
              />
            ) : allImages.length === 1 ? (
              (() => {
                const isAuto = !parsed.imageAspectRatio || parsed.imageAspectRatio === 'auto'
                const aspectStyle = !isAuto ? getAspectRatioStyle(parsed.imageAspectRatio) : undefined

                return (
                  <div
                    className={`group relative w-full bg-gray-900 overflow-hidden rounded-none sm:rounded-3xl shadow-xl sm:border border-gray-100/60 ${
                      isAuto ? 'aspect-auto' : ''
                    }`}
                    style={aspectStyle ? { aspectRatio: aspectStyle } : undefined}
                  >
                    <img
                      src={allImages[0]}
                      alt="Hero Image"
                      className={`w-full ${
                        isAuto
                          ? 'h-auto block'
                          : parsed.imageFit === 'contain'
                          ? 'h-full object-contain'
                          : 'h-full object-cover'
                      } transition-all duration-500 group-hover:scale-[1.01]`}
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                    />

                    {/* ── TOP GRADIENT SHADE ── */}
                    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/25 to-transparent pointer-events-none" />

                    {/* ── SMOOTH FADING DARK FROM BOTTOM UP THROUGH THE TITLE & DESCRIPTION ── */}
                    <div className="absolute inset-x-0 bottom-0 h-4/5 sm:h-3/4 bg-gradient-to-t from-gray-950 via-gray-950/75 via-45% to-transparent pointer-events-none transition-opacity duration-300">
                      <div
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-40 rounded-full blur-3xl opacity-75 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: 'var(--primary-color, #2563eb)' }}
                      />
                    </div>

                    {/* ── UNIFIED VERTICAL OVERLAY: TOP (LOGO) + MIDDLE (TITLE & DESC) + BOTTOM (ORDER BUTTON) ── */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-6 pointer-events-none">
                      <div className="w-full pointer-events-auto">
                        {renderTopOverlay()}
                      </div>

                      <div className="my-auto w-full pointer-events-auto flex items-center justify-center py-2">
                        {renderMiddleOverlay()}
                      </div>

                      <div className="w-full pointer-events-auto flex justify-center items-center pb-2 sm:pb-3">
                        {renderBottomButton()}
                      </div>
                    </div>
                  </div>
                )
              })()
            ) : !customVideoUrl && !youtubeEntry ? (
              <div className="rounded-none sm:rounded-3xl bg-gray-100 p-2 overflow-hidden shadow-sm">
                <div className="aspect-[4/3] rounded-none sm:rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <span className="z-10 flex flex-col items-center">
                    <Package className="w-16 h-16 mb-4 text-blue-300" />
                    صورة المنتج
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ── TRUST BADGES UNDER THE IMAGE ── */}
        {hasAnyBadge && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 max-w-xl mx-auto px-4 sm:px-0">
            {badge1 && badge1.trim() && (
              <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-sm">
                <Truck className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
                <span>{badge1}</span>
              </div>
            )}
            {badge2 && badge2.trim() && (
              <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-sm">
                <ShieldCheck className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
                <span>{badge2}</span>
              </div>
            )}
            {badge3 && badge3.trim() && (
              <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-sm">
                <CheckCircle2 className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
                <span>{badge3}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
