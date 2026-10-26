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

function ImageSlideshow({ images, aspectRatio = '4:3' }: { images: string[]; aspectRatio?: string }) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  const aspectStyle = getAspectRatioStyle(aspectRatio)
  const isAuto = aspectRatio === 'auto'

  return (
    <div className="relative select-none w-full">
      <div
        className={`relative w-full bg-gray-100 overflow-hidden rounded-none sm:rounded-3xl ${
          isAuto ? 'aspect-auto' : ''
        }`}
        style={!isAuto && aspectStyle ? { aspectRatio: aspectStyle } : !isAuto ? { aspectRatio: '4 / 3' } : undefined}
      >
        <img
          key={current}
          src={images[current]}
          alt={`Product ${current + 1}`}
          className={`w-full ${isAuto ? 'h-auto max-h-[85vh] object-contain' : 'h-full object-cover'} transition-opacity duration-300`}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white backdrop-blur-md rounded-full p-2 transition-all shadow-md z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/65 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md z-10 shadow-sm">
            {current + 1} / {images.length}
          </div>
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

export function HeroSection({ section, product, isAlt = false }: any) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily)

  // Title styling
  const titleStyle: React.CSSProperties = {}
  if (parsed.titleColor) titleStyle.color = parsed.titleColor
  else titleStyle.color = '#0f172a'

  if (parsed.titleFontSize) {
    const num = typeof parsed.titleFontSize === 'number' ? parsed.titleFontSize : parseFloat(String(parsed.titleFontSize))
    if (!isNaN(num) && num > 0) {
      titleStyle.fontSize = `${num}px`
      titleStyle.lineHeight = `${Math.round(num * 1.2)}px`
    }
  }

  // Paragraph styling
  const pStyle: React.CSSProperties = {}
  if (parsed.textColor) pStyle.color = parsed.textColor
  if (parsed.paragraphFontSize) {
    const pNum = typeof parsed.paragraphFontSize === 'number'
      ? parsed.paragraphFontSize
      : parseFloat(String(parsed.paragraphFontSize))
    if (!isNaN(pNum) && pNum > 0) {
      pStyle.fontSize = `${pNum}px`
      pStyle.lineHeight = `${Math.round(pNum * 1.55)}px`
    }
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

  // Custom Badges & Buttons
  const ctaButtonText = parsed.ctaButtonText || 'اطلب الآن'
  const ctaSecondaryText = parsed.ctaSecondaryText !== undefined ? parsed.ctaSecondaryText : 'مزيد من التفاصيل'

  const badge1 = parsed.badge1 !== undefined ? parsed.badge1 : 'توصيل سريع'
  const badge2 = parsed.badge2 !== undefined ? parsed.badge2 : 'جودة مضمونة'
  const badge3 = parsed.badge3 !== undefined ? parsed.badge3 : 'دفع عند الاستلام'

  const hasAnyBadge = (badge1 && badge1.trim()) || (badge2 && badge2.trim()) || (badge3 && badge3.trim())

  const heroTitle = parsed.hideTitle ? null : (parsed.title || product?.name)

  return (
    <section
      className={`relative overflow-hidden pt-1.5 pb-6 sm:pt-6 sm:pb-8 transition-colors ${
        !parsed.backgroundColor ? (isAlt ? 'bg-slate-50/75' : 'bg-white') : ''
      }`}
      style={parsed.backgroundColor ? { backgroundColor: parsed.backgroundColor } : undefined}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/10 opacity-50 blur-3xl pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 items-center">
          {/* ── Media side (Product Images & Video in original dimension) ── */}
          <div className="order-1 lg:order-2 mb-4 lg:mb-0 lg:col-span-6 relative w-full">
            <div className="relative mx-auto w-full max-w-2xl">
              <div className="hidden sm:block absolute top-0 -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[3rem] blur-2xl opacity-70"></div>
              <div className="relative space-y-4">
                {/* 1. Custom Video or direct MP4 in natural original dimensions */}
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

                {/* 3. Image slideshow or single image (including custom hero image) */}
                {allImages.length > 1 ? (
                  <ImageSlideshow images={allImages} aspectRatio={parsed.imageAspectRatio || '4:3'} />
                ) : allImages.length === 1 ? (
                  <div
                    className="w-full bg-gray-100 overflow-hidden rounded-none sm:rounded-3xl"
                    style={
                      parsed.imageAspectRatio && parsed.imageAspectRatio !== 'auto'
                        ? { aspectRatio: getAspectRatioStyle(parsed.imageAspectRatio) }
                        : { aspectRatio: '4 / 3' }
                    }
                  >
                    <img
                      src={allImages[0]}
                      alt="Hero Image"
                      className={`w-full ${
                        parsed.imageAspectRatio === 'auto'
                          ? 'h-auto max-h-[85vh] object-contain'
                          : parsed.imageFit === 'contain'
                          ? 'h-full object-contain'
                          : 'h-full object-cover'
                      }`}
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                ) : !customVideoUrl && !youtubeEntry ? (
                  <div className="rounded-none sm:rounded-3xl bg-gray-100 p-2 overflow-hidden">
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
          </div>

          {/* ── Text side (Title, Buttons & Trust Badges) ── */}
          <div className="order-2 lg:order-1 lg:col-span-6 text-center lg:text-right w-full px-4 sm:px-0 mt-3 sm:mt-0">
            {heroTitle && (
              <h1
                className={`font-black tracking-tight leading-tight flex items-center gap-2.5 justify-center lg:justify-start ${
                  !titleStyle.fontSize ? parsed.fontSize : ''
                } ${fontClass} glow-title`}
                style={titleStyle}
              >
                {parsed.icon && parsed.icon !== 'none' && (
                  <span
                    className="inline-flex items-center justify-center p-1.5 rounded-xl bg-primary/10 text-primary shrink-0"
                    style={parsed.titleColor ? { color: parsed.titleColor, backgroundColor: `${parsed.titleColor}15` } : {}}
                  >
                    <SectionIcon name={parsed.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
                  </span>
                )}
                <span>{heroTitle}</span>
              </h1>
            )}

            {parsed.subtitle && (
              <p
                className="mt-2.5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line text-start"
                style={{
                  ...pStyle,
                  fontSize: parsed.subtitleFontSize ? `${parsed.subtitleFontSize}px` : undefined,
                  lineHeight: parsed.subtitleFontSize ? `${Math.round(Number(parsed.subtitleFontSize) * 1.5)}px` : undefined,
                  color: parsed.subtitleColor || undefined,
                }}
              >
                {parsed.subtitle}
              </p>
            )}

            {parsed.body && (
              <p
                className="mt-2.5 text-sm sm:text-base text-gray-600 whitespace-pre-line text-start leading-relaxed"
                style={pStyle}
              >
                {parsed.body}
              </p>
            )}

            {/* Price display */}
            {product && product.price > 0 && (
              <div className="mt-4 flex items-baseline gap-2.5 justify-center lg:justify-start">
                <span className="text-3xl sm:text-5xl font-black text-primary glow-price">
                  {product.price}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-500">DA</span>
                {product.old_price > 0 && (
                  <span className="text-base sm:text-lg font-bold text-red-500 line-through decoration-red-500/80 mr-2">
                    {product.old_price} DA
                  </span>
                )}
              </div>
            )}

            {/* Action buttons with customizable text */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {ctaButtonText && (
                <a
                  href="#order-form"
                  className="glow-button relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 text-base sm:text-lg font-bold rounded-full text-white bg-primary hover:brightness-95 transition-all hover:scale-105 after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_3s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent"
                >
                  {ctaButtonText}
                </a>
              )}
              {ctaSecondaryText && (
                <a
                  href="#details"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base sm:text-lg font-bold rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  {ctaSecondaryText}
                </a>
              )}
            </div>

            {/* Trust Badges - Fully customizable and optional */}
            {hasAnyBadge && (
              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto lg:mx-0">
                {badge1 && badge1.trim() && (
                  <div className="flex items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-gray-600">
                    <Truck className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
                    <span>{badge1}</span>
                  </div>
                )}
                {badge2 && badge2.trim() && (
                  <div className="flex items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-gray-600">
                    <ShieldCheck className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
                    <span>{badge2}</span>
                  </div>
                )}
                {badge3 && badge3.trim() && (
                  <div className="flex items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-gray-600">
                    <CheckCircle2 className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
                    <span>{badge3}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
