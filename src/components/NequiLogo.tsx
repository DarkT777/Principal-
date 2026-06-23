interface NequiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'dark' | 'light'
  className?: string
}

const SIZES = {
  sm: { dot: 6, text: 'text-xl', gap: 4 },
  md: { dot: 8, text: 'text-2xl', gap: 5 },
  lg: { dot: 10, text: 'text-3xl', gap: 6 },
  xl: { dot: 12, text: 'text-4xl', gap: 7 },
}

export function NequiLogo({ size = 'md', color = 'dark', className = '' }: NequiLogoProps) {
  const s = SIZES[size]
  const textColor = color === 'dark' ? '#2D1B6E' : '#ffffff'

  return (
    <div className={`flex items-start ${className}`}>
      {/* Small square dot - top left, beside the N */}
      <div className="flex flex-col" style={{ gap: s.gap }}>
        <svg
          width={s.dot}
          height={s.dot}
          viewBox="0 0 10 10"
          fill="none"
        >
          <rect width="10" height="10" rx="2" fill="#E6005C" />
        </svg>
      </div>
      <span
        className={`font-black tracking-tight leading-none ${s.text}`}
        style={{ color: textColor, marginLeft: s.gap }}
      >
        Nequi
      </span>
    </div>
  )
}
