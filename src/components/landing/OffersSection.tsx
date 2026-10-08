'use client'

import { CheckCircle2 } from 'lucide-react'

export function OffersSection({ section, offers }: any) {
  return (
    <section id="offers" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {section?.title || 'عروضنا الحصرية'}
          </h2>
          {section?.subtitle && (
            <p className="text-lg text-gray-500 whitespace-pre-line">{section.subtitle}</p>
          )}
          {section?.content && (
            <p className="mt-4 text-gray-600 whitespace-pre-line text-start">{section.content}</p>
          )}
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4"></div>
        </div>

        {!offers || offers.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-3xl border border-dashed border-gray-200">
            لا توجد عروض حالياً. أضف عروضاً من لوحة التحكم.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer: any) => (
              <div key={offer.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-lg hover:border-blue-200">
                {offer.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    تخفيض {offer.discount}%
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.name}</h3>
                <p className="text-gray-500 mb-6 min-h-[48px] whitespace-pre-line text-start">{offer.short_description}</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-black text-primary">{offer.price}</span>
                  <span className="text-lg font-bold text-gray-500">DA</span>
                  {offer.old_price > 0 && (
                    <span className="text-sm text-gray-400 line-through mr-2">{offer.old_price} DA</span>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-3 shrink-0" />
                    <span>الكمية: {offer.quantity_included}</span>
                  </li>
                  {offer.gifts && (
                    <li className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-3 shrink-0" />
                      <span>الهدايا: {offer.gifts}</span>
                    </li>
                  )}
                  {offer.full_description && (
                    <li className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-3 shrink-0" />
                      <span>{offer.full_description}</span>
                    </li>
                  )}
                </ul>
                
                <a 
                  href="#order-form"
                  onClick={(e) => {
                    window.dispatchEvent(new CustomEvent('selectOffer', { detail: offer.id }))
                  }}
                  className="block w-full py-4 text-center font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  اطلب العرض
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
