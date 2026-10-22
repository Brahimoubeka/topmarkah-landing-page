import React from 'react'
import { SectionIcon, getFontClass } from '@/lib/section-config'

export function SectionHeading({
  title,
  subtitle,
  icon,
  titleColor,
  subtitleColor,
  fontSize = 'text-2xl sm:text-4xl',
  titleFontSize,
  subtitleFontSize,
  fontFamily = 'cairo',
  align = 'center',
  className = '',
  hideTitle = false,
}: {
  title?: string | null
  subtitle?: string | null
  icon?: string | null
  titleColor?: string | null
  subtitleColor?: string | null
  fontSize?: string | null
  titleFontSize?: string | number | null
  subtitleFontSize?: string | number | null
  fontFamily?: string | null
  align?: 'center' | 'start'
  className?: string
  hideTitle?: boolean
}) {
  const hasTitle = !hideTitle && title && title.trim().length > 0
  const hasSubtitle = subtitle && subtitle.trim().length > 0

  if (!hasTitle && !hasSubtitle) return null

  const fontClass = getFontClass(fontFamily || 'cairo')
  const isCenter = align === 'center'

  // Determine title font size style
  const sizeStyle: React.CSSProperties = {}
  let sizeClass = ''

  if (titleFontSize) {
    const num = typeof titleFontSize === 'number' ? titleFontSize : parseFloat(String(titleFontSize))
    if (!isNaN(num) && num > 0) {
      sizeStyle.fontSize = `${num}px`
      sizeStyle.lineHeight = `${Math.round(num * 1.25)}px`
    }
  }

  if (!sizeStyle.fontSize) {
    sizeClass = fontSize || 'text-2xl sm:text-4xl'
  }

  // Determine subtitle font size style
  const subStyle: React.CSSProperties = {}
  if (subtitleFontSize) {
    const subNum = typeof subtitleFontSize === 'number' ? subtitleFontSize : parseFloat(String(subtitleFontSize))
    if (!isNaN(subNum) && subNum > 0) {
      subStyle.fontSize = `${subNum}px`
      subStyle.lineHeight = `${Math.round(subNum * 1.5)}px`
    }
  }
  if (subtitleColor) {
    subStyle.color = subtitleColor
  }

  return (
    <div className={`mb-6 sm:mb-8 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-start'} ${className}`}>
      {hasTitle && (
        <h2
          className={`font-black tracking-tight flex items-center gap-2.5 glow-title ${
            isCenter ? 'justify-center' : 'justify-start'
          } ${sizeClass} ${fontClass}`}
          style={{
            color: titleColor || 'var(--text-color, #0f172a)',
            ...sizeStyle,
          }}
        >
          {icon && icon !== 'none' && (
            <span
              className="inline-flex items-center justify-center p-1.5 rounded-xl bg-primary/10 text-primary shrink-0"
              style={titleColor ? { color: titleColor, backgroundColor: `${titleColor}15` } : {}}
            >
              <SectionIcon name={icon} className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          )}
          <span>{title}</span>
        </h2>
      )}

      {hasSubtitle && (
        <p
          className="mt-2 text-sm sm:text-base text-gray-500 whitespace-pre-line leading-relaxed"
          style={subStyle}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
