export function TestimonialsSection({ section, testimonials }: any) {
  
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {section?.title || 'آراء عملائنا'}
          </h2>
          {section?.subtitle && (
            <p className="text-lg text-gray-500 whitespace-pre-line">{section.subtitle}</p>
          )}
          {section?.content && (
            <p className="mt-4 text-gray-600 whitespace-pre-line text-start">{section.content}</p>
          )}
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4"></div>
        </div>

        {testimonials && testimonials.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t: any) => (
               <div key={t.id} className="bg-gray-50 p-6 rounded-2xl flex flex-col h-full">
                 {t.image_url && (
                   <div className="mb-4 rounded-xl overflow-hidden bg-white border border-gray-100 flex justify-center p-2">
                     <img src={t.image_url} alt={t.customer_name} className="max-h-64 w-auto object-contain rounded-lg" />
                   </div>
                 )}
                 <div className="flex text-yellow-400 mb-4">
                   {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                 </div>
                 {t.comment && (
                   <p className="text-gray-700 italic mb-4 whitespace-pre-line text-start flex-1">"{t.comment}"</p>
                 )}
                 <div className="font-bold text-gray-900 mt-auto">{t.customer_name}</div>
               </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
