import { createClient } from '@/lib/supabase/server'
import { OrdersClient } from './_components/orders-client'

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      wilayas ( name ),
      offers ( id, name, short_description, full_description, price, old_price, quantity_included, gifts )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-4 sm:p-6">
        <OrdersClient initialOrders={orders || []} />
      </div>
    </div>
  )
}
