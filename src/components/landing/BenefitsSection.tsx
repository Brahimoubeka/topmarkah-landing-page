import { Star } from 'lucide-react'

export function BenefitsSection({ section, product }: any) {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {section?.title || 'المواصفات والفوائد'}
          </h2>
          {section?.subtitle && (
            <p className="text-lg text-gray-500 whitespace-pre-line">{section.subtitle}</p>
          )}
          {section?.content && (
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto whitespace-pre-line text-start">{section.content}</p>
          )}
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4"></div>
        </div>

        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 ml-2" /> 
            أهم الفوائد:
          </h3>
          <p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-start">
            {product?.benefits}
          </p>
        </div>

        {product?.description && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              وصف المنتج
            </h3>
            <p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-start">
              {product.description}
            </p>
          </div>
        )}

        {product?.specifications && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              المواصفات
            </h3>
            <p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-start">
              {product.specifications}
            </p>
          </div>
        )}

        {product?.usage_instructions && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              طريقة الاستخدام
            </h3>
            <p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-start">
              {product.usage_instructions}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
