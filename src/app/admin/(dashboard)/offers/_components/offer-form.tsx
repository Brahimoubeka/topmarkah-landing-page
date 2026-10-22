'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import {
  ImagePlus,
  Trash2,
  Loader2,
  Palette,
  Type,
  Sparkles,
  Truck,
  Plus,
  Sliders,
  CheckCircle2,
  ListPlus,
  Eye,
  RotateCcw,
} from 'lucide-react'
import {
  parseOfferData,
  serializeOfferData,
  OfferFeatureItem,
  OfferFeatureIcon,
  OFFER_FEATURE_ICONS,
  OFFER_FEATURES_SIZE_PRESETS,
} from '@/lib/offer-helper'
import { ARABIC_FONTS, PRESET_COLORS, getFontClass } from '@/lib/section-config'

const MAX_OFFER_IMAGES = 5
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

const offerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  old_price: z.coerce.number().optional().nullable(),
  discount: z.coerce.number().min(0).max(100).optional().nullable(),
  quantity_included: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  gifts: z.string().optional(),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
})

type OfferValues = z.infer<typeof offerSchema>

type PendingImage = {
  file: File
  previewUrl: string
  compressed?: Blob
}

export function OfferForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  const initialParsed = parseOfferData(initialData)

  const [existingImages, setExistingImages] = useState<string[]>(initialParsed.images)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])

  // Custom Offer Styling
  const [fontFamily, setFontFamily] = useState<string>(initialParsed.fontFamily || 'default')
  const [titleColor, setTitleColor] = useState<string>(initialParsed.titleColor || '')
  const [buttonColor, setButtonColor] = useState<string>(initialParsed.buttonColor || '')
  const [badgeColor, setBadgeColor] = useState<string>(initialParsed.badgeColor || '')
  const [borderColor, setBorderColor] = useState<string>(initialParsed.borderColor || '')
  const [badgeText, setBadgeText] = useState<string>(initialParsed.badgeText || '')
  const [buttonText, setButtonText] = useState<string>(initialParsed.buttonText || '')
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(initialParsed.isFreeDelivery || false)

  // Features / Includes List & Sizing
  const [featuresList, setFeaturesList] = useState<OfferFeatureItem[]>(() => {
    if (initialParsed.featuresList && initialParsed.featuresList.length > 0) {
      return initialParsed.featuresList
    }
    if (initialData?.full_description) {
      const lines = String(initialData.full_description).split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length > 0) {
        return lines.map((line, i) => ({
          id: String(i + 1),
          text: line.replace(/^[•\-\*✓✔\d\.\)]\s*/, ''),
          icon: 'check-circle',
        }))
      }
    }
    return [
      { id: '1', text: '', icon: 'check-circle' }
    ]
  })
  const [featuresSize, setFeaturesSize] = useState<number>(initialParsed.featuresSize || 14)
  const [featuresIconColor, setFeaturesIconColor] = useState<string>(initialParsed.featuresIconColor || '#10b981')

  function handleAddFeature() {
    setFeaturesList(prev => [
      ...prev,
      { id: Date.now().toString(), text: '', icon: 'check-circle' }
    ])
  }

  function handleUpdateFeature(id: string, updates: Partial<OfferFeatureItem>) {
    setFeaturesList(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  function handleRemoveFeature(id: string) {
    setFeaturesList(prev => {
      const filtered = prev.filter(item => item.id !== id)
      return filtered.length === 0 ? [{ id: Date.now().toString(), text: '', icon: 'check-circle' }] : filtered
    })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalImagesCount = existingImages.length + pendingImages.length

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    e.target.value = ''

    const availableSlots = MAX_OFFER_IMAGES - totalImagesCount
    const filesToAdd = files.slice(0, availableSlots)

    const newPending: PendingImage[] = []
    for (const file of filesToAdd) {
      const previewUrl = URL.createObjectURL(file)
      newPending.push({ file, previewUrl })
    }

    setPendingImages(prev => [...prev, ...newPending])

    // Compress in background
    for (let i = 0; i < filesToAdd.length; i++) {
      const file = filesToAdd[i]
      try {
        const compressedBlob = await compressImage(file)
        setPendingImages(prev => {
          const updated = [...prev]
          const target = updated.find(p => p.file === file)
          if (target) target.compressed = compressedBlob
          return updated
        })
      } catch (err) {
        console.error('Failed to compress image:', err)
      }
    }
  }

  function removeExistingImage(index: number) {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  function removePendingImage(index: number) {
    setPendingImages(prev => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const form = useForm<any>({
    resolver: zodResolver(offerSchema) as any,
    defaultValues: initialData || {
      name: '',
      price: 0,
      old_price: 0,
      discount: 0,
      quantity_included: 1,
      short_description: '',
      full_description: '',
      gifts: '',
      display_order: 0,
      is_active: true,
    },
  })

  async function onSubmit(data: any) {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const uploadedUrls: string[] = []

      // Upload new pending images
      if (pendingImages.length > 0) {
        for (let i = 0; i < pendingImages.length; i++) {
          const item = pendingImages[i]
          setUploadProgress(`جاري رفع الصورة ${i + 1} من ${pendingImages.length}...`)
          const blob = item.compressed || item.file
          const path = `offers/${Date.now()}_${i}_offer.jpg`

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(path, blob, { contentType: 'image/jpeg' })

          if (uploadError) throw new Error('فشل رفع الصورة: ' + uploadError.message)

          const { data: urlData } = supabase.storage.from('products').getPublicUrl(path)
          uploadedUrls.push(urlData.publicUrl)
        }
      }

      const allImages = [...existingImages, ...uploadedUrls].slice(0, MAX_OFFER_IMAGES)

      // Serialize metadata (images + styling freedom + features list & size)
      const serializedImageUrl = serializeOfferData({
        images: allImages,
        titleColor,
        buttonColor,
        badgeColor,
        borderColor,
        fontFamily,
        badgeText,
        buttonText,
        isFreeDelivery,
        featuresList: featuresList.filter(f => f.text.trim().length > 0),
        featuresSize,
        featuresIconColor,
      })

      const submitData = {
        ...data,
        full_description: data.full_description || featuresList.map(f => f.text).filter(Boolean).join('\n'),
        image_url: serializedImageUrl,
      }

      if (initialData?.id) {
        // Update
        const { error: dbError } = await supabase
          .from('offers')
          .update(submitData)
          .eq('id', initialData.id)

        if (dbError) throw new Error(dbError.message)
      } else {
        // Insert
        const { error: dbError } = await supabase
          .from('offers')
          .insert(submitData)

        if (dbError) throw new Error(dbError.message)
      }

      router.push('/admin/offers')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء حفظ العرض.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* ── IMAGES SECTION (UP TO 5 IMAGES, 4:3 PROPORTIONS) ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>صور العرض (Offer Images)</span>
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {totalImagesCount} / {MAX_OFFER_IMAGES} (حد أقصى 5 صور)
              </span>
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              بأبعاد مربعة 1:1 (Aspect Ratio 1:1 Square) مع إمكانية التنقل بين الصور تلقائياً أو بالسحب.
            </p>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleImagePick}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Existing Images */}
          {existingImages.map((src, index) => (
            <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border bg-gray-50 group shadow-sm">
              <img src={src} alt={`Offer image ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                #{index + 1}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pending Images */}
          {pendingImages.map((item, index) => (
            <div key={`pending-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-400 bg-blue-50/40 group shadow-sm">
              <img src={item.previewUrl} alt="Pending" className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                جديدة #{existingImages.length + index + 1}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removePendingImage(index)}
                  className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow"
                  title="إلغاء الصورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Image Button */}
          {totalImagesCount < MAX_OFFER_IMAGES && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-6 h-6 mb-1 text-gray-400" />
              <span className="text-xs font-semibold">إضافة صورة</span>
              <span className="text-[10px] text-gray-400">متبقي {MAX_OFFER_IMAGES - totalImagesCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── STYLING FREEDOM: COLORS & ARABIC FONTS ── */}
      <div className="bg-gradient-to-br from-blue-50/40 to-indigo-50/30 rounded-2xl border border-blue-100 p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-blue-200/60 pb-3">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-base">تخصيص ألوان وخطوط العرض (Offer Custom Styling)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Arabic Font */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-blue-500" />
              نوع الخط العربي
            </Label>
            <select
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {ARABIC_FONTS.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title Color */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">لون عنوان العرض</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={titleColor || '#0f172a'}
                onChange={e => setTitleColor(e.target.value)}
                className="w-8 h-8 rounded border p-0.5 cursor-pointer bg-white"
              />
              <Input
                value={titleColor}
                onChange={e => setTitleColor(e.target.value)}
                placeholder="#0f172a (افتراضي)"
                className="h-9 text-xs font-mono bg-white"
              />
            </div>
          </div>

          {/* Button Color */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">لون زر الطلب والسعر</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={buttonColor || '#2563eb'}
                onChange={e => setButtonColor(e.target.value)}
                className="w-8 h-8 rounded border p-0.5 cursor-pointer bg-white"
              />
              <Input
                value={buttonColor}
                onChange={e => setButtonColor(e.target.value)}
                placeholder="#2563eb (الأساسي)"
                className="h-9 text-xs font-mono bg-white"
              />
            </div>
          </div>

          {/* Badge Color */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">لون شارة التخفيض / العرض</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={badgeColor || '#dc2626'}
                onChange={e => setBadgeColor(e.target.value)}
                className="w-8 h-8 rounded border p-0.5 cursor-pointer bg-white"
              />
              <Input
                value={badgeColor}
                onChange={e => setBadgeColor(e.target.value)}
                placeholder="#dc2626 (أحمر)"
                className="h-9 text-xs font-mono bg-white"
              />
            </div>
          </div>

          {/* Card Border Line Color */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">الخط الملون / إطار البطاقة</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={borderColor || '#2563eb'}
                onChange={e => setBorderColor(e.target.value)}
                className="w-8 h-8 rounded border p-0.5 cursor-pointer bg-white"
              />
              <Input
                value={borderColor}
                onChange={e => setBorderColor(e.target.value)}
                placeholder="#2563eb (إطار البطاقة)"
                className="h-9 text-xs font-mono bg-white"
              />
            </div>
          </div>
        </div>

        {/* Custom text for Button & Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-blue-100">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">نص مخصص لزر الطلب [اختياري]</Label>
            <Input
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
              placeholder="اطلب العرض الآن (افتراضي)"
              className="h-9 text-sm bg-white"
              dir="auto"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">نص مخصص للشارة (مثل: الأكثر طلباً / هدية مجانية) [اختياري]</Label>
            <Input
              value={badgeText}
              onChange={e => setBadgeText(e.target.value)}
              placeholder="مثال: الأكثر طلباً 🔥 (أو نسبة التخفيض)"
              className="h-9 text-sm bg-white"
              dir="auto"
            />
          </div>
        </div>
      </div>

      {/* ── OFFER DETAILS ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-white rounded-2xl border border-gray-200 p-5">
        <div className="space-y-2">
          <Label htmlFor="name">اسم العرض * (مثال: "عرض عبوتين + زيت هدية")</Label>
          <Input id="name" {...form.register('name')} />
          {form.formState.errors.name?.message && <p className="text-sm text-red-500">{form.formState.errors.name.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity_included">الكمية المشمولة بالعرض *</Label>
          <Input id="quantity_included" type="number" min="1" {...form.register('quantity_included', { valueAsNumber: true })} />
          {form.formState.errors.quantity_included?.message && <p className="text-sm text-red-500">{form.formState.errors.quantity_included.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">سعر العرض (دج) *</Label>
          <Input id="price" type="number" step="0.01" {...form.register('price', { valueAsNumber: true })} />
          {form.formState.errors.price?.message && <p className="text-sm text-red-500">{form.formState.errors.price.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">السعر القديم قبل الخصم (دج) [اختياري]</Label>
          <Input id="old_price" type="number" step="0.01" {...form.register('old_price', { valueAsNumber: true })} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discount">نسبة التخفيض (%) [اختياري]</Label>
          <Input id="discount" type="number" min="0" max="100" {...form.register('discount', { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">ترتيب الظهور (0 يظهر أولاً، ثم 1، ثم 2...)</Label>
          <Input id="display_order" type="number" min="0" {...form.register('display_order', { valueAsNumber: true })} />
          {form.formState.errors.display_order?.message && <p className="text-sm text-red-500">{form.formState.errors.display_order.message as string}</p>}
        </div>
      </div>

      <div className="space-y-4 bg-white rounded-2xl border border-gray-200 p-5">
        <div className="space-y-2">
          <Label htmlFor="short_description">وصف مختصر للعرض</Label>
          <Input id="short_description" {...form.register('short_description')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gifts">الهدايا المشمولة (مثال: "فرشاة مجانية + شحن مخفض")</Label>
          <Input id="gifts" {...form.register('gifts')} />
        </div>

        {/* ── OFFER INCLUDES & FEATURES LIST BUILDER ── */}
        <div className="rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-blue-50/30 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  قائمة محتويات ومميزات العرض (ماذا يتضمن العرض؟ - Offer Includes)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  أضف عناصر واضحة بجانبها أيقونة صح أو هدية أو حماية ليرى الزائر فوراً كل ما يحتويه العرض.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
              className="rounded-xl border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-500 gap-1.5 shrink-0 self-start sm:self-center bg-white"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عنصر / ميزة +</span>
            </Button>
          </div>

          {/* ── SIZE & ICON COLOR CONTROLS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
            {/* Features Font Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  <span>حجم خط قائمة المحتويات (Features Font Size)</span>
                </Label>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                  {featuresSize}px
                </span>
              </div>
              <input
                type="range"
                min="11"
                max="24"
                step="1"
                value={featuresSize}
                onChange={e => setFeaturesSize(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex flex-wrap gap-1">
                {OFFER_FEATURES_SIZE_PRESETS.map(p => (
                  <button
                    key={p.size}
                    type="button"
                    onClick={() => setFeaturesSize(p.size)}
                    className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                      featuresSize === p.size
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                        : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Features Icon Color Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-600" />
                  <span>لون الأيقونة (صح / هدية / ميزة)</span>
                </Label>
                {featuresIconColor !== '#10b981' && (
                  <button
                    type="button"
                    onClick={() => setFeaturesIconColor('#10b981')}
                    className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>تلقائي (أخضر زمردي)</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={featuresIconColor || '#10b981'}
                  onChange={e => setFeaturesIconColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border p-0.5 cursor-pointer bg-white shrink-0"
                />
                <Input
                  value={featuresIconColor}
                  onChange={e => setFeaturesIconColor(e.target.value)}
                  placeholder="#10b981 (افتراضي)"
                  className="h-9 text-xs font-mono uppercase bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {[
                  { hex: '#10b981', name: 'أخضر زمردي' },
                  { hex: '#2563eb', name: 'أزرق' },
                  { hex: '#8b5cf6', name: 'بنفسجي' },
                  { hex: '#f59e0b', name: 'ذهبي' },
                  { hex: '#ef4444', name: 'أحمر' },
                  { hex: '#0f172a', name: 'داكن' },
                ].map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFeaturesIconColor(c.hex)}
                    className={`w-5 h-5 rounded-full border border-black/10 transition-transform ${
                      featuresIconColor === c.hex ? 'scale-125 ring-2 ring-primary' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── ITEMS LIST ROWS ── */}
          <div className="space-y-2.5">
            {featuresList.map((feature, index) => (
              <div
                key={feature.id}
                className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-2xs"
              >
                <div className="w-6 text-center text-xs font-bold text-gray-400 shrink-0 select-none">
                  #{index + 1}
                </div>

                {/* Icon Selector */}
                <div className="shrink-0 flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                  <OfferFeatureIcon
                    icon={feature.icon || 'check-circle'}
                    className="w-4 h-4"
                    style={{ color: featuresIconColor || '#10b981' }}
                  />
                  <select
                    value={feature.icon || 'check-circle'}
                    onChange={e => handleUpdateFeature(feature.id, { icon: e.target.value })}
                    className="text-xs bg-transparent border-0 font-medium text-gray-700 cursor-pointer focus:outline-none"
                    dir="rtl"
                  >
                    {OFFER_FEATURE_ICONS.map(ic => (
                      <option key={ic.id} value={ic.id}>
                        {ic.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item Text Input */}
                <Input
                  value={feature.text}
                  onChange={e => handleUpdateFeature(feature.id, { text: e.target.value })}
                  placeholder="مثال: عبوتين أصليتين 100 مل / فرشاة تنظيف مجانية / ضمان استرجاع 30 يوم"
                  className="h-9 text-sm bg-white flex-1"
                  dir="auto"
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="حذف هذا العنصر"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddFeature}
              className="w-full py-2.5 rounded-xl border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-emerald-700 hover:border-emerald-400 text-xs font-semibold gap-1.5 bg-white"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة سطر / عنصر جديد لقائمة العرض</span>
            </Button>
          </div>

          {/* ── LIVE PREVIEW OF THIS OFFER'S LIST ── */}
          <div className="p-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة حية لشكل القائمة كما ستظهر للزائر على بطاقة العرض:</span>
            </div>

            <ul
              className="space-y-1.5 pt-1"
              style={{
                fontSize: `${featuresSize}px`,
                lineHeight: `${Math.round(featuresSize * 1.45)}px`,
              }}
            >
              {featuresList.filter(f => f.text.trim().length > 0).length === 0 ? (
                <li className="text-gray-400 italic text-xs">
                  (ستظهر هنا قائمة المحتويات بمجرد كتابة العناصر أعلاه مع الأيقونات المختارة)
                </li>
              ) : (
                featuresList
                  .filter(f => f.text.trim().length > 0)
                  .map((f, i) => (
                    <li key={i} className="flex items-start text-gray-800 font-medium">
                      <span className="ml-2 shrink-0 mt-0.5">
                        <OfferFeatureIcon
                          icon={f.icon || 'check-circle'}
                          className="w-4 h-4"
                          style={{ color: featuresIconColor || '#10b981' }}
                        />
                      </span>
                      <span>{f.text}</span>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_description">ملاحظات أو شرح إضافي (اختياري)</Label>
          <textarea
            id="full_description"
            {...form.register('full_description')}
            rows={3}
            placeholder="يمكنك كتابة أي ملاحظات إضافية هنا..."
            className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Free Delivery Option */}
        <div className="flex items-center justify-between border-2 border-emerald-100 rounded-xl p-4 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="is_free_delivery" 
              checked={isFreeDelivery} 
              onChange={e => setIsFreeDelivery(e.target.checked)} 
              className="h-5 w-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer" 
            />
            <div>
              <Label htmlFor="is_free_delivery" className="cursor-pointer font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>توصيل مجاني لهذا العرض (Free Delivery)</span>
              </Label>
              <p className="text-xs text-emerald-700 mt-0.5">
                عند تفعيل هذا الخيار، سيظهر للزبون توصيل مجاني (0 دج) ولن يتم احتساب تكلفة الشحن عند اختيار هذا العرض.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border rounded-xl p-3.5 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" {...form.register('is_active')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
            <Label htmlFor="is_active" className="cursor-pointer font-medium text-sm text-gray-800">
              تفعيل العرض (ظهوره على صفحة الهبوط)
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/offers')}
          className="rounded-xl px-5"
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[150px] gap-2 rounded-xl">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadProgress || 'جاري الحفظ...'}
            </>
          ) : (
            initialData ? 'تحديث العرض' : 'إنشاء العرض'
          )}
        </Button>
      </div>
    </form>
  )
}
