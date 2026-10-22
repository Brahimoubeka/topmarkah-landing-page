import React from 'react'
import {
  CheckCircle2,
  Check,
  Sparkles,
  Gift,
  ShieldCheck,
  Star,
  Truck,
  Package,
  Zap,
} from 'lucide-react'

export interface OfferFeatureItem {
  id: string
  text: string
  icon?: string
}

export const OFFER_FEATURE_ICONS: { id: string; name: string }[] = [
  { id: 'check-circle', name: 'صح دائرية (Check)' },
  { id: 'check', name: 'صح بسيطة' },
  { id: 'sparkles', name: 'بريق ومميزات (Sparkles)' },
  { id: 'gift', name: 'هدية مجانية (Gift)' },
  { id: 'shield', name: 'ضمان وحماية (Shield)' },
  { id: 'truck', name: 'توصيل وشحن (Truck)' },
  { id: 'star', name: 'نجمة مميزة (Star)' },
  { id: 'package', name: 'طرد وعلبة (Package)' },
  { id: 'zap', name: 'سريع وحصري (Zap)' },
]

export const OFFER_FEATURES_SIZE_PRESETS = [
  { size: 12, label: 'صغير ناعم (12px)' },
  { size: 14, label: 'قياسي (14px)' },
  { size: 16, label: 'متوسط (16px)' },
  { size: 18, label: 'كبير واضح (18px)' },
  { size: 20, label: 'بارز جداً (20px)' },
]

export function OfferFeatureIcon({
  icon = 'check-circle',
  className = 'w-4 h-4',
  style,
}: {
  icon?: string
  className?: string
  style?: React.CSSProperties
}) {
  switch (icon) {
    case 'check':
      return React.createElement(Check, { className, style })
    case 'sparkles':
      return React.createElement(Sparkles, { className, style })
    case 'gift':
      return React.createElement(Gift, { className, style })
    case 'shield':
      return React.createElement(ShieldCheck, { className, style })
    case 'star':
      return React.createElement(Star, { className, style })
    case 'truck':
      return React.createElement(Truck, { className, style })
    case 'package':
      return React.createElement(Package, { className, style })
    case 'zap':
      return React.createElement(Zap, { className, style })
    case 'check-circle':
    default:
      return React.createElement(CheckCircle2, { className, style })
  }
}

export interface OfferParsedData {
  images: string[]
  titleColor: string
  buttonColor: string
  badgeColor: string
  borderColor: string
  fontFamily: string
  badgeText: string
  buttonText: string
  isFreeDelivery: boolean
  featuresList: OfferFeatureItem[]
  featuresSize?: number
  featuresIconColor?: string
}

export function parseOfferData(offer: any): OfferParsedData {
  let images: string[] = []
  let titleColor = ''
  let buttonColor = ''
  let badgeColor = ''
  let borderColor = ''
  let fontFamily = ''
  let badgeText = ''
  let buttonText = ''
  let isFreeDelivery = false
  let featuresList: OfferFeatureItem[] = []
  let featuresSize: number | undefined = undefined
  let featuresIconColor = ''

  if (offer?.image_url) {
    const raw = String(offer.image_url).trim()
    if (raw.startsWith('{') && raw.endsWith('}')) {
      try {
        const obj = JSON.parse(raw)
        if (Array.isArray(obj.images)) {
          images = obj.images.filter(Boolean)
        }
        titleColor = obj.titleColor || ''
        buttonColor = obj.buttonColor || ''
        badgeColor = obj.badgeColor || ''
        borderColor = obj.borderColor || obj.border_color || ''
        fontFamily = obj.fontFamily || ''
        badgeText = obj.badgeText || ''
        buttonText = obj.buttonText || ''
        isFreeDelivery = !!(obj.isFreeDelivery || obj.is_free_delivery || obj.freeDelivery || obj.free_delivery)

        if (Array.isArray(obj.featuresList)) {
          featuresList = obj.featuresList.map((item: any, i: number) => {
            if (typeof item === 'string') {
              return { id: String(i + 1), text: item, icon: 'check-circle' }
            }
            return {
              id: item.id || String(i + 1),
              text: String(item.text || ''),
              icon: item.icon || 'check-circle',
            }
          }).filter((f: OfferFeatureItem) => f.text.trim().length > 0)
        }

        if (obj.featuresSize) {
          const s = Number(obj.featuresSize)
          if (!isNaN(s) && s > 0) featuresSize = s
        }
        if (obj.featuresIconColor) {
          featuresIconColor = obj.featuresIconColor
        }
      } catch {}
    } else if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) {
          images = arr.filter(Boolean)
        }
      } catch {}
    } else if (raw.includes(',')) {
      images = raw.split(',').map((s: string) => s.trim()).filter(Boolean)
    } else if (raw.length > 0) {
      images = [raw]
    }
  }

  // Fallback: If no structured featuresList is saved, but offer has full_description with lines
  if (featuresList.length === 0 && offer?.full_description) {
    const lines = String(offer.full_description)
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
    if (lines.length > 0) {
      featuresList = lines.map((line, idx) => ({
        id: `auto-${idx + 1}`,
        text: line.replace(/^[•\-\*✓✔\d\.\)]\s*/, ''), // clean bullets if present
        icon: 'check-circle',
      }))
    }
  }

  // Fallback to top-level fields if added in the future
  if (offer?.images && Array.isArray(offer.images)) {
    images = offer.images
  }
  if (offer?.title_color) titleColor = offer.title_color
  if (offer?.button_color) buttonColor = offer.button_color
  if (offer?.badge_color) badgeColor = offer.badge_color
  if (offer?.border_color) borderColor = offer.border_color
  if (offer?.font_family) fontFamily = offer.font_family
  if (offer?.is_free_delivery !== undefined) isFreeDelivery = !!offer.is_free_delivery

  return {
    images: images.slice(0, 5), // Limit to 5 images
    titleColor,
    buttonColor,
    badgeColor,
    borderColor,
    fontFamily,
    badgeText,
    buttonText,
    isFreeDelivery,
    featuresList,
    featuresSize,
    featuresIconColor,
  }
}

export function serializeOfferData(params: {
  images: string[]
  titleColor?: string
  buttonColor?: string
  badgeColor?: string
  borderColor?: string
  fontFamily?: string
  badgeText?: string
  buttonText?: string
  isFreeDelivery?: boolean
  featuresList?: OfferFeatureItem[]
  featuresSize?: number
  featuresIconColor?: string
}): string {
  const images = (params.images || []).filter(Boolean).slice(0, 5)
  return JSON.stringify({
    images,
    titleColor: params.titleColor || '',
    buttonColor: params.buttonColor || '',
    badgeColor: params.badgeColor || '',
    borderColor: params.borderColor || '',
    fontFamily: params.fontFamily || '',
    badgeText: params.badgeText || '',
    buttonText: params.buttonText || '',
    isFreeDelivery: !!params.isFreeDelivery,
    featuresList: (params.featuresList || []).filter(f => f.text && f.text.trim().length > 0),
    featuresSize: params.featuresSize || undefined,
    featuresIconColor: params.featuresIconColor || '',
  })
}

export function getOfferFirstImage(offer: any): string | null {
  const data = parseOfferData(offer)
  return data.images[0] || null
}
