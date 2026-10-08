import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OfferForm } from '../../_components/offer-form'

export default async function EditOfferPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const resolvedParams = await params

  const { data: offer } = await supabase
    .from('offers')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!offer) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Offer</h1>
        <p className="text-sm text-gray-500 mt-2">
          Update the details of your offer.
        </p>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <OfferForm initialData={offer} />
      </div>
    </div>
  )
}
