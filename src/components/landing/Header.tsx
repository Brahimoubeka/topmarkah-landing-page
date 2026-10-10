export function Header({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <header className="absolute top-10 sm:top-12 w-full z-40 flex items-center justify-between px-4 sm:px-6 py-4 pointer-events-none">
      {/* Left corner: Small Logo */}
      <div className="flex items-center pointer-events-auto">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-12 sm:h-16 w-auto object-contain drop-shadow-sm" />
        ) : (
          <div className="h-12 w-12 sm:h-16 sm:w-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-500 border border-gray-200/50 shadow-sm">
            شعار
          </div>
        )}
      </div>
      
      {/* Top Center: Grey phrase */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 sm:top-5">
        <span className="text-gray-400/80 font-medium text-xs sm:text-sm tracking-[0.2em] uppercase bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
          topmarkah
        </span>
      </div>
    </header>
  )
}
