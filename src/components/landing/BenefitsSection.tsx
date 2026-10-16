import { CheckCircle2, Sparkles } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData } from '@/lib/section-config'

export function BenefitsSection({ section, product, isAlt = false }: any) {
  const parsed = parseSectionData(section)

  // Use body from landing page config first, or fallback to product benefits
  const contentText = parsed.body || product?.benefits || product?.description || ''

  // Split into paragraphs or bullet points if multi-line
  const lines = contentText
    .split('\n')
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0)

  return (
    <section id="benefits" className={`py-8 sm:py-12 transition-colors ${isAlt ? 'bg-slate-50/80' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={parsed.title || 'المواصفات والفوائد'}
          subtitle={parsed.subtitle}
          icon={parsed.icon}
          titleColor={parsed.titleColor}
          fontSize={parsed.fontSize}
          fontFamily={parsed.fontFamily}
        />

        {lines.length > 0 && (
          <div className="max-w-4xl mx-auto grid gap-3 sm:gap-4 md:grid-cols-2">
            {lines.map((line: string, i: number) => {
              // Remove leading dashes or bullets if user typed them
              const cleanLine = line.replace(/^[-•*–—]\s*/, '')
              return (
                <div
                  key={i}
                  className={`${isAlt ? 'bg-white' : 'bg-slate-50/70'} p-4 sm:p-5 rounded-2xl flex items-start gap-3 transition-colors`}
                >
                  <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed text-start flex-1 font-medium">
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
