import React from 'react'

export function SectionConnector() {
  return (
    <div 
      className="relative w-full flex flex-col items-center justify-center my-[-18px] sm:my-[-24px] z-20 pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Top fading beam */}
      <div className="w-[2px] h-6 sm:h-9 bg-gradient-to-b from-transparent via-primary/30 to-primary/60"></div>

      {/* Glowing Journey Node / Dot */}
      <div className="relative flex items-center justify-center my-[-1px]">
        {/* Ambient pulse glow */}
        <div className="absolute w-6 h-6 rounded-full bg-primary/15 animate-ping opacity-75"></div>
        <div className="absolute w-4 h-4 rounded-full bg-primary/20 animate-pulse"></div>
        {/* Core shiny dot */}
        <div className="relative w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white shadow-[0_0_12px_rgba(37,99,235,0.5)]"></div>
      </div>

      {/* Bottom fading beam */}
      <div className="w-[2px] h-6 sm:h-9 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent"></div>
    </div>
  )
}
