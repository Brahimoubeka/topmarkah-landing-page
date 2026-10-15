export function Header({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <header className="relative w-full z-40 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white border-b border-gray-100/80">
      {/* Left corner: Small Logo */}
      <div className="flex items-center">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-9 sm:h-12 w-auto object-contain drop-shadow-sm" />
        ) : (
          <div className="h-9 w-9 sm:h-12 sm:w-12 bg-gray-50 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-400 border border-gray-200/60 shadow-sm">
            شعار
          </div>
        )}
      </div>
      
      {/* Top Center: Grey phrase */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <span className="text-gray-400 font-medium text-xs sm:text-sm tracking-[0.2em] uppercase bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          topmarkah
        </span>
      </div>
    </header>
  )
}
