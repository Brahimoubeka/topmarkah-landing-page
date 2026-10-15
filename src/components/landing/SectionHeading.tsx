import React from 'react'
import { SectionIcon, getFontClass } from '@/lib/section-config'

export function SectionHeading({
  title,
  subtitle,
  icon,
  titleColor,
  fontSize = 'text-2xl sm:text-4xl',
  fontFamily = 'cairo',
  align = 'center',
  className = '',
}: {
  title?: string | null
  subtitle?: string | null
  icon?: string | null
  titleColor?: string | null
  fontSize?: string | null
  fontFamily?: string | null
  align?: 'center' | 'start'
  className?: string
}) {
  if (!title && !subtitle) return null

  const fontClass = getFontClass(fontFamily || 'cairo')
  const sizeClass = fontSize || 'text-2xl sm:text-4xl'
  const isCenter = align === 'center'

  return (
    <div className={`mb-6 sm:mb-8 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-start'} ${className}`}>
      {title && (
        <h2
          className={`font-black tracking-tight flex items-center gap-2.5 glow-title ${
            isCenter ? 'justify-center' : 'justify-start'
          } ${sizeClass} ${fontClass}`}
          style={titleColor ? { color: titleColor } : { color: 'var(--text-color, #0f172a)' }}
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

      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-gray-500 whitespace-pre-line leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
