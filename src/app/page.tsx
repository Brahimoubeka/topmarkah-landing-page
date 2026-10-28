import { Fragment } from 'react'
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
import { SectionConnector } from '@/components/landing/SectionConnector'
import { parseSectionData, serializeSectionContent } from '@/lib/section-config'
import Script from 'next/script'

export const revalidate = 10 // Cache landing page for instant loading (revalidates every 10s)

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').single()

  let previewImage = settings?.logo_url || settings?.favicon_url || null
  if (!previewImage) {
    const { data: products } = await supabase
      .from('products')
      .select('product_media(*)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .limit(1)
    previewImage = products?.[0]?.product_media?.[0]?.media_url || null
  }

  const title = settings?.seo_title || settings?.company_name || "TopMarkah"
  const description = settings?.seo_description || "اكتشف أفضل المنتجات المميزة مع توصيل سريع لجميع الولايات والدفع عند الاستلام."

  return {
    title,
    description,
    icons: previewImage ? {
      icon: previewImage,
      shortcut: previewImage,
      apple: previewImage,
    } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ar_DZ',
      siteName: settings?.company_name || 'TopMarkah',
      images: previewImage ? [
        {
          url: previewImage,
          alt: title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: previewImage ? [previewImage] : [],
    },
  }
}

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch all landing page data concurrently to eliminate waterfall delays
  const [
    { data: sections },
    { data: products },
    { data: offers },
    { data: wilayas },
    { data: testimonials },
    { data: faqs },
    { data: settings },
    deliveryData,
  ] = await Promise.all([
    supabase
      .from('landing_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('products')
      .select('*, product_media(*)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .limit(1),
    supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('wilayas')
      .select('*')
      .eq('is_active', true)
      .order('code', { ascending: true }),
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('site_settings')
      .select('*')
      .single(),
    (async () => {
      const { data: defaultCompany } = await supabase
        .from('delivery_companies')
        .select('id')
        .eq('is_active', true)
        .eq('is_default', true)
        .single()

      if (!defaultCompany?.id) return { defaultCompany: null, deliveryPrices: [] }

      const { data: deliveryPrices } = await supabase
        .from('delivery_prices')
        .select('*')
        .eq('is_active', true)
        .eq('company_id', defaultCompany.id)

      return { defaultCompany, deliveryPrices: deliveryPrices || [] }
    })(),
  ])

  const product = products?.[0]
  const defaultCompany = deliveryData.defaultCompany
  const deliveryPrices = deliveryData.deliveryPrices

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
        <Script id="meta-pixel" strategy="lazyOnload">
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

      {/* Header is integrated directly into Hero when hero is active; fallback if disabled */}
      {!isActive('hero') && <Header logoUrl={settings?.logo_url} />}

      {/* ── DYNAMIC SECTIONS IN DISPLAY ORDER ── */}
      {sections?.map((section, index) => {
        const isAlt = index % 2 === 1
        const isNotLast = index < (sections?.length || 0) - 1

        let content = null
        switch (section.section_id) {
          case 'hero':
            content = (
              <HeroSection
                section={section}
                product={product}
                isAlt={isAlt}
                logoUrl={settings?.logo_url}
              />
            )
            break

          case 'offers': {
            const parsedOfferSec = parseSectionData(section)
            const secOffers = parsedOfferSec.selectedOfferIds && parsedOfferSec.selectedOfferIds.length > 0
              ? (offers || []).filter(o => parsedOfferSec.selectedOfferIds!.includes(o.id))
              : (offers || [])
            content = (
              <OffersSection
                section={section}
                offers={secOffers}
                isAlt={isAlt}
              />
            )
            break
          }

          case 'product': {
            const parsedProduct = parseSectionData(section)
            const productSection = {
              ...section,
              title: parsedProduct.title,
              content: parsedProduct.body ? section.content : serializeSectionContent({
                ...parsedProduct,
                body: product?.description || '',
              }),
            }
            content = (
              <div id="details">
                <CustomSection section={productSection} isAlt={isAlt} />
              </div>
            )
            break
          }

          case 'benefits':
            content = (
              <BenefitsSection
                section={section}
                product={product}
                isAlt={isAlt}
              />
            )
            break

          case 'testimonials':
            content = (
              <TestimonialsSection
                section={section}
                testimonials={testimonials || []}
                isAlt={isAlt}
              />
            )
            break

          case 'faq':
            content = (
              <FaqSection
                section={section}
                faqs={faqs || []}
                isAlt={isAlt}
              />
            )
            break

          case 'delivery':
            content = (
              <DeliverySection
                section={section}
                isAlt={isAlt}
              />
            )
            break

          case 'order':
            content = (
              <section id="order-form" className={`py-10 sm:py-14 relative overflow-hidden transition-colors ${
                isAlt 
                  ? 'bg-gradient-to-b from-slate-100/90 via-slate-50 to-white' 
                  : 'bg-gradient-to-b from-slate-50 via-white to-slate-50/60'
              }`}>
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
            break

          default:
            if (section.section_id.startsWith('offer')) {
              const parsedOfferSec = parseSectionData(section)
              const secOffers = parsedOfferSec.selectedOfferIds && parsedOfferSec.selectedOfferIds.length > 0
                ? (offers || []).filter(o => parsedOfferSec.selectedOfferIds!.includes(o.id))
                : (offers || [])
              content = (
                <OffersSection
                  section={section}
                  offers={secOffers}
                  isAlt={isAlt}
                />
              )
              break
            }
            content = (
              <CustomSection
                section={section}
                isAlt={isAlt}
              />
            )
            break
        }

        return (
          <Fragment key={section.id}>
            {content}
            {isNotLast && <SectionConnector />}
          </Fragment>
        )
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
