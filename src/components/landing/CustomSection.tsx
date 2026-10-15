import React from 'react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData, getFontClass } from '@/lib/section-config'

type Section = {
  id: string
  section_id: string
  title: string | null
  subtitle: string | null
  content: string | null
  image_url?: string | null
  is_active: boolean
}

export function CustomSection({ section }: { section: Section }) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily || 'cairo')
  const isImageLeft = parsed.imagePosition === 'left'

  return (
    <section id={section.section_id} className="py-10 sm:py-16 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={parsed.title}
          subtitle={parsed.subtitle}
          icon={parsed.icon}
          titleColor={parsed.titleColor}
          fontSize={parsed.fontSize}
          fontFamily={parsed.fontFamily}
        />

        {(parsed.body || parsed.imageUrl) && (
          <div className="max-w-3xl mx-auto">
            <div 
              className={`bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-4 sm:p-8 rounded-2xl sm:rounded-3xl ${
                parsed.imageUrl
                  ? `flex ${isImageLeft ? 'flex-row-reverse' : 'flex-row'} items-start gap-3.5 sm:gap-6`
                  : ''
              }`}
            >
              {parsed.imageUrl && (
                <div className="shrink-0">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white">
                    <img
                      src={parsed.imageUrl}
                      alt={parsed.title || 'Section Image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {parsed.body && (
                <div 
                  className={`flex-1 min-w-0 text-gray-700 whitespace-pre-line text-start leading-relaxed text-sm sm:text-lg ${fontClass}`}
                >
                  {parsed.body}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
