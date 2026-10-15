'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const orderSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  wilaya_id: z.string().min(1, 'Wilaya is required'),
  offer_id: z.string().min(1, 'Offer is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  delivery_method: z.enum(['home', 'office']),
})

export async function submitOrder(prevState: any, formData: FormData) {
  const supabase = await createClient()

  try {
    const rawData = {
      customer_name: formData.get('customer_name'),
      phone: formData.get('phone'),
      wilaya_id: formData.get('wilaya_id'),
      offer_id: formData.get('offer_id'),
      quantity: formData.get('quantity'),
      delivery_method: formData.get('delivery_method'),
    }

    const data = orderSchema.parse(rawData)

    // Using the secure RPC function to place the order
    // This function calculates total price server-side based on actual DB prices.
    const { data: orderId, error } = await supabase
      .rpc('place_order', {
        p_customer_name: data.customer_name,
        p_phone: data.phone,
        p_wilaya_id: data.wilaya_id,
        p_offer_id: data.offer_id,
        p_quantity: data.quantity,
        p_delivery_method: data.delivery_method,
      })

    if (error) {
      console.error('Order submission error:', error)
      return { success: false, message: error.message || 'Failed to place order.' }
    }

    // Check if the selected offer has free delivery
    try {
      const { data: offer } = await supabase
        .from('offers')
        .select('*')
        .eq('id', data.offer_id)
        .single()

      if (offer) {
        const { parseOfferData } = await import('@/lib/offer-helper')
        const offerData = parseOfferData(offer)
        if (offerData.isFreeDelivery && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const { createClient: createServiceClient } = await import('@supabase/supabase-js')
          const adminSupabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY
          )
          const updatedTotal = Number(offer.price) * Number(data.quantity)
          await adminSupabase
            .from('orders')
            .update({
              delivery_price: 0,
              total_price: updatedTotal,
            })
            .eq('id', orderId)
        }
      }
    } catch (deliveryErr) {
      console.error('Error checking free delivery for order:', deliveryErr)
    }

    return { success: true, orderId, message: 'Order placed successfully!' }
  } catch (error: any) {
    console.error('Validation error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, message: (error as any).errors[0].message }
    }
    return { success: false, message: 'An unexpected error occurred.' }
  }
}
