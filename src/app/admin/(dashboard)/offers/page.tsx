import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { OffersTable } from './_components/offers-table'

export default async function OffersPage() {
  const supabase = await createClient()

  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">إدارة العروض (Offers)</h1>
          <p className="text-xs text-gray-500 mt-1">
            يمكنك إعادة ترتيب العروض بسهولة بواسطة أزرار ⬆️ و ⬇️ لتحديد ترتيب ظهورها على صفحة الهبوط مباشرة.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild className="rounded-xl gap-2 shadow-sm">
            <Link href="/admin/offers/new">
              <Plus className="h-4 w-4" />
              <span>إضافة عرض جديد (Add Offer)</span>
            </Link>
          </Button>
        </div>
      </div>

      <OffersTable initialOffers={offers || []} />
    </div>
  )
}
