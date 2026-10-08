'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DeleteButton({ table, id }: { table: string, id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    const { error } = await supabase.from(table).delete().eq('id', id)
    
    if (error) {
      alert(`Failed to delete: ${error.message}`)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
      title="Delete"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      <span className="sr-only">Delete</span>
    </button>
  )
}
