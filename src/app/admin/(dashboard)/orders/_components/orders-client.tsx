'use client'

import { useState, Fragment } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, ChevronUp, Package, CheckCircle2, Copy } from 'lucide-react'

type Order = any // We can refine this type later

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const supabase = createClient()

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
    setUpdating(null)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search name, phone, ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Order ID / Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Offer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Fragment key={order.id}>
                  <tr className={`hover:bg-gray-50 transition-colors ${expandedOrder === order.id ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
                      >
                        {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{order.id.split('-')[0]}...</div>
                      <div className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-gray-500">{order.phone}</div>
                      <div className="text-gray-500 text-xs">{order.wilaya_name_snapshot} ({order.delivery_method})</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.offer_name_snapshot}</div>
                      <div className="text-gray-500 text-xs">Qty: {order.quantity}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.total_price} DA</div>
                      <div className="text-gray-500 text-xs">Del: {order.delivery_price} DA</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 ring-1 ring-inset ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800 ring-green-600/20' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800 ring-red-600/20' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 ring-yellow-600/20' :
                          'bg-blue-100 text-blue-800 ring-blue-600/20'
                        }`}
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                  
                  {/* EXPANDED DETAILS */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 bg-gray-50 border-b border-gray-200">
                        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-2">
                          <div className="flex justify-between items-center border-b pb-2">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Package className="w-5 h-5 text-blue-500" />
                              Order Details
                            </h4>
                            <button
                              onClick={() => {
                                const text = `Order Code: ${order.id.split('-')[0]}
Name: ${order.customer_name}
Phone: ${order.phone}
City: ${order.wilaya_name_snapshot}
Delivery: ${order.delivery_method === 'home' ? 'Home' : 'Office (Stop Desk)'}
Offer: ${order.offer_name_snapshot}
Quantity: ${order.quantity}
Delivery Price: ${order.delivery_price} DA
Total Order: ${order.total_price} DA`;
                                navigator.clipboard.writeText(text);
                                alert('Order copied to clipboard!');
                              }}
                              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium active:scale-95"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Copy Details
                            </button>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Customer Info Card */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                              <h5 className="text-sm font-bold text-gray-700 mb-3">Customer Information</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{order.customer_name}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900" dir="ltr">{order.phone}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Wilaya:</span> <span className="font-medium text-gray-900">{order.wilaya_name_snapshot}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-900">{order.address || 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Delivery:</span> <span className="font-medium text-gray-900">{order.delivery_method === 'home' ? 'Home Delivery' : 'Stop Desk (Office)'}</span></div>
                              </div>
                            </div>

                            {/* Offer Snapshot Card (Similar to Landing Page) */}
                            {order.offers ? (
                              <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                                
                                <h5 className="text-sm font-bold text-blue-900 mb-3">Selected Offer Details</h5>
                                
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-bold text-gray-900 text-lg leading-tight">{order.offers.name}</span>
                                </div>
                                <p className="text-gray-600 text-sm whitespace-pre-line mb-4">{order.offers.short_description}</p>
                                
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-center text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                                    <span>Included Quantity: <span className="font-bold">{order.offers.quantity_included}</span> (Ordered x{order.quantity})</span>
                                  </li>
                                  {order.offers.gifts && (
                                    <li className="flex items-center text-gray-700">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                                      <span>Gifts: {order.offers.gifts}</span>
                                    </li>
                                  )}
                                  {order.offers.full_description && (
                                    <li className="flex items-start text-gray-700 mt-2">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                                      <span className="whitespace-pre-line text-xs">{order.offers.full_description}</span>
                                    </li>
                                  )}
                                </ul>

                                <div className="mt-4 pt-4 border-t border-blue-200 flex items-baseline gap-2">
                                  <span className="text-xl font-bold text-blue-600">{order.offers.price} DA</span>
                                  {order.offers.old_price > 0 && <span className="text-sm text-gray-400 line-through">{order.offers.old_price} DA</span>}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 text-sm italic">
                                Offer details unavailable (Offer may have been deleted)
                              </div>
                            )}
                          </div>
                          
                          {/* Payment Summary */}
                          <div className="bg-gray-900 text-white rounded-xl p-5 shadow-sm">
                            <h5 className="text-sm font-bold text-gray-300 mb-3 border-b border-gray-700 pb-2">Payment Summary</h5>
                            <div className="space-y-1 text-sm max-w-sm ml-auto">
                              <div className="flex justify-between items-center text-gray-400">
                                <span>Offer Price ({order.quantity}x):</span>
                                <span>{(order.total_price - order.delivery_price)} DA</span>
                              </div>
                              <div className="flex justify-between items-center text-gray-400">
                                <span>Delivery Fee:</span>
                                <span>{order.delivery_price} DA</span>
                              </div>
                              <div className="flex justify-between items-center font-bold text-emerald-400 text-base pt-2 mt-2 border-t border-gray-700">
                                <span>Total:</span>
                                <span>{order.total_price} DA</span>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
