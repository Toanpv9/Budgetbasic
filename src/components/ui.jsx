import Icon from './Icon.jsx'
import { useAnchor } from '../anchors.js'

export function Section({ id, tone = 'lowest', children }) {
  const anchor = useAnchor(id)
  const bg = tone === 'low' ? 'bg-slate-50' : 'bg-white'
  return (
    <section id={id} ref={anchor} className={`w-full ${bg} py-16 lg:py-20 border-b border-slate-200`}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, description, dot = 'bg-amber-400' }) {
  return (
    <div className="flex flex-col gap-2 mb-10 max-w-3xl">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`}></span>
        <span className="font-heading text-xs text-amber-700 uppercase tracking-wider font-bold">{eyebrow}</span>
      </div>
      <h2 className="font-heading text-2xl lg:text-3xl text-slate-900 font-bold">{title}</h2>
      {description && <p className="font-body text-base text-slate-600 leading-relaxed">{description}</p>}
    </div>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-heading text-sm text-slate-900 font-semibold">{label}</span>
      {children}
      {error && (
        <span className="text-xs text-red-700 font-semibold flex items-center gap-1" role="alert">
          <Icon name="CircleAlert" size={16} />
          {error}
        </span>
      )}
    </label>
  )
}

export const inputClass =
  'w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-body focus:outline-none focus:ring-2 focus:ring-emerald-500'

export const primaryButton =
  'inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-500 text-white hover:text-emerald-900 font-semibold text-sm shadow-sm transition-all'

export const secondaryButton =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold text-sm transition-colors'
