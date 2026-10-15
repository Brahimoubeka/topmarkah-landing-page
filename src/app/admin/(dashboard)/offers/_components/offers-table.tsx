'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, Edit, Loader2, Check, AlertCircle, Truck } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { getOfferFirstImage, parseOfferData } from '@/lib/offer-helper'

export function OffersTable({ initialOffers }: { initialOffers: any[] }) {
  const router = useRouter()
  const [offers, setOffers] = useState<any[]>(initialOffers)
  const [reordering, setReordering] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // Move an offer up or down
  async function moveOffer(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= offers.length) return

    const currentOffer = offers[index]
    const targetOffer = offers[targetIndex]
    setReordering(currentOffer.id)

    // Create a new copy of the array and swap items
    const newOffers = [...offers]
    newOffers[index] = targetOffer
    newOffers[targetIndex] = currentOffer

    // Re-assign display_order sequentially 0, 1, 2, 3...
    const updatedWithOrders = newOffers.map((o, idx) => ({
      ...o,
      display_order: idx,
    }))

    // Optimistically update UI
    setOffers(updatedWithOrders)

    try {
      const supabase = createClient()
      
      // Update both offers in Supabase
      const update1 = supabase
        .from('offers')
        .update({ display_order: targetIndex })
        .eq('id', currentOffer.id)

      const update2 = supabase
        .from('offers')
        .update({ display_order: index })
        .eq('id', targetOffer.id)

      const [res1, res2] = await Promise.all([update1, update2])

      if (res1.error || res2.error) {
        throw new Error((res1.error || res2.error)?.message)
      }

      showMessage('تم تحديث ترتيب العروض بنجاح!')
      router.refresh()
    } catch (err: any) {
      // Revert if error
      setOffers(offers)
      showMessage('فشل تحديث الترتيب: ' + (err.message || 'خطأ غير معروف'), 'error')
    } finally {
      setReordering(null)
    }
  }

  // Toggle active/inactive
  async function toggleActive(offer: any) {
    setToggling(offer.id)
    const newStatus = !offer.is_active

    // Optimistic update
    setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: newStatus } : o))

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('offers')
        .update({ is_active: newStatus })
        .eq('id', offer.id)

      if (error) throw error
      showMessage(newStatus ? 'تم تفعيل العرض على الصفحة' : 'تم إخفاء العرض من الصفحة')
      router.refresh()
    } catch (err: any) {
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: !newStatus } : o))
      showMessage('فشل تغيير الحالة: ' + err.message, 'error')
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-3">
      {message && (
        <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-start text-xs font-bold text-gray-700 w-28">
                الترتيب (Order)
              </th>
              <th scope="col" className="w-16 py-3.5 px-3 text-start text-xs font-bold text-gray-700">
                الصورة
              </th>
              <th scope="col" className="py-3.5 px-3 text-start text-xs font-bold text-gray-700">
                اسم العرض
              </th>
              <th scope="col" className="px-3 py-3.5 text-start text-xs font-bold text-gray-700">
                السعر
              </th>
              <th scope="col" className="px-3 py-3.5 text-start text-xs font-bold text-gray-700">
                الكمية
              </th>
              <th scope="col" className="px-3 py-3.5 text-start text-xs font-bold text-gray-700">
                الحالة
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-end text-xs font-bold text-gray-700">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {offers && offers.length > 0 ? (
              offers.map((offer, index) => {
                const img = getOfferFirstImage(offer)
                const isFirst = index === 0
                const isLast = index === offers.length - 1
                const isBusy = reordering === offer.id

                return (
                  <tr key={offer.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Order Controls */}
                    <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center shrink-0">
                          #{index + 1}
                        </span>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={isFirst || isBusy}
                            onClick={() => moveOffer(index, 'up')}
                            className="p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="تقديم العرض للأعلى"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast || isBusy}
                            onClick={() => moveOffer(index, 'down')}
                            className="p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="تأخير العرض للأسفل"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Thumbnail */}
                    <td className="whitespace-nowrap py-3.5 px-3">
                      {img ? (
                        <div className="h-11 w-11 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shadow-sm shrink-0">
                          <img src={img} alt={offer.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] shrink-0 border border-dashed">
                          بدون صورة
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="whitespace-nowrap py-3.5 px-3 text-sm font-bold text-gray-900">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{offer.name}</span>
                          {parseOfferData(offer).isFreeDelivery && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Truck className="w-3 h-3 text-emerald-600" />
                              توصيل مجاني
                            </span>
                          )}
                        </div>
                        {offer.gifts && (
                          <div className="text-[11px] font-normal text-emerald-600 mt-0.5">
                            🎁 {offer.gifts}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-700">
                      <span className="font-bold text-primary">{offer.price} دج</span>
                      {offer.old_price > 0 && (
                        <span className="text-xs text-red-500 line-through mr-2">{offer.old_price} دج</span>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-600">
                      {offer.quantity_included}
                    </td>

                    {/* Status Toggle */}
                    <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                      <button
                        type="button"
                        onClick={() => toggleActive(offer)}
                        disabled={toggling === offer.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                          offer.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                        }`}
                        title="انقر لتغيير الحالة"
                      >
                        {toggling === offer.id && <Loader2 className="w-3 h-3 animate-spin" />}
                        {offer.is_active ? 'ظاهر' : 'مخفي'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="relative whitespace-nowrap py-3.5 pl-3 pr-4 text-end text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2 items-center">
                        <Link
                          href={`/admin/offers/${offer.id}/edit`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="تعديل العرض"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <DeleteButton table="offers" id={offer.id} />
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-gray-500">
                  لا توجد عروض حالياً. انقر على "Add Offer" لإضافة عرض جديد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
