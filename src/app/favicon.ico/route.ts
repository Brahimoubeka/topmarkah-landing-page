import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('logo_url, favicon_url')
    .single()

  const url = settings?.favicon_url || settings?.logo_url
  if (url) {
    redirect(url)
  }

  return new Response(null, { status: 404 })
}
