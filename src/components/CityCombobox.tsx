import { useState, useRef, useMemo, useEffect } from 'react'
import { MapPin, Search, ChevronDown, CheckCircle2 } from 'lucide-react'
import { COLOMBIA_LOCATIONS } from '../types'

interface CityComboboxProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function CityCombobox({ label, value, onChange }: CityComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filled = value.length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COLOMBIA_LOCATIONS

    return COLOMBIA_LOCATIONS.map((dept) => {
      const matches = dept.cities.filter((c) => c.trim().toLowerCase().includes(q))
      const deptMatches = dept.department.toLowerCase().includes(q)
      if (matches.length === 0 && !deptMatches) return null
      return { ...dept, cities: matches.length > 0 ? matches : dept.cities }
    }).filter((d): d is typeof COLOMBIA_LOCATIONS[number] => d !== null)
  }, [query])

  const totalResults = useMemo(
    () => filtered.reduce((acc, d) => acc + d.cities.length, 0),
    [filtered]
  )

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setFocused(true)
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setFocused(false)
    }
  }, [open])

  function handleSelect(city: string) {
    onChange(city.trim())
    setOpen(false)
    setFocused(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

  function handleToggle() {
    setOpen((o) => !o)
    setFocused((f) => !f)
  }

  return (
    <div ref={containerRef} className="space-y-1">
      <div
        onClick={handleToggle}
        className={`relative bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer ${
          open
            ? 'border-[#2D1B6E] bg-gray-100 shadow-md'
            : focused
            ? 'border-gray-300'
            : filled
            ? 'border-gray-300'
            : 'border-gray-200'
        }`}
      >
        <label
          className={`absolute left-5 transition-all duration-200 pointer-events-none font-medium ${
            focused || filled
              ? 'top-2 text-[11px] text-[#2D1B6E]'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
          }`}
        >
          <span className="inline-block mr-1.5 align-middle">
            <MapPin className="w-3.5 h-3.5 inline" />
          </span>
          {label}
        </label>

        <div className="flex items-center mt-4">
          <span className={`flex-1 text-base ${filled ? 'text-gray-900' : ''}`}>
            {filled ? value : ''}
          </span>

          {filled && !open && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors mr-1"
              aria-label="Limpiar"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </button>
          )}

          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
              open ? 'text-[#2D1B6E] rotate-180' : filled ? 'text-[#2D1B6E]' : 'text-gray-400'
            }`}
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-dropdown">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar ciudad o municipio..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-[#2D1B6E]/50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto custom-scrollbar">
            {totalResults === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-gray-500 text-sm">No se encontraron resultados</p>
                <p className="text-gray-400 text-xs mt-1">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            ) : (
              filtered.map((dept) => (
                <div key={dept.department} className="pb-1">
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-5 py-2 text-[11px] font-bold text-[#2D1B6E] uppercase tracking-wider border-b border-gray-100">
                    {dept.department}
                  </div>
                  {dept.cities.map((city, idx) => {
                    const trimmed = city.trim()
                    const isSelected = trimmed === value
                    return (
                      <button
                        key={`${dept.department}-${trimmed}-${idx}`}
                        onClick={() => handleSelect(trimmed)}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#2D1B6E]/10 text-gray-900 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="truncate">{trimmed}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2D1B6E] flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-5 py-2 bg-gray-50 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
