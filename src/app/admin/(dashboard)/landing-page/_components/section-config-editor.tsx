'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save, Sparkles, Type, Palette, Eye } from 'lucide-react'
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

export function SectionConfigEditor({
  section,
  saving,
  onSave,
}: {
  section: {
    id: string
    section_id: string
    title: string | null
    subtitle: string | null
    content: string | null
    is_active: boolean
  }
  saving: boolean
  onSave: (fields: { title: string; subtitle: string; content: string }) => void
}) {
  const parsed = parseSectionData(section)

  const [title, setTitle] = useState(parsed.title)
  const [subtitle, setSubtitle] = useState(parsed.subtitle)
  const [body, setBody] = useState(parsed.body)
  const [icon, setIcon] = useState(parsed.icon)
  const [titleColor, setTitleColor] = useState(parsed.titleColor)
  const [fontSize, setFontSize] = useState(parsed.fontSize)
  const [fontFamily, setFontFamily] = useState(parsed.fontFamily)

  useEffect(() => {
    const updated = parseSectionData(section)
    setTitle(updated.title)
    setSubtitle(updated.subtitle)
    setBody(updated.body)
    setIcon(updated.icon)
    setTitleColor(updated.titleColor)
    setFontSize(updated.fontSize)
    setFontFamily(updated.fontFamily)
  }, [section.id, section.content, section.title, section.subtitle])

  const handleSave = () => {
    const serializedContent = serializeSectionContent({
      body,
      icon,
      titleColor,
      fontSize,
      fontFamily,
    })

    onSave({
      title,
      subtitle,
      content: serializedContent,
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
          <span>معاينة حية لشكل العنوان والفقرة (Live Preview)</span>
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

          {body && (
            <div className="mt-3 text-sm text-gray-600 whitespace-pre-line max-w-xl mx-auto leading-relaxed text-start bg-gray-50 p-3 rounded-lg border border-gray-100">
              {body}
            </div>
          )}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          size="sm"
          disabled={saving}
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
