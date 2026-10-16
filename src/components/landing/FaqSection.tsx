import { SectionHeading } from './SectionHeading'
import { parseSectionData } from '@/lib/section-config'

export function FaqSection({ section, faqs, isAlt = false }: any) {
  const parsed = parseSectionData(section)

  return (
    <section id="faq" className={`py-8 sm:py-12 transition-colors ${isAlt ? 'bg-slate-50/80' : 'bg-white'}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={parsed.title || 'الأسئلة الشائعة'}
          subtitle={parsed.subtitle}
          icon={parsed.icon}
          titleColor={parsed.titleColor}
          fontSize={parsed.fontSize}
          fontFamily={parsed.fontFamily}
        />

        {faqs && faqs.length > 0 && (
          <div className="space-y-2.5">
            {faqs.map((faq: any) => (
              <details key={faq.id} className={`${isAlt ? 'bg-white' : 'bg-slate-50/70'} p-6 rounded-2xl group transition-colors`}>
                <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line text-start">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
