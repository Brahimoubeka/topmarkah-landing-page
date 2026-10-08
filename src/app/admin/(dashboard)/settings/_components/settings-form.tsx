'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Loader2, Palette, Globe, Phone, Building, ImagePlus, X } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings || {})
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', settings.id)
    
    setSaving(false)
    if (!error) {
      alert('Settings saved successfully!')
    } else {
      alert('Error saving settings.')
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setSaving(true)
    const path = `logos/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('landing')
      .upload(path, file)
      
    if (!error) {
      const { data } = supabase.storage.from('landing').getPublicUrl(path)
      updateField('logo_url', data.publicUrl)
    } else {
      alert('Failed to upload logo')
    }
    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-gray-500" /> General Info</CardTitle>
            <p className="text-sm text-gray-500">Basic information about your store</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Logo</Label>
              <div className="flex items-center gap-4">
                <div className="relative aspect-video w-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group overflow-hidden">
                  {settings.logo_url ? (
                    <>
                      <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                      <button 
                        onClick={() => updateField('logo_url', '')}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-blue-500">
                      <ImagePlus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium text-center px-2">Upload Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={saving} />
                    </label>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  <p>Recommended: PNG with transparent background.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input 
                value={settings.company_name || ''} 
                onChange={(e) => updateField('company_name', e.target.value)} 
                placeholder="e.g. TopMarkah"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input 
                value={settings.currency || ''} 
                onChange={(e) => updateField('currency', e.target.value)} 
                placeholder="e.g. DA"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={settings.address || ''} 
                onChange={(e) => updateField('address', e.target.value)} 
                placeholder="Store address..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Socials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5 text-gray-500" /> Contact & Social</CardTitle>
            <p className="text-sm text-gray-500">How customers can reach you</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                value={settings.phone || ''} 
                onChange={(e) => updateField('phone', e.target.value)} 
                placeholder="e.g. 0555..." dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input 
                value={settings.whatsapp || ''} 
                onChange={(e) => updateField('whatsapp', e.target.value)} 
                placeholder="e.g. 0555..." dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook Page URL</Label>
              <Input 
                value={settings.facebook || ''} 
                onChange={(e) => updateField('facebook', e.target.value)} 
                placeholder="https://facebook.com/..." dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input 
                value={settings.instagram || ''} 
                onChange={(e) => updateField('instagram', e.target.value)} 
                placeholder="https://instagram.com/..." dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>TikTok URL</Label>
              <Input 
                value={settings.tiktok || ''} 
                onChange={(e) => updateField('tiktok', e.target.value)} 
                placeholder="https://tiktok.com/@..." dir="ltr"
              />
            </div>
          </CardContent>
        </Card>

        {/* Design Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-gray-500" /> Theme Colors</CardTitle>
            <p className="text-sm text-gray-500">Customize the look and feel of your landing page</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={settings.primary_color || '#0f172a'} 
                    onChange={(e) => updateField('primary_color', e.target.value)} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={settings.primary_color || '#0f172a'} 
                    onChange={(e) => updateField('primary_color', e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={settings.secondary_color || '#3b82f6'} 
                    onChange={(e) => updateField('secondary_color', e.target.value)} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={settings.secondary_color || '#3b82f6'} 
                    onChange={(e) => updateField('secondary_color', e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={settings.accent_color || '#10b981'} 
                    onChange={(e) => updateField('accent_color', e.target.value)} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={settings.accent_color || '#10b981'} 
                    onChange={(e) => updateField('accent_color', e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={settings.background_color || '#ffffff'} 
                    onChange={(e) => updateField('background_color', e.target.value)} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={settings.background_color || '#ffffff'} 
                    onChange={(e) => updateField('background_color', e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={settings.text_color || '#1e293b'} 
                    onChange={(e) => updateField('text_color', e.target.value)} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={settings.text_color || '#1e293b'} 
                    onChange={(e) => updateField('text_color', e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Button Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={settings.button_color || '#3b82f6'} 
                    onChange={(e) => updateField('button_color', e.target.value)} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={settings.button_color || '#3b82f6'} 
                    onChange={(e) => updateField('button_color', e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-gray-500" /> SEO Settings</CardTitle>
            <p className="text-sm text-gray-500">How your site appears on Google</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input 
                value={settings.seo_title || ''} 
                onChange={(e) => updateField('seo_title', e.target.value)} 
                placeholder="TopMarkah - The best products"
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <textarea 
                value={settings.seo_description || ''} 
                onChange={(e) => updateField('seo_description', e.target.value)} 
                placeholder="Write a brief description about your store..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
