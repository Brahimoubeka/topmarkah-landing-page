import { Truck, Clock, ShieldCheck } from 'lucide-react'

export function DeliverySection({ section }: any) {
  return (
    <section id="delivery" className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">
            {section?.title || 'معلومات التوصيل'}
          </h2>
          {section?.subtitle && (
            <p className="text-base text-gray-500 whitespace-pre-line">{section.subtitle}</p>
          )}
          <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-3"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">توصيل لجميع الولايات</h3>
            <p className="text-sm text-gray-600">نوفر خدمة التوصيل السريع لجميع ولايات الوطن (58 ولاية)</p>
          </div>
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">توصيل سريع</h3>
            <p className="text-sm text-gray-600">التوصيل يتم في غضون 24 إلى 72 ساعة حسب الولاية</p>
          </div>
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">الدفع عند الاستلام</h3>
            <p className="text-sm text-gray-600">لا تدفع شيئاً حتى تستلم طلبك وتتأكد منه</p>
          </div>
        </div>
        
        {section?.content && (
          <div className="mt-8 bg-gray-50 p-4 rounded-xl text-center max-w-3xl mx-auto text-sm text-gray-600">
            {section.content}
          </div>
        )}
      </div>
    </section>
  )
}
