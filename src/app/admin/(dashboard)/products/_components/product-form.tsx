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
import { ImagePlus, Trash2, PlayCircle, X, Loader2 } from 'lucide-react'

const MAX_IMAGES = 7
const MAX_WIDTH = 1200
const JPEG_QUALITY = 0.82

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format (lowercase letters, numbers, and hyphens only)'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  old_price: z.coerce.number().min(0).optional().or(z.literal(0)),
  short_description: z.string().optional(),
  description: z.string().optional(),
  benefits: z.string().optional(),
  specifications: z.string().optional(),
  usage_instructions: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
})

type ProductValues = z.infer<typeof productSchema>

type ExistingMedia = {
  id: string
  media_url: string
  media_type: 'image' | 'video' | 'youtube'
  display_order: number
}

type PendingImage = {
  file: File
  previewUrl: string
  compressed?: Blob
}

// ── Image compression using Canvas ──────────────────────────────────────────
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
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
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/jpeg',
        JPEG_QUALITY
      )
    }
    img.onerror = reject
    img.src = url
  })
}

// ── Extract YouTube video ID ─────────────────────────────────────────────────
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function ProductForm({ initialData, existingMedia = [] }: { 
  initialData?: any
  existingMedia?: ExistingMedia[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  // Media state
  const [currentMedia, setCurrentMedia] = useState<ExistingMedia[]>(existingMedia)
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([])
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [youtubeUrl, setYoutubeUrl] = useState<string>(
    existingMedia.find(m => m.media_type === 'youtube')?.media_url || ''
  )
  const [youtubePreviewId, setYoutubePreviewId] = useState<string | null>(
    existingMedia.find(m => m.media_type === 'youtube')
      ? extractYouTubeId(existingMedia.find(m => m.media_type === 'youtube')!.media_url)
      : null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      price: 0,
      old_price: 0,
      short_description: '',
      description: '',
      benefits: '',
      specifications: '',
      usage_instructions: '',
      seo_title: '',
      seo_description: '',
      is_active: true,
      is_featured: false,
    },
  })

  // ── Existing media handlers ──────────────────────────────────────────────
  function removeExistingMedia(id: string) {
    setDeletedMediaIds(prev => [...prev, id])
    setCurrentMedia(prev => prev.filter(m => m.id !== id))
  }

  // ── Pending images handlers ──────────────────────────────────────────────
  const imageCount = currentMedia.filter(m => m.media_type === 'image').length + pendingImages.length

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    e.target.value = ''

    const remaining = MAX_IMAGES - imageCount
    const toProcess = files.slice(0, remaining)

    const newPending: PendingImage[] = []
    for (const file of toProcess) {
      const previewUrl = URL.createObjectURL(file)
      newPending.push({ file, previewUrl })
    }
    // Compress in background
    const withCompressed = await Promise.all(
      newPending.map(async p => ({
        ...p,
        compressed: await compressImage(p.file).catch(() => p.file),
      }))
    )
    setPendingImages(prev => [...prev, ...withCompressed])
  }

  function removePendingImage(index: number) {
    setPendingImages(prev => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  // ── YouTube handlers ──────────────────────────────────────────────────────
  function handleYoutubeChange(val: string) {
    setYoutubeUrl(val)
    const id = extractYouTubeId(val)
    setYoutubePreviewId(id)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: ProductValues) {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      let productId = initialData?.id

      if (productId) {
        const { error: dbError } = await supabase.from('products').update(data).eq('id', productId)
        if (dbError) throw new Error(dbError.message)
      } else {
        const { data: created, error: dbError } = await supabase.from('products').insert(data).select().single()
        if (dbError) throw new Error(dbError.message)
        productId = created.id
      }

      // ── Delete removed existing media ──
      for (const id of deletedMediaIds) {
        await supabase.from('product_media').delete().eq('id', id)
      }

      // ── Handle YouTube URL ──
      const existingYT = existingMedia.find(m => m.media_type === 'youtube')
      const newYTId = extractYouTubeId(youtubeUrl)
      const currentYT = currentMedia.find(m => m.media_type === 'youtube')

      if (!currentYT && existingYT) {
        // was deleted already via removeExistingMedia
      }
      if (youtubeUrl.trim() && newYTId) {
        // Upsert YouTube entry
        if (existingYT && !deletedMediaIds.includes(existingYT.id)) {
          await supabase.from('product_media').update({ media_url: youtubeUrl.trim() }).eq('id', existingYT.id)
        } else if (!existingYT || deletedMediaIds.includes(existingYT?.id || '')) {
          await supabase.from('product_media').insert({
            product_id: productId,
            media_url: youtubeUrl.trim(),
            media_type: 'youtube',
            display_order: 0,
          })
        }
      }

      // ── Upload new images ──
      let order = currentMedia.filter(m => m.media_type === 'image').length
      for (let i = 0; i < pendingImages.length; i++) {
        const pending = pendingImages[i]
        setUploadProgress(`Uploading image ${i + 1} of ${pendingImages.length}...`)
        const blob = pending.compressed || pending.file
        const ext = 'jpg'
        const path = `products/${productId}/${Date.now()}_${i}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
        if (uploadError) throw new Error('Image upload failed: ' + uploadError.message)

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(path)
        await supabase.from('product_media').insert({
          product_id: productId,
          media_url: urlData.publicUrl,
          media_type: 'image',
          display_order: order++,
        })
      }

      setUploadProgress(null)
      router.push('/admin/products')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'An error occurred while saving the product.')
    } finally {
      setIsLoading(false)
      setUploadProgress(null)
    }
  }

  const existingImages = currentMedia.filter(m => m.media_type === 'image')

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm font-medium">{error}</div>
      )}

      {/* ── MEDIA SECTION ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800">📸 Product Media</h3>
          <p className="text-xs text-gray-500 mt-0.5">Upload up to {MAX_IMAGES} images (auto-compressed). Add a YouTube link to show a video above images.</p>
        </div>

        {/* YouTube URL */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-sm">
            <PlayCircle className="w-4 h-4 text-red-500" />
            YouTube Video URL (optional)
          </Label>
          <div className="flex gap-2">
            <Input
              value={youtubeUrl}
              onChange={e => handleYoutubeChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              dir="ltr"
              className="font-mono text-sm"
            />
            {youtubeUrl && (
              <button type="button" onClick={() => { setYoutubeUrl(''); setYoutubePreviewId(null) }}
                className="p-2 rounded-md hover:bg-red-50 text-red-400 border border-gray-200">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {youtubePreviewId && (
            <div className="mt-2 rounded-xl overflow-hidden aspect-video max-w-sm border border-gray-200">
              <iframe
                src={`https://www.youtube.com/embed/${youtubePreviewId}`}
                className="w-full h-full"
                allowFullScreen
                title="YouTube preview"
              />
            </div>
          )}
          {youtubeUrl && !youtubePreviewId && (
            <p className="text-xs text-red-500">⚠️ Could not parse YouTube URL. Please paste a valid YouTube link.</p>
          )}
        </div>

        {/* Image grid */}
        <div>
          <Label className="text-sm mb-2 block">Images ({imageCount}/{MAX_IMAGES})</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Existing images */}
            {existingImages.map(m => (
              <div key={m.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img src={m.media_url} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingMedia(m.id)}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-1.5">
                  <span className="text-white text-xs font-medium">Saved</span>
                </div>
              </div>
            ))}

            {/* Pending images */}
            {pendingImages.map((p, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-blue-200 bg-blue-50">
                <img src={p.previewUrl} alt="Pending" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePendingImage(i)}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-blue-600/50 to-transparent p-1.5">
                  <span className="text-white text-xs font-medium">New ✓</span>
                </div>
              </div>
            ))}

            {/* Add button */}
            {imageCount < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
              >
                <ImagePlus className="w-7 h-7" />
                <span className="text-xs font-medium">Add Image</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagePick}
          />
          {imageCount >= MAX_IMAGES && (
            <p className="text-xs text-amber-600 mt-1">Maximum {MAX_IMAGES} images reached.</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" {...form.register('name')} placeholder="e.g. Premium Shampoo" />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL snippet) *</Label>
            <Input id="slug" {...form.register('slug')} placeholder="e.g. premium-shampoo" dir="ltr" />
            {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (DA) *</Label>
            <Input id="price" type="number" step="0.01" {...form.register('price')} />
            {form.formState.errors.price && <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="old_price">Old Price (DA) [Optional]</Label>
            <Input id="old_price" type="number" step="0.01" {...form.register('old_price')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">Short Description</Label>
          <textarea
            id="short_description"
            {...form.register('short_description')}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="A brief summary of the product."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <textarea
            id="description"
            {...form.register('description')}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Detailed description of the product."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <textarea
              id="benefits"
              {...form.register('benefits')}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_instructions">Usage Instructions</Label>
            <textarea
              id="usage_instructions"
              {...form.register('usage_instructions')}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 border rounded-md p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" {...form.register('is_active')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
            <Label htmlFor="is_active">Active (Visible to customers)</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_featured" {...form.register('is_featured')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
            <Label htmlFor="is_featured">Featured Product</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          disabled={isLoading}
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
            initialData ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  )
}
