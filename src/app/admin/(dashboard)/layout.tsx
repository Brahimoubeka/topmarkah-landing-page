'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Monitor, 
  Truck, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Offers', href: '/admin/offers', icon: Tags },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Landing Page', href: '/admin/landing-page', icon: Monitor },
  { name: 'Delivery', href: '/admin/delivery', icon: Truck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-slate-950">
          <span className="text-xl font-bold text-white tracking-wide">TopMarkah</span>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== '/admin'
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 shrink-0",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-white" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end">
            <span className="text-sm font-medium text-gray-700">Admin Dashboard</span>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
