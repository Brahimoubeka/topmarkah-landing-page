'use client'

import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Truck, Package, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { parseSectionData, SectionIcon, getFontClass } from '@/lib/section-config'

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/)
  return m ? m[1] : null
}

function ImageSlideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div className="relative select-none w-full">
      {/* 4:3 Aspect Ratio - 0 margin with screen corners on mobile */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-none sm:rounded-3xl shadow-sm sm:shadow-2xl">
        <img
          key={current}
          src={images[current]}
          alt={`Product ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          fetchPriority="high"
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
        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/65 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md z-10 shadow-sm">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 mt-3 px-3 sm:px-0 justify-center flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-13 h-13 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all border ${
                i === current ? 'ring-2 ring-primary scale-105 shadow-md border-transparent' : 'opacity-60 hover:opacity-100 border-gray-200 bg-white'
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

function YouTubeEmbed({ url }: { url: string }) {
  const id = extractYouTubeId(url)
  const [playing, setPlaying] = useState(false)

  if (!id) return null

  return (
    <div className="rounded-none sm:rounded-3xl overflow-hidden shadow-sm sm:shadow-xl bg-black w-full">
      {!playing ? (
        <div
          className="relative aspect-video bg-gray-900 cursor-pointer group"
          onClick={() => setPlaying(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
            onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg` }}
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
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title="Product video"
          />
        </div>
      )}
    </div>
  )
}

export function HeroSection({ section, product }: any) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily)

  const media: Array<{ id: string; media_url: string; media_type: string; display_order: number }> =
    product?.product_media || []

  const youtubeEntry = media.find(m => m.media_type === 'youtube')
  const images = media
    .filter(m => m.media_type === 'image')
    .sort((a, b) => a.display_order - b.display_order)
    .map(m => m.media_url)

  const hasMedia = !!youtubeEntry || images.length > 0

  return (
    <section className="relative overflow-hidden bg-white pt-1.5 pb-6 sm:pt-6 sm:pb-8">
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-multiply"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/10 opacity-50 blur-3xl"></div>
      
      {/* px-0 on mobile so images touch the corners of the screen with 0 margin */}
      <div className="relative mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 items-center">
          {/* ── Media side (Product Images & Video) ── */}
          <div className="order-1 lg:order-2 mb-4 lg:mb-0 lg:col-span-6 relative w-full">
            <div className="relative mx-auto w-full max-w-2xl">
              <div className="hidden sm:block absolute top-0 -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[3rem] blur-2xl opacity-70"></div>
              <div className="relative space-y-3">
                {hasMedia ? (
                  <>
                    {/* YouTube first */}
                    {youtubeEntry && (
                      <YouTubeEmbed url={youtubeEntry.media_url} />
                    )}
                    {/* Then images slideshow */}
                    {images.length > 0 && (
                      <ImageSlideshow images={images} />
                    )}
                  </>
                ) : (
                  <div className="rounded-none sm:rounded-3xl bg-gray-100 p-2 shadow-sm sm:shadow-xl border-y sm:border border-gray-100 overflow-hidden">
                    <div className="aspect-[4/3] rounded-none sm:rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                      <span className="z-10 flex flex-col items-center">
                        <Package className="w-16 h-16 mb-4 text-blue-300" />
                        صورة المنتج
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Text side (Title, Buttons & Trust Badges) ── */}
          <div className="order-2 lg:order-1 lg:col-span-6 text-center lg:text-right w-full px-4 sm:px-0 mt-3 sm:mt-0">
            <h1 
              className={`font-black tracking-tight leading-tight flex items-center gap-2.5 justify-center lg:justify-start ${parsed.fontSize} ${fontClass} glow-title`}
              style={parsed.titleColor ? { color: parsed.titleColor } : { color: '#0f172a' }}
            >
              {parsed.icon && parsed.icon !== 'none' && (
                <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <SectionIcon name={parsed.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
                </span>
              )}
              <span>{parsed.title || product?.name}</span>
            </h1>

            {parsed.subtitle && (
              <p className="mt-2.5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line text-start">
                {parsed.subtitle}
              </p>
            )}

            {parsed.body && (
              <p className="mt-2.5 text-sm sm:text-base text-gray-600 whitespace-pre-line text-start leading-relaxed">
                {parsed.body}
              </p>
            )}

            {/* Price display with clean text glow in matching color */}
            {product && product.price > 0 && (
              <div className="mt-4 flex items-baseline gap-2.5 justify-center lg:justify-start">
                <span className="text-3xl sm:text-5xl font-black text-primary glow-price">
                  {product.price}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-500">DA</span>
                {product.old_price > 0 && (
                  <span className="text-base sm:text-lg text-gray-400 line-through mr-2">{product.old_price} DA</span>
                )}
              </div>
            )}
            
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a 
                href="#order-form" 
                className="glow-button relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 text-base sm:text-lg font-bold rounded-full text-white bg-primary hover:brightness-95 transition-all hover:scale-105 after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_3s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent"
              >
                اطلب الآن
              </a>
              <a 
                href="#details" 
                className="inline-flex items-center justify-center px-8 py-3.5 text-base sm:text-lg font-bold rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                مزيد من التفاصيل
              </a>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-gray-600">
                <Truck className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" /> توصيل سريع
              </div>
              <div className="flex items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-gray-600">
                <ShieldCheck className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" /> جودة مضمونة
              </div>
              <div className="flex items-center justify-center lg:justify-start text-xs sm:text-sm font-medium text-gray-600">
                <CheckCircle2 className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" /> دفع عند الاستلام
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
