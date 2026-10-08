'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const offerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  old_price: z.coerce.number().min(0).optional().or(z.literal(0)),
  discount: z.coerce.number().min(0).max(100).optional().or(z.literal(0)),
  quantity_included: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  gifts: z.string().optional(),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
})

type OfferValues = z.infer<typeof offerSchema>

export function OfferForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<OfferValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: initialData || {
      name: '',
      price: 0,
      old_price: 0,
      discount: 0,
      quantity_included: 1,
      short_description: '',
      full_description: '',
      gifts: '',
      display_order: 0,
      is_active: true,
    },
  })

  async function onSubmit(data: OfferValues) {
    setIsLoading(true)
    setError(null)
    
    const supabase = createClient()
    
    try {
      if (initialData?.id) {
        // Update
        const { error: dbError } = await supabase
          .from('offers')
          .update(data)
          .eq('id', initialData.id)
          
        if (dbError) throw new Error(dbError.message)
      } else {
        // Insert
        const { error: dbError } = await supabase
          .from('offers')
          .insert(data)
          
        if (dbError) throw new Error(dbError.message)
      }
      
      router.push('/admin/offers')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'An error occurred while saving the offer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Offer Name * (e.g. "2 Shampoos + Gift")</Label>
          <Input id="name" {...form.register('name')} />
          {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity_included">Quantity Included *</Label>
          <Input id="quantity_included" type="number" min="1" {...form.register('quantity_included')} />
          {form.formState.errors.quantity_included && <p className="text-sm text-red-500">{form.formState.errors.quantity_included.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Offer Price (DA) *</Label>
          <Input id="price" type="number" step="0.01" {...form.register('price')} />
          {form.formState.errors.price && <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">Old Price (DA) [Optional]</Label>
          <Input id="old_price" type="number" step="0.01" {...form.register('old_price')} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Percentage (%) [Optional]</Label>
          <Input id="discount" type="number" min="0" max="100" {...form.register('discount')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input id="display_order" type="number" {...form.register('display_order')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Short Description</Label>
        <Input id="short_description" {...form.register('short_description')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gifts">Gifts Included (e.g. "1 Hair Oil")</Label>
        <Input id="gifts" {...form.register('gifts')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_description">Full Description</Label>
        <textarea
          id="full_description"
          {...form.register('full_description')}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex items-center gap-4 border rounded-md p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" {...form.register('is_active')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
          <Label htmlFor="is_active">Active (Visible on landing page)</Label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/offers')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Offer' : 'Create Offer'}
        </Button>
      </div>
    </form>
  )
}
