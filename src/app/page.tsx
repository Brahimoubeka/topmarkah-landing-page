import { createClient } from '@/lib/supabase/server'
import { MapPin, Phone, ShoppingCart } from 'lucide-react'
import { Metadata } from 'next'
import { OrderForm } from '@/components/landing/OrderForm'
import { HeroSection } from '@/components/landing/HeroSection'
import { OffersSection } from '@/components/landing/OffersSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { DeliverySection } from '@/components/landing/DeliverySection'
import { StickyOrderButton } from '@/components/landing/StickyOrderButton'
import { Header } from '@/components/landing/Header'
import { ScrollToTopButton } from '@/components/landing/ScrollToTopButton'
import { SectionHeading } from '@/components/landing/SectionHeading'
import { CustomSection } from '@/components/landing/CustomSection'
import { parseSectionData } from '@/lib/section-config'
import Script from 'next/script'

export const revalidate = 0 // Disable cache for development

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').single()
  
  return {
    title: settings?.seo_title || settings?.company_name || "TopMarkah",
    description: settings?.seo_description || "Premium products delivered to you.",
  }
}

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch all active landing sections ordered by display_order
  const { data: sections } = await supabase
    .from('landing_sections')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  // Fetch featured product
  const { data: products } = await supabase
    .from('products')
    .select('*, product_media(*)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .limit(1)

  const product = products?.[0]

  // Fetch active offers
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  // Fetch wilayas
  const { data: wilayas } = await supabase
    .from('wilayas')
    .select('*')
    .eq('is_active', true)
    .order('code', { ascending: true })

  // Fetch default company & delivery prices
  const { data: defaultCompany } = await supabase
    .from('delivery_companies')
    .select('id')
    .eq('is_active', true)
    .eq('is_default', true)
    .single()

  const { data: deliveryPrices } = await supabase
    .from('delivery_prices')
    .select('*')
    .eq('is_active', true)
    .eq('company_id', defaultCompany?.id)

  // Fetch testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  // Fetch FAQs
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  // Site settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  // Build a map of section data by section_id for easy access
  const sectionMap = Object.fromEntries(
    (sections || []).map(s => [s.section_id, s])
  )

  // Helper to check if a section is active
  const isActive = (id: string) => !!sectionMap[id]

  return (
    <div 
      className="min-h-screen bg-white text-gray-900 font-sans" 
      dir="rtl"
      style={{
        '--primary-color': settings?.primary_color || '#0f172a',
        '--secondary-color': settings?.secondary_color || '#3b82f6',
        '--accent-color': settings?.accent_color || '#10b981',
        '--background-color': settings?.background_color || '#ffffff',
        '--text-color': settings?.text_color || '#1e293b',
        '--button-color': settings?.button_color || '#3b82f6',
        '--button-text-color': settings?.button_text_color || '#ffffff',
        backgroundColor: 'var(--background-color)',
      } as React.CSSProperties}
    >
      {settings?.meta_pixel_id && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.meta_pixel_id}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── TOP RED BAR ── */}
      {settings?.whatsapp && (
        <div className="sticky top-0 w-full z-50 bg-red-600 text-white overflow-hidden py-2 text-sm sm:text-base font-bold flex shadow-md" dir="ltr">
          <div className="animate-marquee">
            {/* First Half */}
            <div className="flex shrink-0">
              {Array(6).fill(0).map((_, i) => (
                <span key={`first-${i}`} className="mx-4 sm:mx-8">
                  للطلب عبر الهاتف أو الاستفسار يمكنك التواصل عبر: <span className="text-yellow-300 mx-2 tracking-wider" dir="ltr">{settings.whatsapp}</span>
                </span>
              ))}
            </div>
            {/* Second Half (Exact Copy) */}
            <div className="flex shrink-0">
              {Array(6).fill(0).map((_, i) => (
                <span key={`second-${i}`} className="mx-4 sm:mx-8">
                  للطلب عبر الهاتف أو الاستفسار يمكنك التواصل عبر: <span className="text-yellow-300 mx-2 tracking-wider" dir="ltr">{settings.whatsapp}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <Header logoUrl={settings?.logo_url} />

      {/* ── DYNAMIC SECTIONS IN DISPLAY ORDER ── */}
      {sections?.map((section) => {
        switch (section.section_id) {
          case 'hero':
            return (
              <HeroSection
                key={section.id}
                section={section}
                product={product}
              />
            )

          case 'offers':
            return (
              <OffersSection
                key={section.id}
                section={section}
                offers={offers || []}
              />
            )

          case 'product': {
            const parsedProduct = parseSectionData(section)
            const contentText = parsedProduct.body || product?.description || ''
            const isImageLeft = parsedProduct.imagePosition === 'left'
            return (
              <section key={section.id} id="details" className="py-8 sm:py-12 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <SectionHeading
                    title={parsedProduct.title || product?.name || 'تفاصيل المنتج'}
                    subtitle={parsedProduct.subtitle}
                    icon={parsedProduct.icon}
                    titleColor={parsedProduct.titleColor}
                    fontSize={parsedProduct.fontSize}
                    fontFamily={parsedProduct.fontFamily}
                  />
                  {(contentText || parsedProduct.imageUrl) && (
                    <div className="max-w-3xl mx-auto">
                      <div
                        className={`bg-gray-50/80 p-4 sm:p-8 rounded-2xl sm:rounded-3xl ${
                          parsedProduct.imageUrl
                            ? `flex ${isImageLeft ? 'flex-row-reverse' : 'flex-row'} items-start gap-3.5 sm:gap-6`
                            : ''
                        }`}
                      >
                        {parsedProduct.imageUrl && (
                          <div className="shrink-0">
                            <div className="w-20 h-20 sm:w-32 sm:h-32 aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white">
                              <img
                                src={parsedProduct.imageUrl}
                                alt={parsedProduct.title || 'Product Image'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        {contentText && (
                          <div className="flex-1 min-w-0 text-gray-700 whitespace-pre-line text-start leading-relaxed text-sm sm:text-lg">
                            {contentText}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'benefits':
            return (
              <BenefitsSection
                key={section.id}
                section={section}
                product={product}
              />
            )

          case 'testimonials':
            return (
              <TestimonialsSection
                key={section.id}
                section={section}
                testimonials={testimonials || []}
              />
            )

          case 'faq':
            return (
              <FaqSection
                key={section.id}
                section={section}
                faqs={faqs || []}
              />
            )

          case 'delivery':
            return (
              <DeliverySection
                key={section.id}
                section={section}
              />
            )

          case 'order':
            return (
              <section key={section.id} id="order-form" className="py-10 sm:py-14 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                  {section?.title && (
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">{section.title}</h2>
                      {section?.subtitle && (
                        <p className="mt-2 text-sm sm:text-base text-gray-500">{section.subtitle}</p>
                      )}
                    </div>
                  )}
                  <OrderForm
                    offers={offers || []}
                    wilayas={wilayas || []}
                    deliveryPrices={deliveryPrices || []}
                    defaultCompanyId={defaultCompany?.id}
                  />
                </div>
              </section>
            )

          default:
            return (
              <CustomSection
                key={section.id}
                section={section}
              />
            )
        }
      })}

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm flex flex-col items-center">
          {settings?.logo_url && (
            <img src={settings.logo_url} alt={settings?.company_name || 'Logo'} className="h-12 w-auto mb-6 opacity-80 hover:opacity-100 transition-all" />
          )}
          
          <details className="w-full max-w-md mx-auto mb-8 cursor-pointer group">
            <summary className="text-gray-300 font-medium hover:text-white transition-colors list-none flex items-center justify-center gap-2 mb-4">
              <span>تواصل معنا</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="pt-4 pb-2 border-t border-gray-800 space-y-4 animate-in fade-in slide-in-from-top-2">
              {settings?.address && (
                <p className="flex justify-center items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {settings.address}
                </p>
              )}
              {settings?.phone && (
                <p className="flex justify-center items-center gap-2" dir="ltr">
                  <Phone className="w-4 h-4 text-primary" />
                  {settings.phone}
                </p>
              )}
              <div className="flex justify-center gap-6 mt-4">
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                    WhatsApp
                  </a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    Facebook
                  </a>
                )}
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                    Instagram
                  </a>
                )}
                {settings?.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </details>

          <p>© {new Date().getFullYear()} {settings?.company_name || 'TopMarkah'}. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* ── STICKY ORDER BUTTON ── */}
      {isActive('order') && <StickyOrderButton />}
      
      <ScrollToTopButton />
    </div>
  )
}
