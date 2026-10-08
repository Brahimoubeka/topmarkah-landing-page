import { createClient } from '@/lib/supabase/server'
import { DeliveryClient } from './_components/delivery-client'

export default async function DeliveryPage() {
  const supabase = await createClient()

  // Fetch Wilayas
  const { data: wilayas } = await supabase
    .from('wilayas')
    .select('*')
    .order('code', { ascending: true })

  // Fetch Companies
  const { data: companies } = await supabase
    .from('delivery_companies')
    .select('*')

  // Fetch Prices
  const { data: prices } = await supabase
    .from('delivery_prices')
    .select('*')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Delivery Configuration</h1>
      </div>
      
      <p className="text-sm text-gray-500">
        Manage your delivery companies, wilayas, and pricing here. Changes take effect immediately.
      </p>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-4 sm:p-6">
        <DeliveryClient 
          initialWilayas={wilayas || []} 
          initialCompanies={companies || []}
          initialPrices={prices || []}
        />
      </div>
    </div>
  )
}
