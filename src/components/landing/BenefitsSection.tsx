import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData, getFontClass } from '@/lib/section-config'

export function BenefitsSection({ section, product, isAlt = false }: any) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily)

  // Use body from landing page config first, or fallback to product benefits
  const contentText = parsed.body || product?.benefits || product?.description || ''

  // Split into paragraphs or bullet points if multi-line
  const lines = contentText
    .split('\n')
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0)

  const sectionStyle: React.CSSProperties = {}
  if (parsed.backgroundColor) sectionStyle.backgroundColor = parsed.backgroundColor

  const textStyle: React.CSSProperties = {}
  if (parsed.textColor) textStyle.color = parsed.textColor

  return (
    <section
      id="benefits"
      className={`py-8 sm:py-12 transition-colors ${
        !parsed.backgroundColor ? (isAlt ? 'bg-slate-50/80' : 'bg-white') : ''
      }`}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {lines.length > 0 && (
          <div className="max-w-4xl mx-auto grid gap-3 sm:gap-4 md:grid-cols-2">
            {lines.map((line: string, i: number) => {
              const cleanLine = line.replace(/^[-•*–—]\s*/, '')
              return (
                <div
                  key={i}
                  className={`${
                    parsed.backgroundColor
                      ? 'bg-black/5'
                      : isAlt
                      ? 'bg-white'
                      : 'bg-slate-50/70'
                  } p-4 sm:p-5 rounded-2xl flex items-start gap-3 transition-colors`}
                >
                  <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p
                    className={`text-gray-800 text-sm sm:text-base leading-relaxed text-start flex-1 font-medium ${fontClass}`}
                    style={textStyle}
                  >
                    {cleanLine}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
