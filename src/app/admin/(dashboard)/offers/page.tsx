import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function OffersPage() {
  const supabase = await createClient()

  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Offers</h1>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/admin/offers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Offer
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Qty Included
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers && offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {offer.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {offer.price} DA
                    {offer.old_price > 0 && (
                      <span className="text-xs text-red-500 line-through ml-2">{offer.old_price} DA</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {offer.quantity_included}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      offer.is_active 
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : 'bg-red-50 text-red-700 ring-red-600/10'
                    }`}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/offers/${offer.id}/edit`} className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <DeleteButton table="offers" id={offer.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  No offers found. Click "Add Offer" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
