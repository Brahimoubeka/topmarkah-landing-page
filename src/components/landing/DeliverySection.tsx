import { Truck, Clock, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { parseSectionData } from '@/lib/section-config'

export function DeliverySection({ section, isAlt = false }: any) {
  const parsed = parseSectionData(section)

  return (
    <section id="delivery" className={`py-4 sm:py-8 transition-colors ${isAlt ? 'bg-slate-50/80' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <SectionHeading
          title={parsed.title || 'معلومات التوصيل'}
          subtitle={parsed.subtitle}
          icon={parsed.icon}
          titleColor={parsed.titleColor}
          fontSize={parsed.fontSize}
          fontFamily={parsed.fontFamily}
          className="mb-3 sm:mb-6"
        />

        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          <div className={`text-center p-2 sm:p-4 rounded-xl ${isAlt ? 'bg-white' : 'bg-slate-50/70'} sm:bg-transparent flex flex-col items-center transition-colors`}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-1.5 sm:mb-3 shrink-0">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 leading-snug">
              توصيل لجميع الولايات
            </h3>
            <p className="text-[10px] sm:text-sm text-gray-600 leading-tight">
              نوفر خدمة التوصيل السريع لجميع ولايات الوطن (58 ولاية)
            </p>
          </div>

          <div className="text-center p-2 sm:p-4 rounded-xl bg-gray-50/70 sm:bg-transparent flex flex-col items-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-1.5 sm:mb-3 shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 leading-snug">
              توصيل سريع
            </h3>
            <p className="text-[10px] sm:text-sm text-gray-600 leading-tight">
              التوصيل يتم في غضون 24 إلى 72 ساعة حسب الولاية
            </p>
          </div>

          <div className="text-center p-2 sm:p-4 rounded-xl bg-gray-50/70 sm:bg-transparent flex flex-col items-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-1.5 sm:mb-3 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 leading-snug">
              الدفع عند الاستلام
            </h3>
            <p className="text-[10px] sm:text-sm text-gray-600 leading-tight">
              لا تدفع شيئاً حتى تستلم طلبك وتتأكد منه
            </p>
          </div>
        </div>
        
        {parsed.body && parsed.body.trim() !== '' && (
          <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-xl text-center max-w-3xl mx-auto text-xs sm:text-sm text-gray-600">
            {parsed.body}
          </div>
        )}
      </div>
    </section>
  )
}
