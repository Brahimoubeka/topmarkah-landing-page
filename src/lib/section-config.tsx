import React from 'react'
import {
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  Gift,
  Heart,
  Zap,
  Truck,
  ThumbsUp,
  BadgePercent,
  Package,
  Clock,
  HelpCircle,
  LucideIcon,
  Play,
  Video,
} from 'lucide-react'

export type ImageAspectRatio = 'auto' | '1:1' | '9:16' | '16:9' | '4:3' | '3:4' | '4:5'

export interface SectionStyleConfig {
  title: string
  subtitle: string
  body: string
  icon: string
  titleColor: string
  subtitleColor?: string
  textColor: string
  backgroundColor: string
  fontSize: string // backward compatible tailwind class
  titleFontSize?: string | number // in px (e.g. "36" or "36px")
  subtitleFontSize?: string | number // in px (e.g. "18" or "18px")
  paragraphFontSize?: string | number // in px (e.g. "17" or "17px")
  fontFamily: string
  hideTitle?: boolean

  // Media: Image
  imageUrl?: string
  imageAspectRatio?: ImageAspectRatio
  imagePosition?: 'above' | 'below'
  imageFit?: 'cover' | 'contain'

  // Media: Video
  videoUrl?: string
  videoType?: 'upload' | 'youtube' | 'direct'
  videoPosition?: 'above' | 'below'
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean

  // Badges & Buttons customization
  ctaButtonText?: string
  ctaSecondaryText?: string
  badge1?: string
  badge2?: string
  badge3?: string

  // Cards / Delivery Cards customization
  card1Title?: string
  card1Desc?: string
  card2Title?: string
  card2Desc?: string
  card3Title?: string
  card3Desc?: string

  // Offers section filter & card styling
  selectedOfferIds?: string[]
  offerBorderColor?: string
  offerCardBgColor?: string
  offerCardTextColor?: string
  offerPriceColor?: string
  offerOldPriceColor?: string
  offerTitleSize?: string | number
  offerPriceSize?: string | number
  offerBodySize?: string | number
  offerColumns?: '1' | '2' | '3' | 'auto'

  // Sections/elements displayed on each offer card
  showOfferImage?: boolean
  showOfferDescription?: boolean
  showOfferQuantity?: boolean
  showOfferDelivery?: boolean
  showOfferGifts?: boolean
  showOfferFeatures?: boolean
  showOfferButton?: boolean
}

export const ARABIC_FONTS = [
  { id: 'cairo', name: 'Cairo (كايرو - عصري وقوي)', className: 'font-cairo' },
  { id: 'tajawal', name: 'Tajawal (تجوال - أنيق وسلس)', className: 'font-tajawal' },
  { id: 'almarai', name: 'Almarai (المراعي - ناعم وواضح)', className: 'font-almarai' },
  { id: 'readex', name: 'Readex Pro (ريديكس - حديث)', className: 'font-readex' },
  { id: 'amiri', name: 'Amiri (أميري - كلاسيكي)', className: 'font-amiri' },
  { id: 'default', name: 'الافتراضي (System Sans)', className: '' },
]

export const ASPECT_RATIO_OPTIONS: { id: ImageAspectRatio; label: string; ratio: string; description: string }[] = [
  { id: 'auto', label: 'أبعاد الصورة الأصلية (Auto)', ratio: 'auto', description: 'تظهر الصورة كما رُفعت بدون أي قص أو إجبار (1:1, 9:16, 16:9...)' },
  { id: '1:1', label: '1:1 مربع', ratio: '1 / 1', description: 'مناسب لصور المنتجات المربعة' },
  { id: '9:16', label: '9:16 ستوري / ريلز', ratio: '9 / 16', description: 'عمودي شاشة كاملة (مثل تيك توك وستوري)' },
  { id: '16:9', label: '16:9 عرضي شاشة', ratio: '16 / 9', description: 'عرضي كلاسيكي عريض للفيديو والصور الأفقية' },
  { id: '4:3', label: '4:3 قياسي', ratio: '4 / 3', description: 'أبعاد الصور الفوتوغرافية القياسية' },
  { id: '3:4', label: '3:4 عمودي قياسي', ratio: '3 / 4', description: 'عمودي كلاسيكي متوازن' },
  { id: '4:5', label: '4:5 إنستغرام', ratio: '4 / 5', description: 'عمودي بنسبة منشورات الإنستغرام المثالية' },
]

export const TITLE_FONT_PRESETS = [
  { size: 20, label: 'صغير (20px)' },
  { size: 26, label: 'متوسط (26px)' },
  { size: 32, label: 'قياسي (32px)' },
  { size: 40, label: 'كبير (40px)' },
  { size: 48, label: 'كبير جداً (48px)' },
  { size: 58, label: 'ضخم (58px)' },
]

export const SUBTITLE_FONT_PRESETS = [
  { size: 13, label: 'صغير (13px)' },
  { size: 15, label: 'ناعم (15px)' },
  { size: 17, label: 'قياسي (17px)' },
  { size: 20, label: 'متوسط (20px)' },
  { size: 24, label: 'كبير (24px)' },
]

export const PARAGRAPH_FONT_PRESETS = [
  { size: 13, label: 'ناعم (13px)' },
  { size: 15, label: 'صغير (15px)' },
  { size: 17, label: 'قياسي (17px)' },
  { size: 20, label: 'متوسط (20px)' },
  { size: 24, label: 'كبير (24px)' },
]

export const OFFER_TITLE_SIZE_PRESETS = [
  { size: 16, label: 'ناعم (16px)' },
  { size: 19, label: 'قياسي (19px)' },
  { size: 22, label: 'متوسط (22px)' },
  { size: 26, label: 'كبير (26px)' },
]

export const OFFER_PRICE_SIZE_PRESETS = [
  { size: 22, label: 'صغير (22px)' },
  { size: 28, label: 'قياسي (28px)' },
  { size: 34, label: 'كبير (34px)' },
  { size: 40, label: 'ضخم (40px)' },
]

export const OFFER_BODY_SIZE_PRESETS = [
  { size: 12, label: 'ناعم (12px)' },
  { size: 13, label: 'صغير (13px)' },
  { size: 15, label: 'قياسي (15px)' },
  { size: 17, label: 'متوسط (17px)' },
]

export const FONT_SIZES = [
  { id: 'text-xl sm:text-2xl', label: 'صغير (Compact)' },
  { id: 'text-2xl sm:text-3xl', label: 'متوسط (Medium)' },
  { id: 'text-2xl sm:text-4xl', label: 'كبير (Large - قياسي)' },
  { id: 'text-3xl sm:text-5xl', label: 'ضخم (Extra Large)' },
]

export const AVAILABLE_ICONS: { id: string; label: string; icon: LucideIcon | null }[] = [
  { id: 'none', label: 'بدون أيقونة', icon: null },
  { id: 'Star', label: 'نجمة ⭐', icon: Star },
  { id: 'Sparkles', label: 'بريق ✨', icon: Sparkles },
  { id: 'ShieldCheck', label: 'درع أمان 🛡️', icon: ShieldCheck },
  { id: 'CheckCircle2', label: 'علامة صح ✅', icon: CheckCircle2 },
  { id: 'Flame', label: 'لهب / الأكثر طلباً 🔥', icon: Flame },
  { id: 'Award', label: 'وسام التميز 🏆', icon: Award },
  { id: 'Gift', label: 'هدية 🎁', icon: Gift },
  { id: 'Heart', label: 'قلب / إعجاب ❤️', icon: Heart },
  { id: 'Zap', label: 'سرعة / قوة ⚡', icon: Zap },
  { id: 'Truck', label: 'شاحنة توصيل 🚚', icon: Truck },
  { id: 'ThumbsUp', label: 'إعجاب 👍', icon: ThumbsUp },
  { id: 'BadgePercent', label: 'تخفيض 🏷️', icon: BadgePercent },
  { id: 'Package', label: 'صندوق منتج 📦', icon: Package },
  { id: 'Clock', label: 'وقت / سرعة ⏱️', icon: Clock },
  { id: 'HelpCircle', label: 'سؤال ❓', icon: HelpCircle },
]

export const ICON_MAP: Record<string, LucideIcon> = {
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  Gift,
  Heart,
  Zap,
  Truck,
  ThumbsUp,
  BadgePercent,
  Package,
  Clock,
  HelpCircle,
}

export const PRESET_COLORS = [
  { name: 'Dark Slate', hex: '#0f172a' },
  { name: 'Charcoal', hex: '#1e293b' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Ruby Red', hex: '#dc2626' },
  { name: 'Warm Amber', hex: '#d97706' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'White', hex: '#ffffff' },
]

export const PRESET_BG_COLORS = [
  { name: 'شفاف / افتراضي', hex: '' },
  { name: 'أبيض ناصع', hex: '#ffffff' },
  { name: 'رمادي خفيف', hex: '#f8fafc' },
  { name: 'رمادي ناعم', hex: '#f1f5f9' },
  { name: 'أصفر دافئ', hex: '#fefce8' },
  { name: 'أزرق فاتح', hex: '#eff6ff' },
  { name: 'أخضر هادئ', hex: '#f0fdf4' },
  { name: 'كحلي داكن', hex: '#0f172a' },
  { name: 'رمادي داكن', hex: '#1e293b' },
]

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?/\s]{11})/)
  return m ? m[1] : null
}

export function isYouTubeUrl(url?: string): boolean {
  if (!url) return false
  return /youtube\.com|youtu\.be/.test(url)
}

export function getAspectRatioStyle(ratio?: string): string | undefined {
  switch (ratio) {
    case '1:1':
      return '1 / 1'
    case '9:16':
      return '9 / 16'
    case '16:9':
      return '16 / 9'
    case '4:3':
      return '4 / 3'
    case '3:4':
      return '3 / 4'
    case '4:5':
      return '4 / 5'
    case 'auto':
      return 'auto'
    default:
      return undefined
  }
}

export function getAspectRatioClass(ratio?: string): string {
  switch (ratio) {
    case '1:1':
      return 'aspect-square'
    case '9:16':
      return 'aspect-[9/16]'
    case '16:9':
      return 'aspect-[16/9]'
    case '4:3':
      return 'aspect-[4/3]'
    case '3:4':
      return 'aspect-[3/4]'
    case '4:5':
      return 'aspect-[4/5]'
    case 'auto':
      return 'aspect-auto'
    default:
      return 'aspect-auto'
  }
}

export function parseSectionData(section: any): SectionStyleConfig {
  let body = section?.content || ''
  let icon = ''
  let titleColor = ''
  let subtitleColor = ''
  let textColor = ''
  let backgroundColor = ''
  let fontSize = 'text-2xl sm:text-4xl'
  let titleFontSize: string | number = 32
  let subtitleFontSize: string | number = 16
  let paragraphFontSize: string | number = 17
  let fontFamily = 'cairo'
  let hideTitle = false
  let imageUrl = section?.image_url || ''
  let imageAspectRatio: ImageAspectRatio = 'auto'
  let imagePosition: 'above' | 'below' = 'above'
  let imageFit: 'cover' | 'contain' = 'cover'
  let videoUrl = ''
  let videoType: 'upload' | 'youtube' | 'direct' = 'upload'
  let videoPosition: 'above' | 'below' = 'above'
  let videoAutoplay = false
  let videoLoop = false
  let videoMuted = false
  let ctaButtonText: string | undefined = undefined
  let ctaSecondaryText: string | undefined = undefined
  let badge1: string | undefined = undefined
  let badge2: string | undefined = undefined
  let badge3: string | undefined = undefined
  let card1Title: string | undefined = undefined
  let card1Desc: string | undefined = undefined
  let card2Title: string | undefined = undefined
  let card2Desc: string | undefined = undefined
  let card3Title: string | undefined = undefined
  let card3Desc: string | undefined = undefined
  let selectedOfferIds: string[] | undefined = undefined
  let offerBorderColor = ''
  let offerCardBgColor = ''
  let offerCardTextColor = ''
  let offerPriceColor = ''
  let offerOldPriceColor = ''
  let offerTitleSize: string | number = 19
  let offerPriceSize: string | number = 28
  let offerBodySize: string | number = 13
  let offerColumns: '1' | '2' | '3' | 'auto' = 'auto'
  let showOfferImage = true
  let showOfferDescription = true
  let showOfferQuantity = true
  let showOfferDelivery = true
  let showOfferGifts = true
  let showOfferFeatures = true
  let showOfferButton = true

  if (section?.content) {
    const trimmed = String(section.content).trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed)
        body = parsed.body !== undefined ? parsed.body : ''
        icon = parsed.icon || ''
        titleColor = parsed.titleColor || ''
        subtitleColor = parsed.subtitleColor || ''
        textColor = parsed.textColor || ''
        backgroundColor = parsed.backgroundColor || ''
        fontSize = parsed.fontSize || 'text-2xl sm:text-4xl'
        
        if (parsed.titleFontSize !== undefined) {
          titleFontSize = parsed.titleFontSize
        } else if (parsed.fontSize) {
          if (parsed.fontSize.includes('text-xl')) titleFontSize = 22
          else if (parsed.fontSize.includes('text-2xl')) titleFontSize = 28
          else if (parsed.fontSize.includes('text-3xl')) titleFontSize = 40
        }

        if (parsed.subtitleFontSize !== undefined) {
          subtitleFontSize = parsed.subtitleFontSize
        }
        
        if (parsed.paragraphFontSize !== undefined) {
          paragraphFontSize = parsed.paragraphFontSize
        }

        fontFamily = parsed.fontFamily || 'cairo'
        hideTitle = !!parsed.hideTitle

        if (parsed.imageUrl !== undefined) imageUrl = parsed.imageUrl
        if (parsed.imageAspectRatio) imageAspectRatio = parsed.imageAspectRatio
        if (parsed.imagePosition === 'below' || parsed.imagePosition === 'left' || parsed.imagePosition === 'bottom') {
          imagePosition = 'below'
        } else {
          imagePosition = 'above'
        }
        if (parsed.imageFit === 'contain') imageFit = 'contain'

        if (parsed.videoUrl) videoUrl = parsed.videoUrl
        if (parsed.videoType) videoType = parsed.videoType
        if (parsed.videoPosition) videoPosition = parsed.videoPosition
        videoAutoplay = !!parsed.videoAutoplay
        videoLoop = !!parsed.videoLoop
        videoMuted = !!parsed.videoMuted

        if (parsed.ctaButtonText !== undefined) ctaButtonText = parsed.ctaButtonText
        if (parsed.ctaSecondaryText !== undefined) ctaSecondaryText = parsed.ctaSecondaryText
        if (parsed.badge1 !== undefined) badge1 = parsed.badge1
        if (parsed.badge2 !== undefined) badge2 = parsed.badge2
        if (parsed.badge3 !== undefined) badge3 = parsed.badge3

        if (parsed.card1Title !== undefined) card1Title = parsed.card1Title
        if (parsed.card1Desc !== undefined) card1Desc = parsed.card1Desc
        if (parsed.card2Title !== undefined) card2Title = parsed.card2Title
        if (parsed.card2Desc !== undefined) card2Desc = parsed.card2Desc
        if (parsed.card3Title !== undefined) card3Title = parsed.card3Title
        if (parsed.card3Desc !== undefined) card3Desc = parsed.card3Desc

        if (parsed.offerBorderColor) offerBorderColor = parsed.offerBorderColor
        if (parsed.offerCardBgColor) offerCardBgColor = parsed.offerCardBgColor
        if (parsed.offerCardTextColor) offerCardTextColor = parsed.offerCardTextColor
        if (parsed.offerPriceColor) offerPriceColor = parsed.offerPriceColor
        if (parsed.offerOldPriceColor) offerOldPriceColor = parsed.offerOldPriceColor
        if (parsed.offerTitleSize !== undefined) offerTitleSize = parsed.offerTitleSize
        if (parsed.offerPriceSize !== undefined) offerPriceSize = parsed.offerPriceSize
        if (parsed.offerBodySize !== undefined) offerBodySize = parsed.offerBodySize
        if (parsed.offerColumns) offerColumns = parsed.offerColumns

        if (parsed.showOfferImage !== undefined) showOfferImage = !!parsed.showOfferImage
        if (parsed.showOfferDescription !== undefined) showOfferDescription = !!parsed.showOfferDescription
        if (parsed.showOfferQuantity !== undefined) showOfferQuantity = !!parsed.showOfferQuantity
        if (parsed.showOfferDelivery !== undefined) showOfferDelivery = !!parsed.showOfferDelivery
        if (parsed.showOfferGifts !== undefined) showOfferGifts = !!parsed.showOfferGifts
        if (parsed.showOfferFeatures !== undefined) showOfferFeatures = !!parsed.showOfferFeatures
        if (parsed.showOfferButton !== undefined) showOfferButton = !!parsed.showOfferButton

        if (Array.isArray(parsed.selectedOfferIds)) {
          selectedOfferIds = parsed.selectedOfferIds
        }
      } catch (e) {
        // Fallback to raw string
      }
    }
  }

  return {
    title: section?.title !== undefined && section?.title !== null ? section.title : '',
    subtitle: section?.subtitle !== undefined && section?.subtitle !== null ? section.subtitle : '',
    body,
    icon,
    titleColor,
    subtitleColor,
    textColor,
    backgroundColor,
    fontSize,
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
    videoType,
    videoPosition,
    videoAutoplay,
    videoLoop,
    videoMuted,
    ctaButtonText,
    ctaSecondaryText,
    badge1,
    badge2,
    badge3,
    card1Title,
    card1Desc,
    card2Title,
    card2Desc,
    card3Title,
    card3Desc,
    selectedOfferIds,
    offerBorderColor,
    offerCardBgColor,
    offerCardTextColor,
    offerPriceColor,
    offerOldPriceColor,
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
  }
}

export function serializeSectionContent(params: {
  body: string
  icon?: string
  titleColor?: string
  subtitleColor?: string
  textColor?: string
  backgroundColor?: string
  fontSize?: string
  titleFontSize?: string | number
  subtitleFontSize?: string | number
  paragraphFontSize?: string | number
  fontFamily?: string
  hideTitle?: boolean
  imageUrl?: string
  imageAspectRatio?: ImageAspectRatio
  imagePosition?: 'above' | 'below'
  imageFit?: 'cover' | 'contain'
  videoUrl?: string
  videoType?: 'upload' | 'youtube' | 'direct'
  videoPosition?: 'above' | 'below'
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean
  ctaButtonText?: string
  ctaSecondaryText?: string
  badge1?: string
  badge2?: string
  badge3?: string
  card1Title?: string
  card1Desc?: string
  card2Title?: string
  card2Desc?: string
  card3Title?: string
  card3Desc?: string
  selectedOfferIds?: string[]
  offerBorderColor?: string
  offerCardBgColor?: string
  offerCardTextColor?: string
  offerPriceColor?: string
  offerOldPriceColor?: string
  offerTitleSize?: string | number
  offerPriceSize?: string | number
  offerBodySize?: string | number
  offerColumns?: '1' | '2' | '3' | 'auto'
  showOfferImage?: boolean
  showOfferDescription?: boolean
  showOfferQuantity?: boolean
  showOfferDelivery?: boolean
  showOfferGifts?: boolean
  showOfferFeatures?: boolean
  showOfferButton?: boolean
}): string {
  return JSON.stringify({
    body: params.body || '',
    icon: params.icon || '',
    titleColor: params.titleColor || '',
    subtitleColor: params.subtitleColor || '',
    textColor: params.textColor || '',
    backgroundColor: params.backgroundColor || '',
    fontSize: params.fontSize || 'text-2xl sm:text-4xl',
    titleFontSize: params.titleFontSize || 32,
    subtitleFontSize: params.subtitleFontSize || 16,
    paragraphFontSize: params.paragraphFontSize || 17,
    fontFamily: params.fontFamily || 'cairo',
    hideTitle: !!params.hideTitle,
    imageUrl: params.imageUrl || '',
    imageAspectRatio: params.imageAspectRatio || 'auto',
    imagePosition: params.imagePosition || 'above',
    imageFit: params.imageFit || 'cover',
    videoUrl: params.videoUrl || '',
    videoType: params.videoType || 'upload',
    videoPosition: params.videoPosition || 'above',
    videoAutoplay: !!params.videoAutoplay,
    videoLoop: !!params.videoLoop,
    videoMuted: !!params.videoMuted,
    ctaButtonText: params.ctaButtonText,
    ctaSecondaryText: params.ctaSecondaryText,
    badge1: params.badge1,
    badge2: params.badge2,
    badge3: params.badge3,
    card1Title: params.card1Title,
    card1Desc: params.card1Desc,
    card2Title: params.card2Title,
    card2Desc: params.card2Desc,
    card3Title: params.card3Title,
    card3Desc: params.card3Desc,
    selectedOfferIds: params.selectedOfferIds || undefined,
    offerBorderColor: params.offerBorderColor || '',
    offerCardBgColor: params.offerCardBgColor || '',
    offerCardTextColor: params.offerCardTextColor || '',
    offerPriceColor: params.offerPriceColor || '',
    offerOldPriceColor: params.offerOldPriceColor || '',
    offerTitleSize: params.offerTitleSize || 19,
    offerPriceSize: params.offerPriceSize || 28,
    offerBodySize: params.offerBodySize || 13,
    offerColumns: params.offerColumns || 'auto',
    showOfferImage: params.showOfferImage !== undefined ? params.showOfferImage : true,
    showOfferDescription: params.showOfferDescription !== undefined ? params.showOfferDescription : true,
    showOfferQuantity: params.showOfferQuantity !== undefined ? params.showOfferQuantity : true,
    showOfferDelivery: params.showOfferDelivery !== undefined ? params.showOfferDelivery : true,
    showOfferGifts: params.showOfferGifts !== undefined ? params.showOfferGifts : true,
    showOfferFeatures: params.showOfferFeatures !== undefined ? params.showOfferFeatures : true,
    showOfferButton: params.showOfferButton !== undefined ? params.showOfferButton : true,
  })
}

export function getFontClass(fontFamilyId?: string): string {
  const found = ARABIC_FONTS.find(f => f.id === fontFamilyId)
  return found?.className || 'font-cairo'
}

export function SectionIcon({ name, className = 'w-6 h-6' }: { name?: string; className?: string }) {
  if (!name || name === 'none') return null
  const IconComp = ICON_MAP[name]
  if (!IconComp) return null
  return <IconComp className={className} />
}
