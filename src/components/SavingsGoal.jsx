import { useEffect } from 'react'
import { Card, Field, Section, SectionHeading, inputClass, primaryButton, secondaryButton } from './ui.jsx'
import { formatNumber, formatVnd, parseAmount } from '../utils/money.js'
import tips from '../data/savings-tips.json'
import { useUserState } from '../utils/usePersistentState.js'
import Icon from './Icon.jsx'

const DEFAULT_FORM = { name: 'English Certificate Fund', target: '4,500,000', saved: '3,150,000', monthly: '600,000' }

function validate(form) {
  const errors = {}
  const target = parseAmount(form.target)
  const saved = parseAmount(form.saved)
  const monthly = parseAmount(form.monthly)
  if (!form.name.trim()) errors.name = 'Please give your goal a name.'
  const check = (text, value, allowZero) => {
    const t = String(text).trim()
    if (t === '') return 'This field is required.'
    if (t.startsWith('-')) return 'Negative numbers are not allowed.'
    if (Number.isNaN(value)) return 'Numbers only, e.g. 500000 or 500,000.'
    if (!allowZero && value <= 0) return 'Must be greater than 0.'
    return null
  }
  const targetErr = check(form.target, target, false)
  const savedErr = check(form.saved, saved, true)
  const monthlyErr = check(form.monthly, monthly, false)
  if (targetErr) errors.target = targetErr
  if (savedErr) errors.saved = savedErr
  if (monthlyErr) errors.monthly = monthlyErr
  return { errors, target, saved, monthly }
}

function addMonths(months) {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function MotivationTip({ percent }) {
  const tip = [...tips].reverse().find((t) => percent >= t.min)
  return (
    <p className="flex items-start gap-3 p-4 rounded-2xl bg-amber-100 text-amber-950 text-sm font-semibold" role="status">
      <Icon name={tip.icon} size={24} className="shrink-0" />
      <span>{tip.text}</span>
    </p>
  )
}

export default function SavingsGoal() {
  const [form, setForm] = useUserState('savings-goal', DEFAULT_FORM)
  const { errors, target, saved, monthly } = validate(form)
  const valid = Object.keys(errors).length === 0

  useEffect(() => {
    const onSync = (e) => setForm((f) => ({ ...f, monthly: formatNumber(e.detail.amount) }))
    window.addEventListener('bb:set-monthly-saving', onSync)
    return () => window.removeEventListener('bb:set-monthly-saving', onSync)
  }, [setForm])

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const remaining = valid ? Math.max(target - saved, 0) : 0
  const months = valid ? Math.ceil(remaining / monthly) : 0
  const percent = valid ? Math.min(100, Math.round((saved / target) * 100)) : 0
  const milestones = [25, 50, 75, 100]

  const addQuick = (amount) => {
    const current = Number.isNaN(parseAmount(form.saved)) ? 0 : parseAmount(form.saved)
    setForm({ ...form, saved: formatNumber(current + amount) })
  }

  return (
    <Section id="savings-goals" tone="low">
      <SectionHeading
        eyebrow="Savings tool"
        title="Savings Goals calculator"
        description="Set a goal, enter what you have saved and what you can put aside each month. Bee works out how much is left and how many months it will take."
        dot="bg-emerald-500"
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5">
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
            <Field label="Goal name" error={errors.name}>
              <input className={inputClass} value={form.name} onChange={update('name')} maxLength={60} />
            </Field>
            <Field label="Target amount (VND)" error={errors.target}>
              <input className={inputClass} inputMode="numeric" value={form.target} onChange={update('target')} />
            </Field>
            <Field label="Already saved (VND)" error={errors.saved}>
              <input className={inputClass} inputMode="numeric" value={form.saved} onChange={update('saved')} />
            </Field>
            <Field label="Saving per month (VND)" error={errors.monthly}>
              <input className={inputClass} inputMode="numeric" value={form.monthly} onChange={update('monthly')} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={primaryButton} onClick={() => addQuick(50000)}>+ Add 50k</button>
              <button type="button" className={secondaryButton} onClick={() => setForm(DEFAULT_FORM)}>Reset example</button>
            </div>
          </form>
        </Card>

        <Card className="lg:col-span-7 flex flex-col gap-6" >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon name="PiggyBank" size={24} className="text-amber-700" />
              <h3 className="font-heading text-lg text-slate-900 font-bold">{form.name.trim() || 'Your goal'}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full font-bold text-xs ${percent >= 100 ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
              {percent >= 100 ? 'Goal reached!' : 'Saving'}
            </span>
          </div>

          {valid ? (
            <>
              <div className="flex flex-col gap-2" aria-live="polite">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="text-emerald-700 font-bold">{formatVnd(saved)} / {formatVnd(target)} ({percent}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label="Savings progress">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-700 rounded-full transition-all duration-700" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="grid grid-cols-4 text-center text-xs text-slate-600 pt-1">
                  {milestones.map((m) => (
                    <div key={m} className={percent >= m ? 'text-emerald-700 font-bold' : ''}>
                      {m === 100 ? 'Goal' : `Hive ${m / 25}`} ({m}%)<br />
                      <Icon name={percent >= m ? 'CircleCheck' : 'Hourglass'} size={16} className="inline" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-xs text-slate-600">Still needed</p>
                  <p className="text-lg font-bold text-slate-900">{formatVnd(remaining)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-xs text-slate-600">Months needed</p>
                  <p className="text-lg font-bold text-slate-900">{months} {months === 1 ? 'month' : 'months'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-xs text-slate-600">Estimated finish</p>
                  <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
                    {remaining === 0 ? (<><Icon name="PartyPopper" size={18} /> Done</>) : addMonths(months)}
                  </p>
                </div>
              </div>
              <MotivationTip percent={percent} />
            </>
          ) : (
            <p className="text-sm text-slate-600">Fix the highlighted fields to see your plan.</p>
          )}
        </Card>
      </div>
    </Section>
  )
}
