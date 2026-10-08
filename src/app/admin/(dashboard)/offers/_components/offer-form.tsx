'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, Trash2, Loader2 } from 'lucide-react'

const offerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  old_price: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  quantity_included: z.number().min(1, 'Quantity must be at least 1').default(1),
  gifts: z.string().optional(),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
})

type OfferValues = z.infer<typeof offerSchema>

export function OfferForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [currentImage, setCurrentImage] = useState<string | null>(initialData?.image_url || null)
  const [pendingImage, setPendingImage] = useState<{file: File, previewUrl: string, compressed?: Blob} | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const previewUrl = URL.createObjectURL(file)
    setPendingImage({ file, previewUrl })
    
    // Attempt compression in background
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      const MAX_WIDTH = 1200
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        blob => {
          if (blob) setPendingImage(prev => prev ? { ...prev, compressed: blob } : null)
        },
        'image/jpeg',
        0.82
      )
    }
    img.src = previewUrl
  }

  function removeImage() {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl)
    setPendingImage(null)
    setCurrentImage(null)
  }
  
  const form = useForm<any>({
    resolver: zodResolver(offerSchema) as any,
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

  async function onSubmit(data: any) {
    setIsLoading(true)
    setError(null)
    
    const supabase = createClient()
    
    try {
      let finalImageUrl = currentImage
      
      // Upload new image if present
      if (pendingImage) {
        setUploadProgress('Uploading image...')
        const blob = pendingImage.compressed || pendingImage.file
        const path = `offers/${Date.now()}_offer.jpg` // We can use the 'products' bucket since policy allows it
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(path, blob, { contentType: 'image/jpeg' })
          
        if (uploadError) throw new Error('Image upload failed: ' + uploadError.message)
        
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(path)
        finalImageUrl = urlData.publicUrl
      }
      
      const submitData = {
        ...data,
        image_url: finalImageUrl
      }

      if (initialData?.id) {
        // Update
        const { error: dbError } = await supabase
          .from('offers')
          .update(submitData)
          .eq('id', initialData.id)
          
        if (dbError) throw new Error(dbError.message)
      } else {
        // Insert
        const { error: dbError } = await supabase
          .from('offers')
          .insert(submitData)
          
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

      <div className="space-y-4">
        <Label>Offer Image</Label>
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImagePick}
        />

        <div className="flex gap-4 items-start">
          {/* Add Image Button (hidden if image exists) */}
          {!(currentImage || pendingImage) && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">Add Image</span>
            </div>
          )}

          {/* Current / Pending Image Preview */}
          {(currentImage || pendingImage) && (
            <div className="relative group w-32 h-32 rounded-xl overflow-hidden border bg-gray-50">
              <img 
                src={pendingImage ? pendingImage.previewUrl : currentImage!} 
                alt="Offer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Offer Name * (e.g. "2 Shampoos + Gift")</Label>
          <Input id="name" {...form.register('name')} />
          {form.formState.errors.name?.message && <p className="text-sm text-red-500">{form.formState.errors.name.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity_included">Quantity Included *</Label>
          <Input id="quantity_included" type="number" min="1" {...form.register('quantity_included', { valueAsNumber: true })} />
          {form.formState.errors.quantity_included?.message && <p className="text-sm text-red-500">{form.formState.errors.quantity_included.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Offer Price (DA) *</Label>
          <Input id="price" type="number" step="0.01" {...form.register('price', { valueAsNumber: true })} />
          {form.formState.errors.price?.message && <p className="text-sm text-red-500">{form.formState.errors.price.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">Old Price (DA) [Optional]</Label>
          <Input id="old_price" type="number" step="0.01" {...form.register('old_price', { valueAsNumber: true })} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Percentage (%) [Optional]</Label>
          <Input id="discount" type="number" min="0" max="100" {...form.register('discount', { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input id="display_order" type="number" {...form.register('display_order', { valueAsNumber: true })} />
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
        <Button type="submit" disabled={isLoading} className="min-w-[140px] gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadProgress || 'Saving...'}
            </>
          ) : (
            initialData ? 'Update Offer' : 'Create Offer'
          )}
        </Button>
      </div>
    </form>
  )
}
