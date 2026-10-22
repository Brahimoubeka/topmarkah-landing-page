import React from 'react'
import { Truck, Clock, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData, getFontClass } from '@/lib/section-config'

export function DeliverySection({ section, isAlt = false }: any) {
  const parsed = parseSectionData(section)
  const fontClass = getFontClass(parsed.fontFamily)

  const card1Title = parsed.card1Title !== undefined ? parsed.card1Title : 'توصيل لجميع الولايات'
  const card1Desc = parsed.card1Desc !== undefined ? parsed.card1Desc : 'نوفر خدمة التوصيل السريع لجميع ولايات الوطن (58 ولاية)'

  const card2Title = parsed.card2Title !== undefined ? parsed.card2Title : 'توصيل سريع'
  const card2Desc = parsed.card2Desc !== undefined ? parsed.card2Desc : 'التوصيل يتم في غضون 24 إلى 72 ساعة حسب الولاية'

  const card3Title = parsed.card3Title !== undefined ? parsed.card3Title : 'الدفع عند الاستلام'
  const card3Desc = parsed.card3Desc !== undefined ? parsed.card3Desc : 'لا تدفع شيئاً حتى تستلم طلبك وتتأكد منه'

  const sectionStyle: React.CSSProperties = {}
  if (parsed.backgroundColor) sectionStyle.backgroundColor = parsed.backgroundColor

  const textStyle: React.CSSProperties = {}
  if (parsed.textColor) textStyle.color = parsed.textColor

  return (
    <section
      id="delivery"
      className={`py-4 sm:py-8 transition-colors ${
        !parsed.backgroundColor ? (isAlt ? 'bg-slate-50/80' : 'bg-white') : ''
      }`}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
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
          className="mb-3 sm:mb-6"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {card1Title && (
            <div
              className={`text-center p-3 sm:p-5 rounded-2xl ${
                parsed.backgroundColor ? 'bg-black/5' : isAlt ? 'bg-white' : 'bg-slate-50/70'
              } flex flex-col items-center transition-colors`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-2 sm:mb-3 shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className={`text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 leading-snug ${fontClass}`} style={textStyle}>
                {card1Title}
              </h3>
              {card1Desc && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed" style={textStyle ? { color: `${parsed.textColor}cc` } : undefined}>
                  {card1Desc}
                </p>
              )}
            </div>
          )}

          {card2Title && (
            <div
              className={`text-center p-3 sm:p-5 rounded-2xl ${
                parsed.backgroundColor ? 'bg-black/5' : isAlt ? 'bg-white' : 'bg-slate-50/70'
              } flex flex-col items-center transition-colors`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-2 sm:mb-3 shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className={`text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 leading-snug ${fontClass}`} style={textStyle}>
                {card2Title}
              </h3>
              {card2Desc && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed" style={textStyle ? { color: `${parsed.textColor}cc` } : undefined}>
                  {card2Desc}
                </p>
              )}
            </div>
          )}

          {card3Title && (
            <div
              className={`text-center p-3 sm:p-5 rounded-2xl ${
                parsed.backgroundColor ? 'bg-black/5' : isAlt ? 'bg-white' : 'bg-slate-50/70'
              } flex flex-col items-center transition-colors`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-2 sm:mb-3 shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className={`text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 leading-snug ${fontClass}`} style={textStyle}>
                {card3Title}
              </h3>
              {card3Desc && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed" style={textStyle ? { color: `${parsed.textColor}cc` } : undefined}>
                  {card3Desc}
                </p>
              )}
            </div>
          )}
        </div>

        {parsed.body && parsed.body.trim() !== '' && (
          <div
            className="mt-4 bg-gray-50/90 p-4 rounded-xl text-center max-w-3xl mx-auto text-xs sm:text-sm text-gray-700 leading-relaxed"
            style={textStyle}
          >
            {parsed.body}
          </div>
        )}
      </div>
    </section>
  )
}
