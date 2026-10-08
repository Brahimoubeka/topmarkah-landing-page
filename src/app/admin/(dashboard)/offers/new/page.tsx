import { OfferForm } from '../_components/offer-form'

export default function NewOfferPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Offer</h1>
        <p className="text-sm text-gray-500 mt-2">
          Create a new offer or bundle.
        </p>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <OfferForm />
      </div>
    </div>
  )
}
