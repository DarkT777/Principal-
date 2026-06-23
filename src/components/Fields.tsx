interface NumberFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  prefix?: string
  type?: 'tel' | 'text'
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  type = 'tel',
}: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '')
    onChange(cleaned)
  }

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-base pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-field ${prefix ? 'pl-12' : ''}`}
        />
      </div>
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  )
}
