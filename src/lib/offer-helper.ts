import { ARABIC_FONTS, PRESET_COLORS, getFontClass } from './section-config'

export interface OfferParsedData {
  images: string[]
  titleColor: string
  buttonColor: string
  badgeColor: string
  fontFamily: string
  badgeText: string
  buttonText: string
}

export function parseOfferData(offer: any): OfferParsedData {
  let images: string[] = []
  let titleColor = ''
  let buttonColor = ''
  let badgeColor = ''
  let fontFamily = ''
  let badgeText = ''
  let buttonText = ''

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
        fontFamily = obj.fontFamily || ''
        badgeText = obj.badgeText || ''
        buttonText = obj.buttonText || ''
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

  // Fallback to top-level fields if added in the future
  if (offer?.images && Array.isArray(offer.images)) {
    images = offer.images
  }
  if (offer?.title_color) titleColor = offer.title_color
  if (offer?.button_color) buttonColor = offer.button_color
  if (offer?.badge_color) badgeColor = offer.badge_color
  if (offer?.font_family) fontFamily = offer.font_family

  return {
    images: images.slice(0, 5), // Limit to 5 images
    titleColor,
    buttonColor,
    badgeColor,
    fontFamily,
    badgeText,
    buttonText,
  }
}

export function serializeOfferData(params: {
  images: string[]
  titleColor?: string
  buttonColor?: string
  badgeColor?: string
  fontFamily?: string
  badgeText?: string
  buttonText?: string
}): string {
  const images = (params.images || []).filter(Boolean).slice(0, 5)
  return JSON.stringify({
    images,
    titleColor: params.titleColor || '',
    buttonColor: params.buttonColor || '',
    badgeColor: params.badgeColor || '',
    fontFamily: params.fontFamily || '',
    badgeText: params.badgeText || '',
    buttonText: params.buttonText || '',
  })
}

export function getOfferFirstImage(offer: any): string | null {
  const data = parseOfferData(offer)
  return data.images[0] || null
}
