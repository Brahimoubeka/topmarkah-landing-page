export function FaqSection({ section, faqs }: any) {

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {section?.title || 'الأسئلة الشائعة'}
          </h2>
          {section?.subtitle && (
            <p className="text-lg text-gray-500 whitespace-pre-line">{section.subtitle}</p>
          )}
          {section?.content && (
            <p className="mt-4 text-gray-600 whitespace-pre-line text-start">{section.content}</p>
          )}
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4"></div>
        </div>

        {faqs && faqs.length > 0 && (
          <div className="space-y-4">
            {faqs.map((faq: any) => (
              <details key={faq.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
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
