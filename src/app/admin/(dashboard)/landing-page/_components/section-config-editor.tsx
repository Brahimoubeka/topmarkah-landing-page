'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Save,
  Sparkles,
  Type,
  Palette,
  Eye,
  ImagePlus,
  Video,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Maximize2,
} from 'lucide-react'
import {
  parseSectionData,
  serializeSectionContent,
  ARABIC_FONTS,
  AVAILABLE_ICONS,
  PRESET_COLORS,
  PRESET_BG_COLORS,
  ASPECT_RATIO_OPTIONS,
  TITLE_FONT_PRESETS,
  SUBTITLE_FONT_PRESETS,
  PARAGRAPH_FONT_PRESETS,
  OFFER_TITLE_SIZE_PRESETS,
  OFFER_PRICE_SIZE_PRESETS,
  OFFER_BODY_SIZE_PRESETS,
  SectionIcon,
  getFontClass,
  getAspectRatioStyle,
  getAspectRatioClass,
  isYouTubeUrl,
  extractYouTubeId,
  ImageAspectRatio,
} from '@/lib/section-config'

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxDim = 1200
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
  const [hideTitle, setHideTitle] = useState(!!parsed.hideTitle)

  // Typography & Flexible Font Sizes
  const [titleFontSize, setTitleFontSize] = useState<number>(() => {
    const n = typeof parsed.titleFontSize === 'number' ? parsed.titleFontSize : parseFloat(String(parsed.titleFontSize))
    return !isNaN(n) && n > 0 ? n : 32
  })
  const [subtitleFontSize, setSubtitleFontSize] = useState<number>(() => {
    const n = typeof parsed.subtitleFontSize === 'number' ? parsed.subtitleFontSize : parseFloat(String(parsed.subtitleFontSize))
    return !isNaN(n) && n > 0 ? n : 16
  })
  const [paragraphFontSize, setParagraphFontSize] = useState<number>(() => {
    const n = typeof parsed.paragraphFontSize === 'number' ? parsed.paragraphFontSize : parseFloat(String(parsed.paragraphFontSize))
    return !isNaN(n) && n > 0 ? n : 17
  })
  const [fontFamily, setFontFamily] = useState(parsed.fontFamily || 'cairo')

  // Colors
  const [titleColor, setTitleColor] = useState(parsed.titleColor || '')
  const [subtitleColor, setSubtitleColor] = useState(parsed.subtitleColor || '')
  const [textColor, setTextColor] = useState(parsed.textColor || '')
  const [backgroundColor, setBackgroundColor] = useState(parsed.backgroundColor || '')

  // Media: Image
  const [imageUrl, setImageUrl] = useState(parsed.imageUrl || '')
  const [imageAspectRatio, setImageAspectRatio] = useState<ImageAspectRatio>(parsed.imageAspectRatio || 'auto')
  const [imagePosition, setImagePosition] = useState<'above' | 'below'>(parsed.imagePosition || 'above')
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>(parsed.imageFit || 'cover')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Media: Video
  const [videoUrl, setVideoUrl] = useState(parsed.videoUrl || '')
  const [videoPosition, setVideoPosition] = useState<'above' | 'below'>(parsed.videoPosition || 'above')
  const [videoAutoplay, setVideoAutoplay] = useState(!!parsed.videoAutoplay)
  const [videoLoop, setVideoLoop] = useState(!!parsed.videoLoop)
  const [videoMuted, setVideoMuted] = useState(!!parsed.videoMuted)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = useState('')

  // Badges & Buttons
  const [ctaButtonText, setCtaButtonText] = useState(parsed.ctaButtonText ?? '')
  const [ctaSecondaryText, setCtaSecondaryText] = useState(parsed.ctaSecondaryText ?? '')
  const [badge1, setBadge1] = useState(parsed.badge1 ?? '')
  const [badge2, setBadge2] = useState(parsed.badge2 ?? '')
  const [badge3, setBadge3] = useState(parsed.badge3 ?? '')

  // Delivery Cards
  const [card1Title, setCard1Title] = useState(parsed.card1Title ?? '')
  const [card1Desc, setCard1Desc] = useState(parsed.card1Desc ?? '')
  const [card2Title, setCard2Title] = useState(parsed.card2Title ?? '')
  const [card2Desc, setCard2Desc] = useState(parsed.card2Desc ?? '')
  const [card3Title, setCard3Title] = useState(parsed.card3Title ?? '')
  const [card3Desc, setCard3Desc] = useState(parsed.card3Desc ?? '')

  // Offers Section & Card Configuration
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[] | undefined>(parsed.selectedOfferIds)
  const [offerBorderColor, setOfferBorderColor] = useState(parsed.offerBorderColor || '')
  const [offerCardBgColor, setOfferCardBgColor] = useState(parsed.offerCardBgColor || '')
  const [offerCardTextColor, setOfferCardTextColor] = useState(parsed.offerCardTextColor || '')
  const [offerPriceColor, setOfferPriceColor] = useState(parsed.offerPriceColor || '')
  const [offerOldPriceColor, setOfferOldPriceColor] = useState(parsed.offerOldPriceColor || '')
  const [offerTitleSize, setOfferTitleSize] = useState<number>(() => {
    const n = typeof parsed.offerTitleSize === 'number' ? parsed.offerTitleSize : parseFloat(String(parsed.offerTitleSize))
    return !isNaN(n) && n > 0 ? n : 19
  })
  const [offerPriceSize, setOfferPriceSize] = useState<number>(() => {
    const n = typeof parsed.offerPriceSize === 'number' ? parsed.offerPriceSize : parseFloat(String(parsed.offerPriceSize))
    return !isNaN(n) && n > 0 ? n : 28
  })
  const [offerBodySize, setOfferBodySize] = useState<number>(() => {
    const n = typeof parsed.offerBodySize === 'number' ? parsed.offerBodySize : parseFloat(String(parsed.offerBodySize))
    return !isNaN(n) && n > 0 ? n : 13
  })
  const [offerColumns, setOfferColumns] = useState<'1' | '2' | '3' | 'auto'>(parsed.offerColumns || 'auto')
  const [showOfferImage, setShowOfferImage] = useState(parsed.showOfferImage !== false)
  const [showOfferDescription, setShowOfferDescription] = useState(parsed.showOfferDescription !== false)
  const [showOfferQuantity, setShowOfferQuantity] = useState(parsed.showOfferQuantity !== false)
  const [showOfferDelivery, setShowOfferDelivery] = useState(parsed.showOfferDelivery !== false)
  const [showOfferGifts, setShowOfferGifts] = useState(parsed.showOfferGifts !== false)
  const [showOfferFeatures, setShowOfferFeatures] = useState(parsed.showOfferFeatures !== false)
  const [showOfferButton, setShowOfferButton] = useState(parsed.showOfferButton !== false)

  const supabase = createClient()

  useEffect(() => {
    const updated = parseSectionData(section)
    setTitle(updated.title)
    setSubtitle(updated.subtitle)
    setBody(updated.body)
    setIcon(updated.icon)
    setHideTitle(!!updated.hideTitle)

    const tNum = typeof updated.titleFontSize === 'number' ? updated.titleFontSize : parseFloat(String(updated.titleFontSize))
    setTitleFontSize(!isNaN(tNum) && tNum > 0 ? tNum : 32)

    const subNum = typeof updated.subtitleFontSize === 'number' ? updated.subtitleFontSize : parseFloat(String(updated.subtitleFontSize))
    setSubtitleFontSize(!isNaN(subNum) && subNum > 0 ? subNum : 16)

    const pNum = typeof updated.paragraphFontSize === 'number' ? updated.paragraphFontSize : parseFloat(String(updated.paragraphFontSize))
    setParagraphFontSize(!isNaN(pNum) && pNum > 0 ? pNum : 17)

    setFontFamily(updated.fontFamily || 'cairo')
    setTitleColor(updated.titleColor || '')
    setSubtitleColor(updated.subtitleColor || '')
    setTextColor(updated.textColor || '')
    setBackgroundColor(updated.backgroundColor || '')

    setImageUrl(updated.imageUrl || '')
    setImageAspectRatio(updated.imageAspectRatio || 'auto')
    setImagePosition(updated.imagePosition || 'above')
    setImageFit(updated.imageFit || 'cover')

    setVideoUrl(updated.videoUrl || '')
    setVideoPosition(updated.videoPosition || 'above')
    setVideoAutoplay(!!updated.videoAutoplay)
    setVideoLoop(!!updated.videoLoop)
    setVideoMuted(!!updated.videoMuted)

    setCtaButtonText(updated.ctaButtonText ?? '')
    setCtaSecondaryText(updated.ctaSecondaryText ?? '')
    setBadge1(updated.badge1 ?? '')
    setBadge2(updated.badge2 ?? '')
    setBadge3(updated.badge3 ?? '')

    setCard1Title(updated.card1Title ?? '')
    setCard1Desc(updated.card1Desc ?? '')
    setCard2Title(updated.card2Title ?? '')
    setCard2Desc(updated.card2Desc ?? '')
    setCard3Title(updated.card3Title ?? '')
    setCard3Desc(updated.card3Desc ?? '')

    setSelectedOfferIds(updated.selectedOfferIds)
    setOfferBorderColor(updated.offerBorderColor || '')
    setOfferCardBgColor(updated.offerCardBgColor || '')
    setOfferCardTextColor(updated.offerCardTextColor || '')
    setOfferPriceColor(updated.offerPriceColor || '')
    setOfferOldPriceColor(updated.offerOldPriceColor || '')

    const otNum = typeof updated.offerTitleSize === 'number' ? updated.offerTitleSize : parseFloat(String(updated.offerTitleSize))
    setOfferTitleSize(!isNaN(otNum) && otNum > 0 ? otNum : 19)

    const opNum = typeof updated.offerPriceSize === 'number' ? updated.offerPriceSize : parseFloat(String(updated.offerPriceSize))
    setOfferPriceSize(!isNaN(opNum) && opNum > 0 ? opNum : 28)

    const obNum = typeof updated.offerBodySize === 'number' ? updated.offerBodySize : parseFloat(String(updated.offerBodySize))
    setOfferBodySize(!isNaN(obNum) && obNum > 0 ? obNum : 13)

    setOfferColumns(updated.offerColumns || 'auto')
    setShowOfferImage(updated.showOfferImage !== false)
    setShowOfferDescription(updated.showOfferDescription !== false)
    setShowOfferQuantity(updated.showOfferQuantity !== false)
    setShowOfferDelivery(updated.showOfferDelivery !== false)
    setShowOfferGifts(updated.showOfferGifts !== false)
    setShowOfferFeatures(updated.showOfferFeatures !== false)
    setShowOfferButton(updated.showOfferButton !== false)
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
      alert('فشل في رفع الصورة. يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 80 * 1024 * 1024) {
      alert('حجم ملف الفيديو كبير جداً (أكثر من 80 ميغابايت). يرجى استخدام فيديو مضغوط بحجم أقل لتسريع التصفح.')
      return
    }

    setUploadingVideo(true)
    setVideoUploadProgress('جاري الرفع وتحسين الرابط...')
    try {
      const fileExt = file.name.split('.').pop() || 'mp4'
      const path = `videos/${section.id || Date.now()}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('landing')
        .upload(path, file, { contentType: file.type || 'video/mp4', upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('landing').getPublicUrl(path)
      setVideoUrl(urlData.publicUrl)
    } catch (err) {
      console.error('Video upload failed', err)
      alert('فشل في رفع الفيديو. يرجى المحاولة مرة أخرى أو إدخال رابط يوتيوب مباشر.')
    } finally {
      setUploadingVideo(false)
      setVideoUploadProgress('')
    }
  }

  const handleSave = () => {
    const serializedContent = serializeSectionContent({
      body,
      icon,
      titleColor,
      subtitleColor,
      textColor,
      backgroundColor,
      titleFontSize,
      subtitleFontSize,
      paragraphFontSize,
      fontFamily,
      hideTitle,
      imageUrl,
      imageAspectRatio,
      imagePosition,
      imageFit,
      videoUrl,
      videoType: isYouTubeUrl(videoUrl) ? 'youtube' : 'upload',
      videoPosition,
      videoAutoplay,
      videoLoop,
      videoMuted,
      ctaButtonText: ctaButtonText || undefined,
      ctaSecondaryText: ctaSecondaryText !== '' ? ctaSecondaryText : undefined,
      badge1: badge1 !== '' ? badge1 : undefined,
      badge2: badge2 !== '' ? badge2 : undefined,
      badge3: badge3 !== '' ? badge3 : undefined,
      card1Title: card1Title || undefined,
      card1Desc: card1Desc || undefined,
      card2Title: card2Title || undefined,
      card2Desc: card2Desc || undefined,
      card3Title: card3Title || undefined,
      card3Desc: card3Desc || undefined,
      selectedOfferIds,
      offerBorderColor: offerBorderColor || undefined,
      offerCardBgColor: offerCardBgColor || undefined,
      offerCardTextColor: offerCardTextColor || undefined,
      offerPriceColor: offerPriceColor || undefined,
      offerOldPriceColor: offerOldPriceColor || undefined,
      offerTitleSize,
      offerPriceSize,
      offerBodySize,
      offerColumns,
      showOfferImage,
      showOfferDescription,
      showOfferQuantity,
      showOfferDelivery,
      showOfferGifts,
      showOfferFeatures,
      showOfferButton,
    })

    onSave({
      title,
      subtitle,
      content: serializedContent,
      image_url: imageUrl || '',
    })
  }

  const selectedFontClass = getFontClass(fontFamily)
  const isHero = section.section_id === 'hero'
  const isDelivery = section.section_id === 'delivery'
  const isOffers = section.section_id === 'offers' || section.section_id.startsWith('offer')

  return (
    <div className="border-t border-gray-100 px-4 py-5 space-y-6 bg-gray-50/70 rounded-b-xl text-right" dir="rtl">
      {/* ── 1. Title & Subtitle (Completely Optional) ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <Type className="w-4 h-4 text-blue-600" />
            <span>نصوص العناوين (اختيارية بالكامل - Title & Subtitle)</span>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={hideTitle}
              onChange={e => setHideTitle(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded"
            />
            <span className={hideTitle ? 'text-red-600 font-bold' : ''}>إخفاء عنوان القسم بالكامل</span>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              عنوان القسم (Section Title - اختياري)
            </Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="اتركه فارغاً إذا كنت لا ترغب بإظهار عنوان"
              className="h-10 text-sm bg-white"
              dir="auto"
              disabled={hideTitle}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              العنوان الفرعي (Subtitle - اختياري)
            </Label>
            <Input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="اتركه فارغاً إذا كنت لا ترغب به"
              className="h-10 text-sm bg-white"
              dir="auto"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Flexible Font Sizes & Typography ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>التحكم المرن بأحجام الخطوط ونوع الخط (Flexible Font Sizing)</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Font Family */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700">نوع الخط العربي (Font Family)</Label>
            <select
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {ARABIC_FONTS.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Flexible Title Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">حجم خط العنوان (Title Size)</Label>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                <span>{titleFontSize}px</span>
              </div>
            </div>
            <input
              type="range"
              min="16"
              max="72"
              step="1"
              value={titleFontSize}
              onChange={e => setTitleFontSize(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1">
              {TITLE_FONT_PRESETS.map(p => (
                <button
                  key={p.size}
                  type="button"
                  onClick={() => setTitleFontSize(p.size)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                    titleFontSize === p.size
                      ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flexible Subtitle Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">حجم العنوان الفرعي (Subtitle Size)</Label>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <span>{subtitleFontSize}px</span>
              </div>
            </div>
            <input
              type="range"
              min="11"
              max="36"
              step="1"
              value={subtitleFontSize}
              onChange={e => setSubtitleFontSize(Number(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1">
              {SUBTITLE_FONT_PRESETS.map(p => (
                <button
                  key={p.size}
                  type="button"
                  onClick={() => setSubtitleFontSize(p.size)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                    subtitleFontSize === p.size
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flexible Paragraph Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">حجم خط الفقرة والنص (Paragraph Size)</Label>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                <span>{paragraphFontSize}px</span>
              </div>
            </div>
            <input
              type="range"
              min="12"
              max="36"
              step="1"
              value={paragraphFontSize}
              onChange={e => setParagraphFontSize(Number(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1">
              {PARAGRAPH_FONT_PRESETS.map(p => (
                <button
                  key={p.size}
                  type="button"
                  onClick={() => setParagraphFontSize(p.size)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                    paragraphFontSize === p.size
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Colors Control: Background, Text, Subtitle, Title ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
          <Palette className="w-4 h-4 text-emerald-600" />
          <span>تخصيص ألوان القسم (العنوان، العنوان الفرعي، النصوص، الخلفية)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Title Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">لون العنوان (Title Color)</Label>
              {titleColor && (
                <button
                  type="button"
                  onClick={() => setTitleColor('')}
                  className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>تلقائي</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={titleColor || '#0f172a'}
                onChange={e => setTitleColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 shrink-0"
              />
              <Input
                value={titleColor}
                onChange={e => setTitleColor(e.target.value)}
                placeholder="#0f172a (افتراضي)"
                className="h-9 text-xs font-mono uppercase bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
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

          {/* Subtitle Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">لون العنوان الفرعي (Subtitle Color)</Label>
              {subtitleColor && (
                <button
                  type="button"
                  onClick={() => setSubtitleColor('')}
                  className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>تلقائي</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={subtitleColor || '#4b5563'}
                onChange={e => setSubtitleColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 shrink-0"
              />
              <Input
                value={subtitleColor}
                onChange={e => setSubtitleColor(e.target.value)}
                placeholder="#4b5563 (افتراضي)"
                className="h-9 text-xs font-mono uppercase bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSubtitleColor(c.hex)}
                  className={`w-5 h-5 rounded-full border border-black/10 transition-transform ${
                    subtitleColor === c.hex ? 'scale-125 ring-2 ring-primary' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Text/Body Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">لون النصوص والفقرة (Text Color)</Label>
              {textColor && (
                <button
                  type="button"
                  onClick={() => setTextColor('')}
                  className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>تلقائي</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor || '#374151'}
                onChange={e => setTextColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 shrink-0"
              />
              <Input
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                placeholder="#374151 (افتراضي)"
                className="h-9 text-xs font-mono uppercase bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setTextColor(c.hex)}
                  className={`w-5 h-5 rounded-full border border-black/10 transition-transform ${
                    textColor === c.hex ? 'scale-125 ring-2 ring-primary' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">خلفية القسم (Section Background)</Label>
              {backgroundColor && (
                <button
                  type="button"
                  onClick={() => setBackgroundColor('')}
                  className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>تلقائي / شفاف</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor || '#ffffff'}
                onChange={e => setBackgroundColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 shrink-0"
              />
              <Input
                value={backgroundColor}
                onChange={e => setBackgroundColor(e.target.value)}
                placeholder="افتراضي (شفاف/تناوبي)"
                className="h-9 text-xs font-mono uppercase bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {PRESET_BG_COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setBackgroundColor(c.hex)}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                    backgroundColor === c.hex
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-500'
                      : 'border-gray-200 hover:bg-gray-100 text-gray-600 bg-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Icon Picker */}
        <div className="space-y-2 pt-3 border-t border-gray-100">
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

      {/* ── 4. Image Dimensions (1:1, 9:16, 16:9, 3:4, 4:5, auto) & Upload ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <ImagePlus className="w-4 h-4 text-emerald-600" />
            <span>صورة القسم والتحكم بأبعادها ونسبتها (Image & Aspect Ratio)</span>
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

        {/* Aspect Ratio Selector (1:1, 9:16, 16:9, 3:4, 4:5, auto) */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-700">
            اختر أبعاد الصورة (Image Dimensions / Aspect Ratio):
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {ASPECT_RATIO_OPTIONS.map(opt => {
              const isSelected = imageAspectRatio === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setImageAspectRatio(opt.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{opt.id}</span>
                  <span className="text-[10px] text-gray-500">{opt.label.split(' ')[1] || opt.label}</span>
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-gray-400">
            يدعم النظام كامل الأبعاد: المربعة (1:1)، الريلز/الستوري (9:16)، عريض (16:9)، عمودي بورتريه (3:4)، إنستغرام (4:5) أو الأبعاد الطبيعية للصورة بدون قص.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr] items-start pt-2">
          {/* Image Upload Box */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">رفع أو تغيير الصورة</Label>
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-emerald-500 transition-colors">
              {uploadingImage ? (
                <div className="flex flex-col items-center justify-center text-emerald-600 p-2 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mb-1" />
                  <span className="text-[10px] font-medium">جاري الضغط والرفع...</span>
                </div>
              ) : imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Section Media"
                    className={`w-full h-full ${imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                  />
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] font-medium">
                    <ImagePlus className="w-5 h-5 mb-1" />
                    تغيير الصورة
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 group-hover:text-emerald-600 transition-colors p-2 text-center">
                  <ImagePlus className="w-7 h-7 mb-1 text-gray-400 group-hover:text-emerald-500" />
                  <span className="text-[11px] font-semibold">إضافة صورة</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Position & Fit controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-600 font-semibold">موضع الصورة بالنسبة للنص</Label>
              <div className="grid grid-cols-2 gap-2 max-w-sm">
                <button
                  type="button"
                  onClick={() => setImagePosition('above')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${
                    imagePosition === 'above'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الصورة فوق النص</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImagePosition('below')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${
                    imagePosition === 'below'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الصورة تحت النص</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-600 font-semibold">طريقة عرض الصورة (Fit)</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageFit('cover')}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    imageFit === 'cover'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  ملء الإطار (Cover)
                </button>
                <button
                  type="button"
                  onClick={() => setImageFit('contain')}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    imageFit === 'contain'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  كامل الصورة دون قص (Contain)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Video Upload & Original Dimensions ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <Video className="w-4 h-4 text-rose-600" />
            <span>فيديو القسم بأبعاده الأصلية (Video with Original Dimensions)</span>
          </div>
          {videoUrl && (
            <button
              type="button"
              onClick={() => setVideoUrl('')}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>إزالة الفيديو</span>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600">
          يمكنك رفع فيديو (MP4, WebM) أو وضع رابط يوتيوب. سيظهر الفيديو في صفحة الهبوط بأبعاده الأصلية التلقائية ومحسّن للتحميل السريع على الإنترنت الضعيف.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Upload Video File */}
          <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-200/60 space-y-2">
            <Label className="text-xs font-semibold text-rose-900">1. رفع ملف فيديو من جهازك (MP4 / WebM)</Label>
            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-rose-300 rounded-lg cursor-pointer hover:bg-rose-50 text-rose-700 font-semibold text-xs transition-colors shadow-xs">
              {uploadingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  <span>{videoUploadProgress || 'جاري الرفع...'}</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>اختر ملف فيديو للرفع</span>
                </>
              )}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                disabled={uploadingVideo}
                onChange={handleVideoUpload}
              />
            </label>
          </div>

          {/* Or Paste Video URL */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <Label className="text-xs font-semibold text-gray-700">2. أو أدخل رابط فيديو (يوتيوب أو رابط مباشر)</Label>
            <Input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="مثال: https://www.youtube.com/watch?v=... أو رابط MP4"
              className="h-9 text-xs bg-white text-left font-mono"
              dir="ltr"
            />
          </div>
        </div>

        {/* Video Options */}
        {videoUrl && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={videoAutoplay}
                onChange={e => setVideoAutoplay(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>تشغيل تلقائي (Autoplay)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={videoMuted}
                onChange={e => setVideoMuted(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>صامت بدون صوت افتراضياً (Muted)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={videoLoop}
                onChange={e => setVideoLoop(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>تكرار تشغيل مستمر (Loop)</span>
            </label>
          </div>
        )}
      </div>

      {/* ── 6. Editable Badges & Buttons (for Hero or General sections) ── */}
      {(isHero || isDelivery) && (
        <div className="bg-white p-4 rounded-xl border border-gray-200/90 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>تعديل الشارات والأزرار الافتراضية (Default Badges & Buttons)</span>
          </div>
          <p className="text-xs text-gray-500">
            كل الشارات والأزرار قابلة للتعديل أو المسح لتناسب رغبتك.
          </p>

          {isHero && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">نص زر الطلب الرئيسي</Label>
                  <Input
                    value={ctaButtonText}
                    onChange={e => setCtaButtonText(e.target.value)}
                    placeholder="اطلب الآن (افتراضي)"
                    className="h-9 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">نص زر التفاصيل الثانوي</Label>
                  <Input
                    value={ctaSecondaryText}
                    onChange={e => setCtaSecondaryText(e.target.value)}
                    placeholder="مزيد من التفاصيل (اتركه فارغاً لإخفائه)"
                    className="h-9 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">شارة 1 (مع أيقونة شاحنة)</Label>
                  <Input
                    value={badge1}
                    onChange={e => setBadge1(e.target.value)}
                    placeholder="توصيل سريع"
                    className="h-9 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">شارة 2 (مع درع الأمان)</Label>
                  <Input
                    value={badge2}
                    onChange={e => setBadge2(e.target.value)}
                    placeholder="جودة مضمونة"
                    className="h-9 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">شارة 3 (مع علامة صح)</Label>
                  <Input
                    value={badge3}
                    onChange={e => setBadge3(e.target.value)}
                    placeholder="دفع عند الاستلام"
                    className="h-9 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {isDelivery && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
                  <Label className="text-xs font-semibold text-gray-700">بطاقة التوصيل 1</Label>
                  <Input
                    value={card1Title}
                    onChange={e => setCard1Title(e.target.value)}
                    placeholder="توصيل لجميع الولايات"
                    className="h-8 text-xs bg-white"
                  />
                  <textarea
                    value={card1Desc}
                    onChange={e => setCard1Desc(e.target.value)}
                    placeholder="وصف بطاقة التوصيل..."
                    className="w-full text-xs p-2 rounded border border-gray-200 h-16 bg-white"
                  />
                </div>

                <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
                  <Label className="text-xs font-semibold text-gray-700">بطاقة التوصيل 2</Label>
                  <Input
                    value={card2Title}
                    onChange={e => setCard2Title(e.target.value)}
                    placeholder="توصيل سريع"
                    className="h-8 text-xs bg-white"
                  />
                  <textarea
                    value={card2Desc}
                    onChange={e => setCard2Desc(e.target.value)}
                    placeholder="وصف بطاقة التوصيل..."
                    className="w-full text-xs p-2 rounded border border-gray-200 h-16 bg-white"
                  />
                </div>

                <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
                  <Label className="text-xs font-semibold text-gray-700">بطاقة التوصيل 3</Label>
                  <Input
                    value={card3Title}
                    onChange={e => setCard3Title(e.target.value)}
                    placeholder="الدفع عند الاستلام"
                    className="h-8 text-xs bg-white"
                  />
                  <textarea
                    value={card3Desc}
                    onChange={e => setCard3Desc(e.target.value)}
                    placeholder="وصف بطاقة التوصيل..."
                    className="w-full text-xs p-2 rounded border border-gray-200 h-16 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 7. Offers Section & Card Configuration (if section is 'offers') ── */}
      {isOffers && (
        <div className="bg-white p-4 rounded-xl border border-blue-200/80 space-y-4 bg-blue-50/20">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <span className="text-base">🏷️</span>
              <span>تخصيص بطاقات العروض وأقسامها وألوانها (Offers Cards & Sections Setup)</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Filter: All vs Specific Offers */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-700">تحديد العروض المعروضة في هذا القسم:</Label>
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
                  <Label className="text-xs text-gray-600">اختر العرض (أو العروض) المراد إظهارها:</Label>
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

            {/* Layout / Columns per Row */}
            <div className="pt-3 border-t border-blue-100 space-y-2">
              <Label className="text-xs font-semibold text-gray-700">
                عدد بطاقات العروض في كل صف (Columns per Row)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'auto', label: 'تلقائي متجاوب (Auto)', desc: 'يتكيف مع عدد العروض والشاشة' },
                  { id: '1', label: 'عرض واحد (1 Column)', desc: 'بطاقة عريضة مميزة في الوسط' },
                  { id: '2', label: 'عرضين (2 Columns)', desc: 'صف ثنائي متوازن' },
                  { id: '3', label: '3 عروض (3 Columns)', desc: 'شبكة ثلاثية كلاسيكية' },
                ].map(col => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setOfferColumns(col.id as any)}
                    className={`p-2.5 rounded-xl border text-xs text-start transition-all ${
                      offerColumns === col.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>{col.label}</div>
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">{col.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sections / Elements visible on each Offer Card */}
            <div className="pt-3 border-t border-blue-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-gray-800">
                  العناصر والأقسام الظاهرة داخل كل بطاقة عرض (Card Sections & Elements)
                </Label>
                <span className="text-[10px] text-gray-500">اختر الأقسام التي ترغب بإظهارها أو إخفائها في كل بطاقة</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  { id: 'image', label: 'صورة العرض (1:1 Square)', checked: showOfferImage, set: setShowOfferImage },
                  { id: 'desc', label: 'الوصف المختصر (Description)', checked: showOfferDescription, set: setShowOfferDescription },
                  { id: 'qty', label: 'عدد القطع والكمية (Quantity)', checked: showOfferQuantity, set: setShowOfferQuantity },
                  { id: 'deliv', label: 'شارة التوصيل المجاني (Delivery)', checked: showOfferDelivery, set: setShowOfferDelivery },
                  { id: 'gifts', label: 'الهدايا والمكافآت (Gifts)', checked: showOfferGifts, set: setShowOfferGifts },
                  { id: 'feats', label: 'قائمة المميزات (Features)', checked: showOfferFeatures, set: setShowOfferFeatures },
                  { id: 'btn', label: 'زر طلب العرض (Order Button)', checked: showOfferButton, set: setShowOfferButton },
                ].map(item => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      item.checked ? 'bg-blue-50/60 border-blue-200 text-blue-950 font-semibold' : 'bg-gray-50 border-gray-200 text-gray-500 line-through'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={e => item.set(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Offer Card Font Sizes */}
            <div className="pt-3 border-t border-blue-100 space-y-3">
              <Label className="text-xs font-semibold text-gray-800">
                التحكم بأحجام خطوط بطاقة العرض (Offer Card Font Sizing)
              </Label>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Offer Title Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">حجم عنوان العرض:</span>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{offerTitleSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="36"
                    step="1"
                    value={offerTitleSize}
                    onChange={e => setOfferTitleSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex flex-wrap gap-1">
                    {OFFER_TITLE_SIZE_PRESETS.map(p => (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => setOfferTitleSize(p.size)}
                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                          offerTitleSize === p.size ? 'bg-blue-600 text-white font-bold' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offer Price Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">حجم خط السعر:</span>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{offerPriceSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="50"
                    step="1"
                    value={offerPriceSize}
                    onChange={e => setOfferPriceSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex flex-wrap gap-1">
                    {OFFER_PRICE_SIZE_PRESETS.map(p => (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => setOfferPriceSize(p.size)}
                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                          offerPriceSize === p.size ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offer Body / Features Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">حجم نصوص ومميزات العرض:</span>
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{offerBodySize}px</span>
                  </div>
                  <input
                    type="range"
                    min="11"
                    max="22"
                    step="1"
                    value={offerBodySize}
                    onChange={e => setOfferBodySize(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
                  />
                  <div className="flex flex-wrap gap-1">
                    {OFFER_BODY_SIZE_PRESETS.map(p => (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => setOfferBodySize(p.size)}
                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                          offerBodySize === p.size ? 'bg-gray-800 text-white font-bold' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Card Colors */}
            <div className="pt-3 border-t border-blue-100 space-y-3">
              <Label className="text-xs font-semibold text-gray-800">
                التحكم بألوان بطاقة العرض (Offer Card Colors)
              </Label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. Border / Accent Line Color */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">إطار / خط البطاقة (محيط متساوي):</span>
                    {offerBorderColor && (
                      <button type="button" onClick={() => setOfferBorderColor('')} className="text-[10px] text-gray-400 hover:text-red-500">تلقائي</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={offerBorderColor || '#2563eb'} onChange={e => setOfferBorderColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border p-0.5 shrink-0" />
                    <Input value={offerBorderColor} onChange={e => setOfferBorderColor(e.target.value)} placeholder="#2563eb" className="h-8 text-xs font-mono uppercase bg-white" />
                  </div>
                </div>

                {/* 2. Card Background Color */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">خلفية بطاقة العرض:</span>
                    {offerCardBgColor && (
                      <button type="button" onClick={() => setOfferCardBgColor('')} className="text-[10px] text-gray-400 hover:text-red-500">تلقائي</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={offerCardBgColor || '#ffffff'} onChange={e => setOfferCardBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border p-0.5 shrink-0" />
                    <Input value={offerCardBgColor} onChange={e => setOfferCardBgColor(e.target.value)} placeholder="#ffffff" className="h-8 text-xs font-mono uppercase bg-white" />
                  </div>
                </div>

                {/* 3. Card Text Color */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">لون نصوص البطاقة:</span>
                    {offerCardTextColor && (
                      <button type="button" onClick={() => setOfferCardTextColor('')} className="text-[10px] text-gray-400 hover:text-red-500">تلقائي</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={offerCardTextColor || '#374151'} onChange={e => setOfferCardTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border p-0.5 shrink-0" />
                    <Input value={offerCardTextColor} onChange={e => setOfferCardTextColor(e.target.value)} placeholder="#374151" className="h-8 text-xs font-mono uppercase bg-white" />
                  </div>
                </div>

                {/* 4. Price Color */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">لون السعر الحالي:</span>
                    {offerPriceColor && (
                      <button type="button" onClick={() => setOfferPriceColor('')} className="text-[10px] text-gray-400 hover:text-red-500">تلقائي</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={offerPriceColor || '#2563eb'} onChange={e => setOfferPriceColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border p-0.5 shrink-0" />
                    <Input value={offerPriceColor} onChange={e => setOfferPriceColor(e.target.value)} placeholder="#2563eb" className="h-8 text-xs font-mono uppercase bg-white" />
                  </div>
                </div>

                {/* 5. Old/Promotion Price Color (Red by default) */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">لون السعر قبل التخفيض (أحمر):</span>
                    {offerOldPriceColor && (
                      <button type="button" onClick={() => setOfferOldPriceColor('')} className="text-[10px] text-gray-400 hover:text-red-500">تلقائي (أحمر)</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={offerOldPriceColor || '#ef4444'} onChange={e => setOfferOldPriceColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border p-0.5 shrink-0" />
                    <Input value={offerOldPriceColor} onChange={e => setOfferOldPriceColor(e.target.value)} placeholder="#ef4444" className="h-8 text-xs font-mono uppercase bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. Content / Marketing Body (Optional) ── */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-gray-700">
          محتوى الفقرة أو الشرح التسويقي (اختياري - Body Content)
        </Label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="أدخل النص التسويقي أو الشرح... (اتركه فارغاً إذا كنت لا ترغب بنص)"
          className="flex min-h-[110px] w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
          dir="auto"
        />
      </div>

      {/* ── 9. Live Interactive Preview Box ── */}
      <div
        className="p-5 rounded-2xl border border-dashed border-gray-300 transition-colors shadow-xs overflow-hidden"
        style={backgroundColor ? { backgroundColor } : { backgroundColor: '#ffffff' }}
      >
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3">
          <Eye className="w-3.5 h-3.5" />
          <span>معاينة حية فورية ومطابقة لصفحة الهبوط (Live Preview)</span>
        </div>

        <div className="text-center py-2 max-w-xl mx-auto space-y-4">
          {/* Title */}
          {!hideTitle && title && (
            <h3
              className={`font-black flex items-center justify-center gap-2 ${selectedFontClass}`}
              style={{
                color: titleColor || '#0f172a',
                fontSize: `${titleFontSize}px`,
                lineHeight: `${Math.round(titleFontSize * 1.2)}px`,
              }}
            >
              {icon && icon !== 'none' && (
                <span
                  className="inline-flex items-center justify-center p-1.5 rounded-xl bg-primary/10 text-primary shrink-0"
                  style={titleColor ? { color: titleColor, backgroundColor: `${titleColor}15` } : {}}
                >
                  <SectionIcon name={icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              )}
              <span>{title}</span>
            </h3>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p
              className="whitespace-pre-line leading-relaxed"
              style={{
                color: subtitleColor || '#64748b',
                fontSize: `${subtitleFontSize}px`,
                lineHeight: `${Math.round(subtitleFontSize * 1.5)}px`,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Top Media */}
          {imageUrl && imagePosition === 'above' && (
            <div
              className={`w-full overflow-hidden rounded-xl bg-gray-100 ${
                imageAspectRatio === 'auto' ? 'aspect-auto' : getAspectRatioClass(imageAspectRatio)
              }`}
              style={
                imageAspectRatio !== 'auto'
                  ? { aspectRatio: getAspectRatioStyle(imageAspectRatio) }
                  : undefined
              }
            >
              <img
                src={imageUrl}
                alt="Preview"
                className={`w-full ${
                  imageAspectRatio === 'auto'
                    ? 'h-auto max-h-72 object-contain'
                    : imageFit === 'contain'
                    ? 'h-full object-contain'
                    : 'h-full object-cover'
                }`}
              />
            </div>
          )}

          {/* Video Preview in Original Dimensions */}
          {videoUrl && (
            <div className="w-full rounded-xl overflow-hidden bg-black shadow-xs">
              {isYouTubeUrl(videoUrl) ? (
                <div className="aspect-video w-full flex items-center justify-center bg-gray-900 text-white text-xs">
                  <span>▶️ فيديو يوتيوب: {videoUrl}</span>
                </div>
              ) : (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-72 object-contain block mx-auto"
                />
              )}
            </div>
          )}

          {/* Body */}
          {body && (
            <div
              className={`p-4 rounded-xl text-start leading-relaxed whitespace-pre-line ${selectedFontClass} ${
                backgroundColor ? 'bg-black/5' : 'bg-gray-50'
              }`}
              style={{
                color: textColor || '#374151',
                fontSize: `${paragraphFontSize}px`,
                lineHeight: `${Math.round(paragraphFontSize * 1.55)}px`,
              }}
            >
              {body}
            </div>
          )}

          {/* Bottom Media */}
          {imageUrl && imagePosition === 'below' && (
            <div
              className={`w-full overflow-hidden rounded-xl bg-gray-100 ${
                imageAspectRatio === 'auto' ? 'aspect-auto' : getAspectRatioClass(imageAspectRatio)
              }`}
              style={
                imageAspectRatio !== 'auto'
                  ? { aspectRatio: getAspectRatioStyle(imageAspectRatio) }
                  : undefined
              }
            >
              <img
                src={imageUrl}
                alt="Preview"
                className={`w-full ${
                  imageAspectRatio === 'auto'
                    ? 'h-auto max-h-72 object-contain'
                    : imageFit === 'contain'
                    ? 'h-full object-contain'
                    : 'h-full object-cover'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 10. Action Buttons ── */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          size="sm"
          disabled={saving || uploadingImage || uploadingVideo}
          onClick={handleSave}
          className="gap-2 px-6 py-2.5 font-bold shadow-md shadow-primary/20 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'جاري الحفظ...' : 'حفظ تعديلات القسم (Save Section)'}</span>
        </Button>
      </div>
    </div>
  )
}
