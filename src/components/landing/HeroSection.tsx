'use client'

import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Truck, Package, ChevronLeft, ChevronRight, Play } from 'lucide-react'

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
    <div className="relative select-none">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-2xl border border-gray-200">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 justify-center flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? 'border-blue-500 scale-105 shadow-md' : 'border-gray-200 opacity-60 hover:opacity-90'
              }`}
            >
              <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}

      {/* Counter badge */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
          {current + 1}/{images.length}
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
    <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
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
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
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
  const media: Array<{ id: string; media_url: string; media_type: string; display_order: number }> =
    product?.product_media || []

  const youtubeEntry = media.find(m => m.media_type === 'youtube')
  const images = media
    .filter(m => m.media_type === 'image')
    .sort((a, b) => a.display_order - b.display_order)
    .map(m => m.media_url)

  const hasMedia = !!youtubeEntry || images.length > 0

  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-16 sm:pb-24 sm:pt-24 xl:pb-32">
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/10 opacity-50 blur-3xl"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          {/* ── Text side ── */}
          <div className="lg:col-span-6 text-center lg:text-right">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl leading-tight">
              {section?.title || product?.name}
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line text-start">
              {section?.subtitle || product?.short_description}
            </p>
            {section?.content && (
              <p className="mt-4 text-gray-600 whitespace-pre-line text-start">{section.content}</p>
            )}
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#order-form" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-primary hover:brightness-90 shadow-lg shadow-primary/30 transition-all hover:scale-105"
              >
                اطلب الآن
              </a>
              <a 
                href="#details" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                مزيد من التفاصيل
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-y-4 gap-x-8 sm:grid-cols-3 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center text-sm font-medium text-gray-600">
                <Truck className="ml-2 h-5 w-5 text-secondary" /> توصيل سريع
              </div>
              <div className="flex items-center text-sm font-medium text-gray-600">
                <ShieldCheck className="ml-2 h-5 w-5 text-secondary" /> جودة مضمونة
              </div>
              <div className="flex items-center text-sm font-medium text-gray-600">
                <CheckCircle2 className="ml-2 h-5 w-5 text-secondary" /> دفع عند الاستلام
              </div>
            </div>
          </div>
          
          {/* ── Media side ── */}
          <div className="mt-16 lg:col-span-6 lg:mt-0 relative">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute top-0 -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[3rem] blur-2xl opacity-70"></div>
              <div className="relative space-y-4">
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
                  <div className="rounded-3xl bg-gray-100 p-2 shadow-2xl border border-gray-200 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="aspect-[4/3] rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative">
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
        </div>
      </div>
    </section>
  )
}
