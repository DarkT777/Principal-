import { type ReactNode } from 'react'

interface ScreenShellProps {
  children: ReactNode
  onBack?: () => void
}

export function ScreenShell({ children, onBack }: ScreenShellProps) {
  return (
    <div className="min-h-full w-full flex flex-col bg-white">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
          aria-label="Volver"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      )}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto w-full">
        {children}
      </div>
    </div>
  )
}
