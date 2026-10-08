import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './_components/settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Ensure there's a row in site_settings
  const { data: existingSettings } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  let settings = existingSettings

  if (!settings) {
    const { data: newSettings } = await supabase
      .from('site_settings')
      .insert({})
      .select('*')
      .single()
    settings = newSettings
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage your store's general information, design, and social links.
        </p>
      </div>
      
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
