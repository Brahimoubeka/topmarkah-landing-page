'use client'

import React, { useState } from 'react'
import { SectionHeading } from './SectionHeading'
import {
  parseSectionData,
  getFontClass,
  getAspectRatioStyle,
  getAspectRatioClass,
  isYouTubeUrl,
  extractYouTubeId,
} from '@/lib/section-config'
import { Play } from 'lucide-react'

type Section = {
  id: string
  section_id: string
  title: string | null
  subtitle: string | null
  content: string | null
  image_url?: string | null
  is_active: boolean
}

function YouTubePlayer({ url }: { url: string }) {
  const id = extractYouTubeId(url)
  const [playing, setPlaying] = useState(false)

  if (!id) return null

  if (!playing) {
    return (
      <div
        onClick={() => setPlaying(true)}
        className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shadow-sm"
      >
        <img
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt="Video preview"
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
          شاهد الفيديو
        </div>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-md">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title="YouTube video"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function VideoPlayer({
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
  if (isYouTubeUrl(url)) {
    return <YouTubePlayer url={url} />
  }

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-sm flex items-center justify-center select-none">
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

export function CustomSection({ section, isAlt = false }: { section: Section; isAlt?: boolean }) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily || 'cairo')
  const isImageBelow = parsed.imagePosition === 'below'
  const isVideoBelow = parsed.videoPosition === 'below'

  const aspectStyle = getAspectRatioStyle(parsed.imageAspectRatio)
  const aspectClass = getAspectRatioClass(parsed.imageAspectRatio)
  const isCover = parsed.imageFit !== 'contain'

  const paragraphNum = typeof parsed.paragraphFontSize === 'number'
    ? parsed.paragraphFontSize
    : parseFloat(String(parsed.paragraphFontSize || 17))
  const pFontSize = !isNaN(paragraphNum) && paragraphNum > 0 ? `${paragraphNum}px` : '17px'
  const pLineHeight = !isNaN(paragraphNum) && paragraphNum > 0 ? `${Math.round(paragraphNum * 1.6)}px` : '28px'

  const sectionStyle: React.CSSProperties = {}
  if (parsed.backgroundColor) {
    sectionStyle.backgroundColor = parsed.backgroundColor
  }

  const pStyle: React.CSSProperties = {
    fontSize: pFontSize,
    lineHeight: pLineHeight,
  }
  if (parsed.textColor) {
    pStyle.color = parsed.textColor
  }

  const renderImage = () => {
    if (!parsed.imageUrl) return null
    return (
      <div
        className={`w-full overflow-hidden select-none bg-gray-100 ${
          parsed.imageAspectRatio === 'auto' ? 'rounded-2xl sm:rounded-3xl' : aspectClass
        }`}
        style={aspectStyle && aspectStyle !== 'auto' ? { aspectRatio: aspectStyle } : undefined}
      >
        <img
          src={parsed.imageUrl}
          alt={parsed.title || 'Section Image'}
          className={`w-full ${
            parsed.imageAspectRatio === 'auto'
              ? 'h-auto max-h-[85vh] object-contain mx-auto'
              : isCover
              ? 'h-full object-cover'
              : 'h-full object-contain'
          }`}
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  const renderVideo = () => {
    if (!parsed.videoUrl) return null
    return (
      <VideoPlayer
        url={parsed.videoUrl}
        autoplay={parsed.videoAutoplay}
        loop={parsed.videoLoop}
        muted={parsed.videoMuted}
      />
    )
  }

  const hasMedia = !!parsed.imageUrl || !!parsed.videoUrl
  const hasBody = !!parsed.body && parsed.body.trim().length > 0

  return (
    <section
      id={section.section_id}
      className={`py-8 sm:py-14 relative overflow-hidden transition-colors ${
        !parsed.backgroundColor ? (isAlt ? 'bg-slate-50/80' : 'bg-white') : ''
      }`}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-5xl px-0 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <SectionHeading
            title={parsed.title}
            subtitle={parsed.subtitle}
            icon={parsed.icon}
            titleColor={parsed.titleColor}
            subtitleColor={parsed.subtitleColor}
            fontSize={parsed.fontSize}
            titleFontSize={parsed.titleFontSize}
            subtitleFontSize={parsed.subtitleFontSize}
            fontFamily={parsed.fontFamily}
            hideTitle={parsed.hideTitle}
          />
        </div>

        {(hasBody || hasMedia) && (
          <div className="max-w-3xl mx-auto space-y-5 px-3 sm:px-0">
            {/* Top Media (if position is above) */}
            {parsed.imageUrl && !isImageBelow && renderImage()}
            {parsed.videoUrl && !isVideoBelow && renderVideo()}

            {/* Body Text */}
            {hasBody && (
              <div
                className={`${
                  parsed.backgroundColor
                    ? 'bg-black/5'
                    : isAlt
                    ? 'bg-white'
                    : 'bg-slate-50/70'
                } p-5 sm:p-8 rounded-2xl sm:rounded-3xl transition-colors`}
              >
                <div
                  className={`text-gray-700 whitespace-pre-line text-start leading-relaxed ${fontClass}`}
                  style={pStyle}
                >
                  {parsed.body}
                </div>
              </div>
            )}

            {/* Bottom Media (if position is below) */}
            {parsed.imageUrl && isImageBelow && renderImage()}
            {parsed.videoUrl && isVideoBelow && renderVideo()}
          </div>
        )}
      </div>
    </section>
  )
}
