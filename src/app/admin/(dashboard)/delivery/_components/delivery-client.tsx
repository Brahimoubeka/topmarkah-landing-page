'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Save, Check } from 'lucide-react'

export function DeliveryClient({ initialWilayas, initialCompanies, initialPrices }: any) {
  const [wilayas, setWilayas] = useState(initialWilayas)
  const [prices, setPrices] = useState(initialPrices)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaving, setIsSaving] = useState<string | null>(null)
  
  // For simplicity, we just use the first default company, or first available company
  const defaultCompany = initialCompanies.find((c: any) => c.is_default) || initialCompanies[0]
  
  const supabase = createClient()

  const filteredWilayas = wilayas.filter((w: any) => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.code.toString().includes(searchTerm)
  )

  function getPriceInfo(wilayaId: string) {
    if (!defaultCompany) return { home_price: 0, office_price: 0, id: null }
    const p = prices.find((p: any) => p.wilaya_id === wilayaId && p.company_id === defaultCompany.id)
    return p || { home_price: 0, office_price: 0, id: null }
  }

  function handlePriceChange(wilayaId: string, field: 'home_price' | 'office_price', value: string) {
    const numValue = parseFloat(value) || 0
    
    // Check if price exists
    const pInfo = getPriceInfo(wilayaId)
    if (pInfo.id) {
      // Update existing in state
      setPrices(prices.map((p: any) => p.id === pInfo.id ? { ...p, [field]: numValue } : p))
    } else {
      // Create new in state temporarily
      const newPrice = {
        id: `temp-${wilayaId}`,
        wilaya_id: wilayaId,
        company_id: defaultCompany.id,
        home_price: field === 'home_price' ? numValue : 0,
        office_price: field === 'office_price' ? numValue : 0,
        is_active: true
      }
      setPrices([...prices, newPrice])
    }
  }

  async function saveWilayaPrice(wilayaId: string) {
    if (!defaultCompany) return
    setIsSaving(wilayaId)
    
    const pInfo = prices.find((p: any) => p.wilaya_id === wilayaId && p.company_id === defaultCompany.id)
    if (!pInfo) return setIsSaving(null)
    
    if (pInfo.id && !pInfo.id.startsWith('temp-')) {
      await supabase.from('delivery_prices').update({
        home_price: pInfo.home_price,
        office_price: pInfo.office_price
      }).eq('id', pInfo.id)
    } else {
      const { data, error } = await supabase.from('delivery_prices').insert({
        wilaya_id: wilayaId,
        company_id: defaultCompany.id,
        home_price: pInfo.home_price,
        office_price: pInfo.office_price,
        is_active: true
      }).select().single()
      
      if (data) {
        setPrices(prices.map((p: any) => p.id === pInfo.id ? data : p))
      }
    }
    
    setIsSaving(null)
  }

  async function toggleWilayaActive(wilayaId: string, isActive: boolean) {
    await supabase.from('wilayas').update({ is_active: isActive }).eq('id', wilayaId)
    setWilayas(wilayas.map((w: any) => w.id === wilayaId ? { ...w, is_active: isActive } : w))
  }

  if (!defaultCompany) {
    return <div className="text-red-500">No delivery company found in database. Please create one in SQL.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center mb-4">
        <h2 className="text-lg font-medium">Pricing for: <span className="font-bold text-blue-600">{defaultCompany.name}</span></h2>
        <div className="relative flex-1 max-w-sm ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Wilaya..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-16">Code</th>
              <th className="px-4 py-3">Wilaya</th>
              <th className="px-4 py-3 w-24 text-center">Active</th>
              <th className="px-4 py-3 w-32">Home (DA)</th>
              <th className="px-4 py-3 w-32">Office (DA)</th>
              <th className="px-4 py-3 w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredWilayas.map((wilaya: any) => {
              const price = getPriceInfo(wilaya.id)
              return (
                <tr key={wilaya.id} className={`hover:bg-gray-50 ${!wilaya.is_active ? 'opacity-50 bg-gray-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{wilaya.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{wilaya.name}</td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                      checked={wilaya.is_active}
                      onChange={(e) => toggleWilayaActive(wilaya.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      type="number" 
                      className="h-8 p-1 text-center" 
                      value={price.home_price} 
                      onChange={(e) => handlePriceChange(wilaya.id, 'home_price', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      type="number" 
                      className="h-8 p-1 text-center" 
                      value={price.office_price} 
                      onChange={(e) => handlePriceChange(wilaya.id, 'office_price', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 px-2"
                      disabled={isSaving === wilaya.id}
                      onClick={() => saveWilayaPrice(wilaya.id)}
                    >
                      {isSaving === wilaya.id ? <Save className="h-4 w-4 animate-pulse text-blue-500" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
