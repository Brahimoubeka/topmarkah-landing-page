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

export function CustomSection({ section, isAlt = false }: { section: Section; isAlt?: boolean }) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily || 'cairo')
  const isImageBelow = parsed.imagePosition === 'below'

  return (
    <section id={section.section_id} className={`py-8 sm:py-14 relative overflow-hidden transition-colors ${isAlt ? 'bg-slate-50/80' : 'bg-white'}`}>
      <div className="mx-auto max-w-5xl px-0 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <SectionHeading
            title={parsed.title}
            subtitle={parsed.subtitle}
            icon={parsed.icon}
            titleColor={parsed.titleColor}
            fontSize={parsed.fontSize}
            fontFamily={parsed.fontFamily}
          />
        </div>

        {(parsed.body || parsed.imageUrl) && (
          <div className="max-w-3xl mx-auto">
            {parsed.imageUrl && parsed.body ? (
              <div className={`${isAlt ? 'bg-white' : 'bg-slate-50/70'} overflow-hidden rounded-none sm:rounded-3xl transition-colors flex flex-col shadow-none`}>
                {isImageBelow ? (
                  <>
                    <div className="p-5 sm:p-8">
                      <div className={`text-gray-700 whitespace-pre-line text-start leading-relaxed text-base sm:text-xl ${fontClass}`}>
                        {parsed.body}
                      </div>
                    </div>
                    <div className="w-full aspect-square bg-gray-100 overflow-hidden select-none">
                      <img
                        src={parsed.imageUrl}
                        alt={parsed.title || 'Section Image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full aspect-square bg-gray-100 overflow-hidden select-none">
                      <img
                        src={parsed.imageUrl}
                        alt={parsed.title || 'Section Image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-5 sm:p-8">
                      <div className={`text-gray-700 whitespace-pre-line text-start leading-relaxed text-base sm:text-xl ${fontClass}`}>
                        {parsed.body}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : parsed.imageUrl ? (
              <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-none sm:rounded-3xl select-none">
                <img
                  src={parsed.imageUrl}
                  alt={parsed.title || 'Section Image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="px-4 sm:px-0">
                <div className={`${isAlt ? 'bg-white' : 'bg-slate-50/70'} p-5 sm:p-8 rounded-2xl sm:rounded-3xl transition-colors`}>
                  <div className={`text-gray-700 whitespace-pre-line text-start leading-relaxed text-base sm:text-xl ${fontClass}`}>
                    {parsed.body}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
