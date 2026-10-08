import { ProductForm } from '../_components/product-form'

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-2">
          Create a new product to be sold on your landing pages.
        </p>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <ProductForm />
      </div>
    </div>
  )
}
