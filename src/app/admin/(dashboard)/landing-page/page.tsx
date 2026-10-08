import { createClient } from '@/lib/supabase/server'
import { LandingPageEditor } from './_components/landing-page-editor'

export default async function LandingPageConfig() {
  const supabase = await createClient()

  const { data: sections } = await supabase
    .from('landing_sections')
    .select('*')
    .order('display_order', { ascending: true })

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, is_active, is_featured')
    .order('created_at', { ascending: false })

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Landing Page</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit your landing page sections, hero text, colors, and active product.
        </p>
      </div>

      {!sections || sections.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800 text-sm">
          <strong>No sections configured yet.</strong> Please run the SQL seed script in the Supabase SQL Editor:
          <br />
          <code className="mt-2 block bg-amber-100 p-2 rounded font-mono text-xs">
            supabase/migrations/00000000000002_seed_landing_sections.sql
          </code>
        </div>
      ) : (
        <LandingPageEditor
          sections={sections}
          settings={settings}
          products={products || []}
          testimonials={testimonials || []}
          faqs={faqs || []}
        />
      )}
    </div>
  )
}
