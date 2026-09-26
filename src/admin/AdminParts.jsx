import Icon from '../components/Icon.jsx'
import { useAnchor } from '../anchors.js'

export function Panel({ id, title, icon, subtitle, actions, children, className = '' }) {
  const anchor = useAnchor(id)
  return (
    <section id={id} ref={anchor} className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 scroll-mt-24 ${className}`}>
      {title && (
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            {icon && <span className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 text-emerald-950 flex items-center justify-center"><Icon name={icon} size={20} /></span>}
            <div>
              <h2 className="font-heading text-xl text-slate-900 font-bold">{title}</h2>
              {subtitle && <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

const TONES = {
  green: 'bg-emerald-100 text-emerald-950',
  amber: 'bg-amber-100 text-amber-950',
  blue: 'bg-blue-100 text-blue-950',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-slate-300 text-slate-600',
}

export const Pill = ({ tone = 'gray', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${TONES[tone]} ${className}`}>{children}</span>
)

export function Btn({ tone = 'soft', icon, children, className = '', ...props }) {
  const styles = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-500 hover:text-emerald-900',
    soft: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-red-700 text-white hover:opacity-90',
    dangerSoft: 'text-red-700 hover:bg-red-100',
    amber: 'bg-amber-400 text-amber-900 hover:brightness-95',
  }
  return (
    <button type="button" className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${styles[tone]} ${className}`} {...props}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  )
}

export function Kpi({ label, value, icon, hint, tone = 'green' }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{label}</p>
        <span className={`w-8 h-8 rounded-5xl flex items-center justify-center ${TONES[tone]}`}><Icon name={icon} size={16} /></span>
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  )
}

export const Stars = ({ value }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon key={n} name="Star" size={14} className={n <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'} />
    ))}
  </span>
)

export function Initials({ name, tone = 'green' }) {
  const text = name.split(' ').filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase()
  return <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${TONES[tone]}`}>{text}</span>
}

export function LineChart({ points }) {
  const w = 600
  const h = 220
  const pad = 30
  const max = Math.max(1, ...points.map((p) => p.value))
  const x = (i) => pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1)
  const y = (v) => h - pad - (v / max) * (h - pad * 2)
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ')
  const area = `${path} L${x(points.length - 1)},${h - pad} L${x(0)},${h - pad} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={`Logins: ${points.map((p) => `${p.label} ${p.value}`).join(', ')}`}>
      <defs>
        <linearGradient id="loginFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={y(max * t)} y2={y(max * t)} stroke="#e2e7ff" strokeDasharray="4 4" />
      ))}
      <path d={area} fill="url(#loginFill)" />
      <path d={path} fill="none" stroke="#006c49" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={x(i)} cy={y(p.value)} r={i === points.length - 1 ? 7 : 5} fill={i === points.length - 1 ? '#10b981' : '#fea619'} stroke="#fff" strokeWidth="2" />
          <text x={x(i)} y={y(p.value) - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#131b2e">{p.value}</text>
          <text x={x(i)} y={h - 8} textAnchor="middle" fontSize="12" fill="#3c4a42">{p.label}</text>
        </g>
      ))}
    </svg>
  )
}
