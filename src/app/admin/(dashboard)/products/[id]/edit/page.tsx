import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '../../_components/product-form'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const resolvedParams = await params

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: existingMedia } = await supabase
    .from('product_media')
    .select('*')
    .eq('product_id', resolvedParams.id)
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-2">
          Update the details of your product.
        </p>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <ProductForm initialData={product} existingMedia={existingMedia || []} />
      </div>
    </div>
  )
}
