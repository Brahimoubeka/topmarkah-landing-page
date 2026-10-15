'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Eye, EyeOff, GripVertical, Save, ExternalLink,
  ChevronDown, ChevronUp, Palette, Plus, Trash2, Star,
  ImagePlus, Loader2, X
} from 'lucide-react'
import { SectionConfigEditor } from './section-config-editor'

// ── Image compression using Canvas ──────────────────────────────────────────
const MAX_WIDTH = 1200
const JPEG_QUALITY = 0.82
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        blob => {
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/jpeg',
        JPEG_QUALITY
      )
    }
    img.onerror = reject
    img.src = url
  })
}

type Section = {
  id: string
  section_id: string
  title: string | null
  subtitle: string | null
  content: string | null
  is_active: boolean
  display_order: number
}

type Settings = {
  id: string
  company_name: string | null
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  button_color: string | null
  button_text_color: string | null
  seo_title: string | null
  seo_description: string | null
  phone: string | null
  whatsapp: string | null
  currency: string | null
} | null

type Product = {
  id: string
  name: string
  is_active: boolean
  is_featured: boolean
}

type Testimonial = {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
}

type Faq = {
  id: string
  question: string
  answer: string
  is_active: boolean
  display_order: number
}

const SECTION_LABELS: Record<string, string> = {
  hero: '🏠 Hero Section',
  product: '📦 Product Details',
  benefits: '✅ Benefits',
  offers: '🏷️ Offers',
  testimonials: '⭐ Testimonials',
  faq: '❓ FAQ',
  delivery: '🚚 Delivery Info',
  order: '🛒 Order Form',
}

export function LandingPageEditor({ sections, settings, products, testimonials: initialTestimonials, faqs: initialFaqs }: {
  sections: Section[]
  settings: Settings
  products: Product[]
  testimonials: Testimonial[]
  faqs: Faq[]
}) {
  const [localSections, setLocalSections] = useState<Section[]>(sections)
  const [localSettings, setLocalSettings] = useState(settings)
  const [expandedSection, setExpandedSection] = useState<string | null>('hero')
  const [saving, setSaving] = useState<string | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'sections' | 'testimonials' | 'faqs' | 'design' | 'seo'>('sections')

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [newTestimonial, setNewTestimonial] = useState<{
    customer_name: string; rating: number; comment: string; image_file: File | null; image_preview: string | null;
  }>({ customer_name: '', rating: 5, comment: '', image_file: null, image_preview: null })
  const [savingTestimonial, setSavingTestimonial] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null)
  const [editingTestimonialImage, setEditingTestimonialImage] = useState<{file: File | null, preview: string | null}>({file: null, preview: null})

  // FAQs state
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [savingFaq, setSavingFaq] = useState(false)
  const [editingFaq, setEditingFaq] = useState<string | null>(null)

  const supabase = createClient()

  // ── SECTIONS ──────────────────────────────────────────────
  async function toggleSection(sectionId: string, currentActive: boolean) {
    const section = localSections.find(s => s.id === sectionId)
    if (!section) return

    setLocalSections(prev =>
      prev.map(s => s.id === sectionId ? { ...s, is_active: !currentActive } : s)
    )
    await supabase.from('landing_sections').update({ is_active: !currentActive }).eq('id', sectionId)
  }

  async function saveSection(sectionId: string) {
    setSaving(sectionId)
    const section = localSections.find(s => s.id === sectionId)
    if (!section) return setSaving(null)

    await supabase.from('landing_sections').update({
      title: section.title,
      subtitle: section.subtitle,
      content: section.content,
    }).eq('id', sectionId)

    setSaving(null)
  }

  async function saveSectionCustom(sectionId: string, fields: { title: string; subtitle: string; content: string }) {
    setSaving(sectionId)
    setLocalSections(prev =>
      prev.map(s => s.id === sectionId ? { ...s, ...fields } : s)
    )
    await supabase.from('landing_sections').update(fields).eq('id', sectionId)
    setSaving(null)
  }

  function updateSection(id: string, field: keyof Section, value: string) {
    setLocalSections(prev =>
      prev.map(s => s.id === id ? { ...s, [field]: value } : s)
    )
  }

  // ── SETTINGS ──────────────────────────────────────────────
  async function saveSettings() {
    if (!localSettings) return
    setSavingSettings(true)
    await supabase.from('site_settings').update(localSettings).eq('id', localSettings.id)
    setSavingSettings(false)
  }

  async function setFeaturedProduct(productId: string) {
    await supabase.from('products').update({ is_featured: false }).neq('id', productId)
    await supabase.from('products').update({ is_featured: true }).eq('id', productId)
    window.location.reload()
  }

  // ── TESTIMONIALS ──────────────────────────────────────────
  async function handleNewTestimonialImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setNewTestimonial(prev => ({ ...prev, image_file: file, image_preview: preview }))
  }

  async function handleEditTestimonialImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setEditingTestimonialImage({ file, preview })
  }

  async function addTestimonial() {
    if (!newTestimonial.customer_name.trim()) return
    setSavingTestimonial(true)
    
    let uploadedImageUrl = null
    if (newTestimonial.image_file) {
      try {
        const compressedBlob = await compressImage(newTestimonial.image_file)
        const path = `testimonials/${Date.now()}_${newTestimonial.image_file.name}`
        const { error: uploadError } = await supabase.storage
          .from('landing')
          .upload(path, compressedBlob, { contentType: 'image/jpeg' })
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('landing').getPublicUrl(path)
          uploadedImageUrl = urlData.publicUrl
        }
      } catch (err) {
        console.error("Image upload failed", err)
      }
    }

    const { data, error } = await supabase.from('testimonials').insert({
      customer_name: newTestimonial.customer_name,
      rating: newTestimonial.rating,
      comment: newTestimonial.comment || null,
      image_url: uploadedImageUrl,
      is_active: true,
      display_order: testimonials.length,
    }).select().single()

    if (!error && data) {
      setTestimonials(prev => [...prev, data as Testimonial])
      if (newTestimonial.image_preview) URL.revokeObjectURL(newTestimonial.image_preview)
      setNewTestimonial({ customer_name: '', rating: 5, comment: '', image_file: null, image_preview: null })
    }
    setSavingTestimonial(false)
  }

  async function deleteTestimonial(id: string) {
    await supabase.from('testimonials').delete().eq('id', id)
    setTestimonials(prev => prev.filter(t => t.id !== id))
  }

  async function toggleTestimonial(id: string, current: boolean) {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id)
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t))
  }

  async function saveTestimonial(t: Testimonial) {
    setSaving('t_' + t.id)
    
    let uploadedImageUrl = t.image_url
    if (editingTestimonialImage.file) {
      try {
        const compressedBlob = await compressImage(editingTestimonialImage.file)
        const path = `testimonials/${Date.now()}_${editingTestimonialImage.file.name}`
        const { error: uploadError } = await supabase.storage
          .from('landing')
          .upload(path, compressedBlob, { contentType: 'image/jpeg' })
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('landing').getPublicUrl(path)
          uploadedImageUrl = urlData.publicUrl
        }
      } catch (err) {
        console.error("Image upload failed", err)
      }
    }

    await supabase.from('testimonials').update({
      customer_name: t.customer_name,
      rating: t.rating,
      comment: t.comment,
      image_url: uploadedImageUrl,
    }).eq('id', t.id)
    
    setTestimonials(prev => prev.map(item => item.id === t.id ? { ...item, image_url: uploadedImageUrl } : item))
    setSaving(null)
    setEditingTestimonial(null)
    setEditingTestimonialImage({ file: null, preview: null })
  }

  function updateTestimonial(id: string, field: keyof Testimonial, value: any) {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  // ── FAQS ──────────────────────────────────────────────────
  async function addFaq() {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return
    setSavingFaq(true)
    const { data, error } = await supabase.from('faqs').insert({
      question: newFaq.question,
      answer: newFaq.answer,
      is_active: true,
      display_order: faqs.length,
    }).select().single()

    if (!error && data) {
      setFaqs(prev => [...prev, data as Faq])
      setNewFaq({ question: '', answer: '' })
    }
    setSavingFaq(false)
  }

  async function deleteFaq(id: string) {
    await supabase.from('faqs').delete().eq('id', id)
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  async function toggleFaq(id: string, current: boolean) {
    await supabase.from('faqs').update({ is_active: !current }).eq('id', id)
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, is_active: !current } : f))
  }

  async function saveFaq(f: Faq) {
    setSaving('f_' + f.id)
    await supabase.from('faqs').update({
      question: f.question,
      answer: f.answer,
    }).eq('id', f.id)
    setSaving(null)
    setEditingFaq(null)
  }

  function updateFaq(id: string, field: keyof Faq, value: any) {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Preview Landing Page
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4 overflow-x-auto">
          {([
            { id: 'sections', label: '📝 Sections' },
            { id: 'testimonials', label: '⭐ Customer Reviews' },
            { id: 'faqs', label: '❓ FAQ' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── SECTIONS TAB ── */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {/* Active Product Selector */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-3">🏆 Featured Product (shown on landing page)</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <p className="text-sm text-blue-700">No products found. Create one first.</p>
              ) : products.map(p => (
                <label key={p.id} className={`flex items-center gap-3 cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  p.is_featured ? 'border-blue-600 bg-white shadow-sm' : 'border-blue-100 bg-white/60 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="featured_product"
                    checked={p.is_featured}
                    onChange={() => setFeaturedProduct(p.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{p.name}</div>
                    <div className={`text-xs ${p.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section List */}
          <div className="space-y-3">
            {localSections.map(section => (
              <div
                key={section.id}
                className={`rounded-xl border-2 bg-white transition-all ${
                  section.is_active ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-60'
                }`}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <GripVertical className="w-5 h-5 text-gray-300 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-800">
                      {SECTION_LABELS[section.section_id] || section.section_id}
                    </span>
                    {section.title && (
                      <span className="ml-2 text-xs text-gray-500 truncate hidden sm:inline">— {section.title}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleSection(section.id, section.is_active)}
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        section.is_active
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {section.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {section.is_active ? 'Visible' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {expandedSection === section.id
                        ? <ChevronUp className="w-4 h-4 text-gray-500" />
                        : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                {/* Section Editor */}
                {expandedSection === section.id && (
                  <SectionConfigEditor
                    section={section}
                    saving={saving === section.id}
                    onSave={(fields) => saveSectionCustom(section.id, fields)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TESTIMONIALS TAB ── */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          {/* Add New Testimonial */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">➕ Add Customer Review</h3>
            
            <div className="flex gap-6 items-start flex-col sm:flex-row">
              {/* Image Picker */}
              <div className="shrink-0 space-y-1.5 w-32">
                <Label className="text-xs text-gray-600">Review Image</Label>
                <div className="relative aspect-square w-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-blue-400 transition-colors">
                  {newTestimonial.image_preview ? (
                    <>
                      <img src={newTestimonial.image_preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => {
                          if (newTestimonial.image_preview) URL.revokeObjectURL(newTestimonial.image_preview);
                          setNewTestimonial(prev => ({ ...prev, image_file: null, image_preview: null }))
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 group-hover:text-blue-500">
                      <ImagePlus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium text-center px-2">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleNewTestimonialImage} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-600">Customer Name *</Label>
                    <Input
                      value={newTestimonial.customer_name}
                      onChange={e => setNewTestimonial(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="e.g. Ahmed Ali"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-600">Rating (1–5)</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewTestimonial(prev => ({ ...prev, rating: star }))}
                          className={`text-2xl transition-colors ${star <= newTestimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Review Comment (Optional)</Label>
                  <textarea
                    value={newTestimonial.comment}
                    onChange={e => setNewTestimonial(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Customer review text..."
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={addTestimonial}
                disabled={savingTestimonial || !newTestimonial.customer_name.trim()}
                className="gap-2"
              >
                {savingTestimonial ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {savingTestimonial ? 'Adding...' : 'Add Review'}
              </Button>
            </div>
          </div>

          {/* Existing Testimonials */}
          <div className="space-y-3">
            {testimonials.length === 0 ? (
              <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-xl">
                No customer reviews yet. Add one above.
              </div>
            ) : (
              testimonials.map(t => (
                <div key={t.id} className={`bg-white rounded-xl border-2 p-4 space-y-3 ${t.is_active ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-60'}`}>
                  {editingTestimonial === t.id ? (
                    <div className="flex gap-4 flex-col sm:flex-row">
                      <div className="shrink-0 space-y-1.5 w-24">
                        <Label className="text-xs text-gray-600">Image</Label>
                        <div className="relative aspect-square w-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group">
                          {editingTestimonialImage.preview || t.image_url ? (
                            <>
                              <img src={editingTestimonialImage.preview || t.image_url!} alt="Preview" className="w-full h-full object-cover" />
                              <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <ImagePlus className="w-5 h-5" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleEditTestimonialImage} />
                              </label>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-blue-500">
                              <ImagePlus className="w-5 h-5 mb-1" />
                              <span className="text-[9px] font-medium text-center px-1">Change</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleEditTestimonialImage} />
                            </label>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-600">Customer Name</Label>
                            <Input
                              value={t.customer_name}
                              onChange={e => updateTestimonial(t.id, 'customer_name', e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-600">Rating</Label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => updateTestimonial(t.id, 'rating', star)}
                                  className={`text-2xl transition-colors ${star <= (t.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-600">Comment</Label>
                          <textarea
                            value={t.comment || ''}
                            onChange={e => updateTestimonial(t.id, 'comment', e.target.value)}
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditingTestimonial(null)
                            setEditingTestimonialImage({file: null, preview: null})
                          }}>Cancel</Button>
                          <Button size="sm" disabled={saving === 't_' + t.id} onClick={() => saveTestimonial(t)} className="gap-2">
                            {saving === 't_' + t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving === 't_' + t.id ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      {t.image_url && (
                        <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={t.image_url} alt={t.customer_name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{t.customer_name}</span>
                          <span className="text-yellow-400 text-sm">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</span>
                        </div>
                        {t.comment && (
                          <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-2">{t.comment}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleTestimonial(t.id, t.is_active)}
                          className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                            t.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {t.is_active ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => setEditingTestimonial(t.id)}
                          className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── FAQS TAB ── */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Add New FAQ */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">➕ Add Common Question</h3>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Question *</Label>
              <Input
                value={newFaq.question}
                onChange={e => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                placeholder="e.g. How long does delivery take?"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Answer *</Label>
              <textarea
                value={newFaq.answer}
                onChange={e => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Detailed answer..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={addFaq}
                disabled={savingFaq || !newFaq.question.trim() || !newFaq.answer.trim()}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {savingFaq ? 'Adding...' : 'Add Question'}
              </Button>
            </div>
          </div>

          {/* Existing FAQs */}
          <div className="space-y-3">
            {faqs.length === 0 ? (
              <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-xl">
                No questions added yet. Add one above.
              </div>
            ) : (
              faqs.map(f => (
                <div key={f.id} className={`bg-white rounded-xl border-2 p-4 space-y-3 ${f.is_active ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-60'}`}>
                  {editingFaq === f.id ? (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-600">Question</Label>
                        <Input
                          value={f.question}
                          onChange={e => updateFaq(f.id, 'question', e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-600">Answer</Label>
                        <textarea
                          value={f.answer}
                          onChange={e => updateFaq(f.id, 'answer', e.target.value)}
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingFaq(null)}>Cancel</Button>
                        <Button size="sm" disabled={saving === 'f_' + f.id} onClick={() => saveFaq(f)} className="gap-2">
                          <Save className="w-4 h-4" />
                          {saving === 'f_' + f.id ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 mb-1">{f.question}</p>
                        <p className="text-sm text-gray-500 whitespace-pre-line line-clamp-2">{f.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleFaq(f.id, f.is_active)}
                          className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                            f.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {f.is_active ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => setEditingFaq(f.id)}
                          className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFaq(f.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Design and SEO tabs moved to Settings page */}
    </div>
  )
}
