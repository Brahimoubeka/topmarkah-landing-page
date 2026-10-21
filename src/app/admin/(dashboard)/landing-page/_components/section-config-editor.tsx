'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save, Sparkles, Type, Palette, Eye, ImagePlus, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import {
  parseSectionData,
  serializeSectionContent,
  ARABIC_FONTS,
  FONT_SIZES,
  AVAILABLE_ICONS,
  PRESET_COLORS,
  SectionIcon,
  getFontClass,
} from '@/lib/section-config'

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxDim = 800
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
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
        0.85
      )
    }
    img.onerror = reject
    img.src = url
  })
}

export function SectionConfigEditor({
  section,
  saving,
  onSave,
  offers = [],
}: {
  section: {
    id: string
    section_id: string
    title: string | null
    subtitle: string | null
    content: string | null
    image_url?: string | null
    is_active: boolean
  }
  saving: boolean
  onSave: (fields: { title: string; subtitle: string; content: string; image_url?: string }) => void
  offers?: any[]
}) {
  const parsed = parseSectionData(section)

  const [title, setTitle] = useState(parsed.title)
  const [subtitle, setSubtitle] = useState(parsed.subtitle)
  const [body, setBody] = useState(parsed.body)
  const [icon, setIcon] = useState(parsed.icon)
  const [titleColor, setTitleColor] = useState(parsed.titleColor)
  const [fontSize, setFontSize] = useState(parsed.fontSize)
  const [fontFamily, setFontFamily] = useState(parsed.fontFamily)
  const [imageUrl, setImageUrl] = useState(parsed.imageUrl || '')
  const [imagePosition, setImagePosition] = useState<'above' | 'below'>(parsed.imagePosition || 'above')
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[] | undefined>(parsed.selectedOfferIds)
  const [uploadingImage, setUploadingImage] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const updated = parseSectionData(section)
    setTitle(updated.title)
    setSubtitle(updated.subtitle)
    setBody(updated.body)
    setIcon(updated.icon)
    setTitleColor(updated.titleColor)
    setFontSize(updated.fontSize)
    setFontFamily(updated.fontFamily)
    setImageUrl(updated.imageUrl || '')
    setImagePosition(updated.imagePosition || 'above')
    setSelectedOfferIds(updated.selectedOfferIds)
  }, [section.id, section.content, section.title, section.subtitle, section.image_url])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const compressedBlob = await compressImage(file)
      const path = `sections/${section.id || Date.now()}_${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('landing')
        .upload(path, compressedBlob, { contentType: 'image/jpeg', upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('landing').getPublicUrl(path)
      setImageUrl(urlData.publicUrl)
    } catch (err) {
      console.error('Image upload failed', err)
      alert('فشل في رفع الصورة. يرجى المحاولة مرة أخرى.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = () => {
    const serializedContent = serializeSectionContent({
      body,
      icon,
      titleColor,
      fontSize,
      fontFamily,
      imageUrl,
      imagePosition,
      selectedOfferIds,
    })

    onSave({
      title,
      subtitle,
      content: serializedContent,
      image_url: imageUrl || '',
    })
  }

  const selectedFontClass = getFontClass(fontFamily)

  return (
    <div className="border-t border-gray-100 px-4 py-5 space-y-5 bg-gray-50/60 rounded-b-xl">
      {/* ── Title & Subtitle ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">عنوان القسم (Section Title)</Label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="مثال: لماذا تختار منتجنا؟"
            className="h-10 text-sm bg-white"
            dir="auto"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">العنوان الفرعي (Subtitle)</Label>
          <Input
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            placeholder="مثال: جودة مضمونة وتوصيل سريع"
            className="h-10 text-sm bg-white"
            dir="auto"
          />
        </div>
      </div>

      {/* ── Offers Selection (if section is 'offers' or starts with 'offer') ── */}
      {(section.section_id === 'offers' || section.section_id.startsWith('offer')) && (
        <div className="bg-white p-4 rounded-xl border border-blue-200/80 space-y-3 bg-blue-50/20">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <span className="text-base">🏷️</span>
              <span>تحديد العروض المعروضة في هذا القسم (Section Offers Filter)</span>
            </div>
            <span className="text-[11px] text-blue-600 font-medium hidden sm:inline">
              يتيح لك وضع هذا القسم وعرضه بشكل منفصل بين الأقسام
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedOfferIds(undefined)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-start transition-all ${
                  !selectedOfferIds || selectedOfferIds.length === 0
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500 font-bold'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>✨ عرض جميع العروض</div>
                <div className="text-[10px] text-gray-500 font-normal mt-0.5">كل العروض النشطة تظهر معاً في هذا القسم</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (offers.length > 0 && (!selectedOfferIds || selectedOfferIds.length === 0)) {
                    setSelectedOfferIds([offers[0].id])
                  }
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-start transition-all ${
                  selectedOfferIds && selectedOfferIds.length > 0
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500 font-bold'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>🎯 عرض عرض محدد فقط</div>
                <div className="text-[10px] text-gray-500 font-normal mt-0.5">اختر عرضاً واحداً ليكون قسماً مستقلاً</div>
              </button>
            </div>

            {selectedOfferIds && selectedOfferIds.length > 0 && (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <Label className="text-xs text-gray-600">اختر العرض (أو العروض) المراد إظهارها في هذا القسم:</Label>
                {offers.length === 0 ? (
                  <p className="text-xs text-gray-500">لا توجد عروض مضافة بعد في لوحة التحكم.</p>
                ) : (
                  <div className="space-y-1.5">
                    {offers.map((off: any) => {
                      const isChecked = selectedOfferIds.includes(off.id)
                      return (
                        <label
                          key={off.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOfferIds([...(selectedOfferIds || []), off.id])
                                } else {
                                  const next = (selectedOfferIds || []).filter(id => id !== off.id)
                                  setSelectedOfferIds(next.length === 0 ? undefined : next)
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-xs">{off.name}</span>
                          </div>
                          <span className="text-xs font-bold font-mono text-blue-700">{off.price} DA</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Typography & Styling Controls ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
          <Type className="w-4 h-4 text-blue-600" />
          <span>تخصيص الخط، الحجم، اللون والأيقونة (Typography & Appearance)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Font Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">نوع الخط العربي (Font Type)</Label>
            <select
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {ARABIC_FONTS.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">حجم عنوان القسم (Font Size)</Label>
            <select
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {FONT_SIZES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title Color */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">لون العنوان (Title Color)</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={titleColor || '#0f172a'}
                onChange={e => setTitleColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5 shrink-0"
              />
              <Input
                value={titleColor}
                onChange={e => setTitleColor(e.target.value)}
                placeholder="#0f172a"
                className="h-9 text-xs font-mono uppercase bg-white"
              />
            </div>
            {/* Quick Palette */}
            <div className="flex gap-1.5 mt-1.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setTitleColor(c.hex)}
                  className={`w-5 h-5 rounded-full border border-black/10 transition-transform ${
                    titleColor === c.hex ? 'scale-125 ring-2 ring-primary' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Icon Picker */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-600">أيقونة العنوان (Section Icon)</Label>
            {icon && icon !== 'none' && (
              <button
                type="button"
                onClick={() => setIcon('none')}
                className="text-[11px] text-red-500 hover:underline"
              >
                إلغاء الأيقونة
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {AVAILABLE_ICONS.map(item => {
              const isSelected = icon === item.id || (!icon && item.id === 'none')
              const IconComp = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIcon(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm font-bold ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {IconComp ? <IconComp className="w-5 h-5 mb-1" /> : <span className="text-sm mb-1">🚫</span>}
                  <span className="text-[10px] truncate max-w-full">{item.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Optional Small 1:1 Image & Alignment ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <ImagePlus className="w-4 h-4 text-emerald-600" />
            <span>صورة مصغرة للقسم (اختياري - 1:1 Small Square Image)</span>
          </div>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>إزالة الصورة</span>
            </button>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr] items-start">
          {/* 1:1 Square Image Picker */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">الصورة المربعة (1:1 Aspect Ratio)</Label>
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-emerald-500 transition-colors">
              {uploadingImage ? (
                <div className="flex flex-col items-center justify-center text-emerald-600">
                  <Loader2 className="w-6 h-6 animate-spin mb-1" />
                  <span className="text-[10px] font-medium">جاري الرفع...</span>
                </div>
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} alt="Section Thumbnail" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] font-medium">
                    <ImagePlus className="w-5 h-5 mb-1" />
                    تغيير
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 group-hover:text-emerald-600 transition-colors p-2 text-center">
                  <ImagePlus className="w-6 h-6 mb-1 text-gray-400 group-hover:text-emerald-500" />
                  <span className="text-[10px] font-semibold">إضافة صورة 1:1</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Position Selector */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600 font-semibold">
              موضع الصورة بالنسبة للفقرة (Image Position)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setImagePosition('above')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-start transition-all ${
                  imagePosition === 'above'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-500 font-bold'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ArrowUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">الصورة فوق الفقرة (أعلى)</div>
                  <div className="text-[10px] text-gray-500 font-normal">الصورة 1:1 أولاً ثم النص تحتها</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setImagePosition('below')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-start transition-all ${
                  imagePosition === 'below'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-500 font-bold'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ArrowDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">الصورة تحت الفقرة (أسفل)</div>
                  <div className="text-[10px] text-gray-500 font-normal">النص أولاً ثم الصورة 1:1 تحته</div>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-gray-400">
              تظهر الصورة بنسبة 1:1 مربعة وكبيرة مثل صورة المنتج تماماً وبدون أي هوامش جانبية على الهواتف.
            </p>
          </div>
        </div>
      </div>

      {/* ── Content / Paragraph Body ── */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          محتوى الفقرة / الشرح التسويقي (Paragraph / Content Body)
        </Label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="أدخل النص التسويقي أو مواصفات العرض أو الشرح التفصيلي للقسم..."
          className="flex min-h-[120px] w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          dir="auto"
        />
        <p className="text-[11px] text-gray-500">
          يمكنك كتابة أسطر متعددة أو نقاط توضيحية. ستظهر كما هي في صفحة الهبوط.
        </p>
      </div>

      {/* ── Live Preview Box ── */}
      <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3">
          <Eye className="w-3.5 h-3.5" />
          <span>معاينة حية لشكل العنوان والصورة والفقرة (Live Preview)</span>
        </div>

        <div className="text-center py-2">
          <h3
            className={`font-black flex items-center justify-center gap-2 ${fontSize} ${selectedFontClass}`}
            style={titleColor ? { color: titleColor } : { color: '#0f172a' }}
          >
            {icon && icon !== 'none' && (
              <span
                className="inline-flex items-center justify-center p-1.5 rounded-xl bg-primary/10 text-primary shrink-0"
                style={titleColor ? { color: titleColor, backgroundColor: `${titleColor}15` } : {}}
              >
                <SectionIcon name={icon} className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
            )}
            <span>{title || 'عنوان القسم'}</span>
          </h3>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 whitespace-pre-line leading-relaxed">
              {subtitle}
            </p>
          )}

          {(body || imageUrl) && (
            <div className="mt-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-xl mx-auto shadow-sm overflow-hidden flex flex-col">
              {imageUrl && imagePosition === 'above' && (
                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                  <img src={imageUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                </div>
              )}
              {body && (
                <div className={`p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed text-start ${selectedFontClass}`}>
                  {body}
                </div>
              )}
              {imageUrl && imagePosition === 'below' && (
                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                  <img src={imageUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          size="sm"
          disabled={saving || uploadingImage}
          onClick={handleSave}
          className="gap-2 px-5 py-2 font-bold shadow-md shadow-primary/20"
        >
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات (Save Section)'}
        </Button>
      </div>
    </div>
  )
}
