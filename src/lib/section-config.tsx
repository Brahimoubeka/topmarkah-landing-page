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
} from 'lucide-react'

export interface SectionStyleConfig {
  title: string
  subtitle: string
  body: string
  icon: string
  titleColor: string
  fontSize: string
  fontFamily: string
}

export const ARABIC_FONTS = [
  { id: 'cairo', name: 'Cairo (كايرو - عصري وقوي)', className: 'font-cairo' },
  { id: 'tajawal', name: 'Tajawal (تجوال - أنيق وسلس)', className: 'font-tajawal' },
  { id: 'almarai', name: 'Almarai (المراعي - ناعم وواضح)', className: 'font-almarai' },
  { id: 'readex', name: 'Readex Pro (ريديكس - حديث)', className: 'font-readex' },
  { id: 'amiri', name: 'Amiri (أميري - كلاسيكي)', className: 'font-amiri' },
  { id: 'default', name: 'الافتراضي (System Sans)', className: '' },
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
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Ruby Red', hex: '#dc2626' },
  { name: 'Warm Amber', hex: '#d97706' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
]

export function parseSectionData(section: any): SectionStyleConfig {
  let body = section?.content || ''
  let icon = ''
  let titleColor = ''
  let fontSize = 'text-2xl sm:text-4xl'
  let fontFamily = 'cairo'

  if (section?.content) {
    const trimmed = String(section.content).trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed)
        body = parsed.body !== undefined ? parsed.body : ''
        icon = parsed.icon || ''
        titleColor = parsed.titleColor || ''
        fontSize = parsed.fontSize || 'text-2xl sm:text-4xl'
        fontFamily = parsed.fontFamily || 'cairo'
      } catch (e) {
        // Fallback to raw string
      }
    }
  }

  return {
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    body,
    icon,
    titleColor,
    fontSize,
    fontFamily,
  }
}

export function serializeSectionContent(params: {
  body: string
  icon?: string
  titleColor?: string
  fontSize?: string
  fontFamily?: string
}): string {
  return JSON.stringify({
    body: params.body || '',
    icon: params.icon || '',
    titleColor: params.titleColor || '',
    fontSize: params.fontSize || 'text-2xl sm:text-4xl',
    fontFamily: params.fontFamily || 'cairo',
  })
}

export function getFontClass(fontFamilyId: string): string {
  const found = ARABIC_FONTS.find(f => f.id === fontFamilyId)
  return found?.className || 'font-cairo'
}

export function SectionIcon({ name, className = 'w-6 h-6' }: { name?: string; className?: string }) {
  if (!name || name === 'none') return null
  const IconComp = ICON_MAP[name]
  if (!IconComp) return null
  return <IconComp className={className} />
}
