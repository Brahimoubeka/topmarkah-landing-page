import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch basic stats
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  
  const { data: statusCounts } = await supabase
    .from('orders')
    .select('status')
    
  // Calculate specific statuses
  const pending = statusCounts?.filter(o => o.status === 'pending').length || 0
  const confirmed = statusCounts?.filter(o => o.status === 'confirmed').length || 0
  const shipped = statusCounts?.filter(o => o.status === 'shipped').length || 0
  const delivered = statusCounts?.filter(o => o.status === 'delivered').length || 0
  const cancelled = statusCounts?.filter(o => o.status === 'cancelled').length || 0

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, customer_name, total_price, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { name: 'Total Orders', value: totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Pending', value: pending, icon: Clock, color: 'text-amber-500' },
    { name: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-emerald-500' },
    { name: 'Shipped', value: shipped, icon: Truck, color: 'text-purple-500' },
    { name: 'Delivered', value: delivered, icon: Package, color: 'text-teal-600' },
    { name: 'Cancelled', value: cancelled, icon: XCircle, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Customer</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-tr-lg text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium text-gray-900">{order.customer_name}</td>
                        <td className="px-4 py-3">{order.total_price} DA</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
