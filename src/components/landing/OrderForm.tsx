'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { submitOrder } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Truck, Package, Phone, User, MapPin, ChevronDown, ChevronUp, Sparkles, Gift } from 'lucide-react'
import { getOfferFirstImage, parseOfferData } from '@/lib/offer-helper'

export function OrderForm({ offers, wilayas, deliveryPrices, defaultCompanyId }: any) {
  const [state, formAction, isPending] = useActionState(submitOrder, null)
  
  const [selectedOffer, setSelectedOffer] = useState<string>(offers?.[0]?.id || '')
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null)
  const [selectedWilaya, setSelectedWilaya] = useState<string>('')
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'office'>('home')
  const [quantity, setQuantity] = useState<number>(1)
  
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0)
  const [deliveryCost, setDeliveryCost] = useState<number>(0)

  useEffect(() => {
    const handleSelectOffer = (e: any) => {
      setSelectedOffer(e.detail)
    }
    window.addEventListener('selectOffer', handleSelectOffer)
    return () => window.removeEventListener('selectOffer', handleSelectOffer)
  }, [])

  useEffect(() => {
    let total = 0
    let delCost = 0
    
    // Calculate offer price
    const offer = offers.find((o: any) => o.id === selectedOffer)
    const offerData = offer ? parseOfferData(offer) : null
    const isFreeDelivery = offerData ? offerData.isFreeDelivery : false

    if (offer) {
      total += offer.price * quantity
    }
    
    // Calculate delivery price
    if (selectedWilaya && defaultCompanyId) {
      const p = deliveryPrices.find((p: any) => p.wilaya_id === selectedWilaya && p.company_id === defaultCompanyId)
      if (p) {
        if (!isFreeDelivery) {
          delCost = deliveryMethod === 'home' ? p.home_price : p.office_price
          total += delCost
        } else {
          delCost = 0
        }
      }
    }
    
    setDeliveryCost(delCost)
    setCalculatedTotal(total)
  }, [selectedOffer, selectedWilaya, deliveryMethod, quantity, offers, deliveryPrices, defaultCompanyId])

  if (state?.success) {
    return (
      <div className="bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">شكراً لك! تم تسجيل طلبك بنجاح</h3>
        <p className="text-emerald-700 mb-6">
          Order Reference: <span className="font-mono font-bold bg-emerald-200 px-2 py-1 rounded">{state.orderId.split('-')[0].toUpperCase()}</span>
        </p>
        <p className="text-emerald-600 text-sm">
          سنتصل بك قريباً لتأكيد طلبك وتحديد موعد التسليم.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary/5 opacity-50 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-emerald-50 opacity-50 blur-2xl"></div>

      <div className="relative z-10 space-y-8">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">اطلب الآن</h2>
          <p className="mt-2 text-gray-500">يرجى ملء الاستمارة أدناه لإتمام طلبك</p>
        </div>

        {state?.message && !state?.success && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center">
            <span className="bg-red-100 p-1 rounded-full mr-3"><CheckCircle2 className="w-4 h-4 text-red-500" /></span>
            {state.message}
          </div>
        )}

        {/* Offer Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-900 flex items-center"><Package className="w-4 h-4 mr-2 text-primary" /> اختر العرض</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            {offers.map((offer: any) => (
              <div 
                key={offer.id} 
                onClick={() => setSelectedOffer(offer.id)}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col ${
                  selectedOffer === offer.id 
                    ? 'border-blue-600 bg-primary/5/50 shadow-sm ring-1 ring-primary/10' 
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="offer_id" 
                  value={offer.id} 
                  checked={selectedOffer === offer.id}
                  readOnly
                  className="sr-only" 
                />
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-3">
                    {(() => {
                      const offerImg = getOfferFirstImage(offer)
                      return offerImg ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200 mt-0.5">
                          <img src={offerImg} alt={offer.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </div>
                      ) : null
                    })()}
                    <div>
                      <span className="font-bold text-gray-900 leading-tight block">{offer.name}</span>
                      
                      {/* Offer Badges / Tags (Gift, Free Delivery, Discount) */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {(() => {
                          const oData = parseOfferData(offer)
                          const badgeText = oData.badgeText || (offer.discount > 0 ? `تخفيض ${offer.discount}%` : null)
                          return (
                            <>
                              {oData.isFreeDelivery && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs animate-pulse">
                                  <Truck className="w-3 h-3 text-emerald-600" />
                                  <span>توصيل مجاني</span>
                                </span>
                              )}
                              {offer.gifts && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <span>🎁 {offer.gifts}</span>
                                </span>
                              )}
                              {badgeText && (
                                <span 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs"
                                  style={oData.badgeColor ? { backgroundColor: oData.badgeColor } : { backgroundColor: '#dc2626' }}
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                  <span>{badgeText}</span>
                                </span>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                  {selectedOffer === offer.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />}
                </div>
                
                <div className="flex justify-between items-end mt-auto pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary glow-price">{offer.price} DA</span>
                    {offer.old_price > 0 && <span className="text-sm text-gray-400 line-through mr-2">{offer.old_price} DA</span>}
                  </div>
                  
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedOffer(expandedOffer === offer.id ? null : offer.id)
                    }}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-primary transition-colors bg-white px-2 py-1 rounded-md border border-gray-200"
                  >
                    تفاصيل العرض
                    {expandedOffer === offer.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {expandedOffer === offer.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200/60 text-sm space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    <p className="text-gray-600 whitespace-pre-line text-start">{offer.short_description}</p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex items-center text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2 shrink-0" />
                        <span>الكمية: {offer.quantity_included}</span>
                      </li>
                      {offer.gifts && (
                        <li className="flex items-center text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2 shrink-0" />
                          <span>الهدايا: {offer.gifts}</span>
                        </li>
                      )}
                      {offer.full_description && (
                        <li className="flex items-center text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2 shrink-0" />
                          <span>{offer.full_description}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Customer Info */}
          <div className="space-y-2">
            <Label htmlFor="customer_name" className="text-gray-700 font-medium flex items-center"><User className="w-4 h-4 mr-2 text-secondary" /> الاسم الكامل</Label>
            <Input id="customer_name" name="customer_name" required className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-blue-500 transition-colors rounded-xl" placeholder="الاسم واللقب" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center"><Phone className="w-4 h-4 mr-2 text-secondary" /> رقم الهاتف</Label>
            <Input id="phone" name="phone" type="tel" required className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-blue-500 transition-colors rounded-xl text-left" dir="ltr" placeholder="05..." />
          </div>

          {/* Delivery Info */}
          <div className="space-y-2">
            <Label htmlFor="wilaya_id" className="text-gray-700 font-medium flex items-center"><MapPin className="w-4 h-4 mr-2 text-secondary" /> الولاية</Label>
            <select
              id="wilaya_id"
              name="wilaya_id"
              required
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">اختر الولاية...</option>
              {wilayas.map((w: any) => (
                <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-gray-700 font-medium flex items-center"><Package className="w-4 h-4 mr-2 text-secondary" /> الكمية</Label>
            <div className="flex items-center h-12 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition-colors h-full">-</button>
              <Input type="number" id="quantity" name="quantity" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="border-0 bg-transparent text-center h-full focus-visible:ring-0 rounded-none w-full" />
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition-colors h-full">+</button>
            </div>
          </div>
        </div>

        {/* Delivery Method */}
        {selectedWilaya && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Label className="text-base font-semibold text-gray-900 flex items-center"><Truck className="w-4 h-4 mr-2 text-primary" /> طريقة التوصيل</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex items-center justify-between ${
                deliveryMethod === 'home' ? 'border-blue-600 bg-primary/5/50 ring-1 ring-primary/10' : 'border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery_method" value="home" checked={deliveryMethod === 'home'} onChange={() => setDeliveryMethod('home')} className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" />
                  <span className="font-medium text-gray-900">توصيل للمنزل</span>
                </div>
              </label>
              <label className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex items-center justify-between ${
                deliveryMethod === 'office' ? 'border-blue-600 bg-primary/5/50 ring-1 ring-primary/10' : 'border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery_method" value="office" checked={deliveryMethod === 'office'} onChange={() => setDeliveryMethod('office')} className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" />
                  <span className="font-medium text-gray-900">توصيل للمكتب (Stop Desk)</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 mt-8 shadow-inner overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          
          <h3 className="text-lg font-medium text-gray-300 border-b border-gray-700 pb-4 mb-4">ملخص الطلب</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">سعر العرض</span>
              <span className="font-medium">{offers.find((o:any)=>o.id===selectedOffer)?.price * quantity || 0} DA</span>
            </div>
            {selectedWilaya && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">سعر التوصيل</span>
                {(() => {
                  const currentOffer = offers.find((o: any) => o.id === selectedOffer)
                  const oData = currentOffer ? parseOfferData(currentOffer) : null
                  if (oData?.isFreeDelivery) {
                    return (
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-xs sm:text-sm animate-pulse">
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>مجاني (توصيل مجاني مع هذا العرض)</span>
                      </span>
                    )
                  }
                  return (
                    <span className="font-medium">{deliveryCost > 0 ? `${deliveryCost} DA` : 'مجاني'}</span>
                  )
                })()}
              </div>
            )}
            <div className="pt-4 mt-2 border-t border-gray-700 flex justify-between items-center">
              <span className="text-lg font-bold">المجموع الكلي</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 glow-price">{calculatedTotal} DA</span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending || !selectedWilaya} 
          className="w-full h-14 text-lg font-bold text-white rounded-xl glow-button shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 hover:scale-[1.02] disabled:opacity-70 disabled:shadow-none disabled:hover:scale-100 disabled:hover:brightness-100 relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_3s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent"
        >
          {isPending ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}
        </Button>
      </div>
    </form>
  )
}
