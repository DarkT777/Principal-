import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, CheckCircle2, Search, UserCheck, Wallet, Sparkles } from 'lucide-react'
import { ScreenShell } from './ScreenShell'

interface VerificationScreenProps {
  onComplete: () => void
}

const DURATION = 8 // Reducido a 8 segundos

const VERIFICATION_STEPS = [
  { id: 0, label: 'Consultando centrales de riesgo...', duration: 2, icon: Search },
  { id: 1, label: 'Verificando identidad...', duration: 2, icon: UserCheck },
  { id: 2, label: 'Validando capacidad de pago...', duration: 2, icon: Wallet },
  { id: 3, label: 'Generando resultado...', duration: 2, icon: Sparkles },
]

export function VerificationScreen({ onComplete }: VerificationScreenProps) {
  const [remaining, setRemaining] = useState(DURATION)
  const [currentStep, setCurrentStep] = useState(0)
  const progress = ((DURATION - remaining) / DURATION) * 100

  useEffect(() => {
    // Calculate which step we're on based on remaining time
    let acc = 0
    for (let i = 0; i < VERIFICATION_STEPS.length; i++) {
      acc += VERIFICATION_STEPS[i].duration
      if (DURATION - remaining < acc) {
        setCurrentStep(i)
        break
      }
    }
  }, [remaining])

  useEffect(() => {
    if (remaining <= 0) {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
    const interval = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 0.1))
    }, 100)
    return () => clearInterval(interval)
  }, [remaining, onComplete])

  return (
    <ScreenShell>
      <div className="flex flex-col items-center text-center animate-slide-up">
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-[#E6005C]/10 animate-ping" />
          <div className="absolute inset-3 rounded-full bg-[#E6005C]/20 animate-pulse-soft" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#E6005C] to-[#ff4d8f] flex items-center justify-center shadow-lg">
            <Loader2 className="w-9 h-9 text-white animate-spin" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-gray-900">Validando información...</h1>
        <p className="text-gray-500 mb-8 max-w-xs">
          Estamos verificando tus datos y consultando tu historial. Esto solo tomará unos segundos.
        </p>

        {/* Dynamic steps */}
        <div className="w-full max-w-sm mb-6 space-y-2">
          {VERIFICATION_STEPS.map((step, index) => {
            const isActive = index === currentStep
            const isComplete = DURATION - remaining >= VERIFICATION_STEPS.slice(0, index).reduce((acc, s) => acc + s.duration, 0) + step.duration

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#E6005C]/10 border border-[#E6005C]/30'
                    : isComplete
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isComplete
                    ? 'bg-green-500'
                    : isActive
                    ? 'bg-[#E6005C]'
                    : 'bg-gray-200'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : isActive ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <step.icon className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  isComplete
                    ? 'text-green-600'
                    : isActive
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm mb-3">
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E6005C] to-[#ff4d8f] rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>{Math.max(0, Math.ceil(remaining))} segundos restantes</span>
        </div>
      </div>
    </ScreenShell>
  )
}
