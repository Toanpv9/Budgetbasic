import { useEffect, useState } from 'react'
import { Card, Field, Section, SectionHeading, inputClass, primaryButton, secondaryButton } from './ui.jsx'
import { formatNumber, formatVnd, parseAmount } from '../utils/money.js'
import { useUserState } from '../utils/usePersistentState.js'
import { Donut } from './BudgetSplit.jsx'
import { GROUPS } from '../utils/budgetGroups.js'
import Icon from './Icon.jsx'

const DEFAULT_RATIOS = { needs: 50, wants: 30, savings: 20 }
const PRESETS = [3500000, 5000000, 7000000]

function validateIncome(text) {
  if (String(text).trim() === '') return 'Please enter your monthly income.'
  const value = parseAmount(text)
  if (Number.isNaN(value)) {
    return String(text).trim().startsWith('-') ? 'Income cannot be negative.' : 'Please use numbers only (e.g. 5000000 or 5,000,000).'
  }
  if (value <= 0) return 'Income must be greater than 0.'
  return null
}

export default function Calculator503020() {
  const [incomeText, setIncomeText] = useUserState('income', '5,000,000')
  const [ratios, setRatios] = useUserState('ratios', DEFAULT_RATIOS)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const onSet = (e) => {
      setIncomeText(formatNumber(e.detail.income))
      setTouched(true)
    }
    window.addEventListener('bb:set-income', onSet)
    return () => window.removeEventListener('bb:set-income', onSet)
  }, [setIncomeText])

  const incomeError = validateIncome(incomeText)
  const income = incomeError ? 0 : parseAmount(incomeText)
  const ratioTotal = ratios.needs + ratios.wants + ratios.savings
  const ratioError = ratioTotal !== 100 ? `Percentages must add up to 100% (now ${ratioTotal}%).` : null
  const valid = !incomeError && !ratioError
  const amount = (key) => (income * ratios[key]) / 100

  const setRatio = (key) => (e) => {
    const value = Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0)))
    setRatios({ ...ratios, [key]: value })
  }

  const send = (event, detail, hash) => {
    if (!valid) return setTouched(true)
    window.dispatchEvent(new CustomEvent(event, { detail }))
    window.location.hash = hash
  }

  return (
    <Section id="50-30-20-calculator" tone="lowest">
      <SectionHeading
        eyebrow="Automatic budget tool"
        title="50 / 30 / 20 budget calculator"
        description="Enter your total monthly income (allowance + part-time job). Bee splits it into needs, wants and savings. You can adjust the percentages to fit your situation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 flex flex-col gap-5">
          <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setTouched(true) }} noValidate>
            <Field label="Monthly income (VND)" error={touched || incomeText !== '' ? incomeError : null}>
              <input
                id="monthly-income-input"
                className={inputClass}
                inputMode="numeric"
                value={incomeText}
                onChange={(e) => { setIncomeText(e.target.value); setTouched(true) }}
                aria-invalid={!!incomeError}
                placeholder="e.g. 5,000,000"
              />
            </Field>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-600">Quick picks:</span>
              {PRESETS.map((p) => (
                <button key={p} type="button" className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold hover:bg-slate-200" onClick={() => { setIncomeText(formatNumber(p)); setTouched(true) }}>
                  {(p / 1000000).toFixed(1)}M
                </button>
              ))}
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="font-heading text-sm text-slate-900 font-semibold mb-2">Split percentages (adjustable)</legend>
              {GROUPS.map((g) => (
                <label key={g.key} className="grid grid-cols-[5rem_1fr_4.5rem] items-center gap-3 text-sm">
                  <span className="flex items-center gap-1.5 font-semibold"><span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }}></span>{g.label}</span>
                  <input type="range" min="0" max="100" value={ratios[g.key]} onChange={setRatio(g.key)} aria-label={`${g.label} percentage`} className="w-full cursor-pointer" style={{ accentColor: g.color }} />
                  <span className="flex items-center gap-1">
                    <input type="number" min="0" max="100" value={ratios[g.key]} onChange={setRatio(g.key)} aria-label={`${g.label} percentage value`} className="w-14 px-2 py-1 rounded-4xl bg-slate-50 border border-slate-200 text-right" />%
                  </span>
                </label>
              ))}
              {ratioError && <span className="text-xs text-red-700 font-semibold" role="alert">{ratioError}</span>}
              <button type="button" className={`${secondaryButton} self-start`} onClick={() => setRatios(DEFAULT_RATIOS)}>Reset to 50/30/20</button>
            </fieldset>
          </form>
        </Card>

        <Card className="lg:col-span-7 flex flex-col gap-5" >
          {valid ? (
            <>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <Donut ratios={ratios} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-600">Total</span>
                    <span className="text-xl font-extrabold text-slate-900">{(income / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="flex-1 w-full flex flex-col gap-4" aria-live="polite">
                  {GROUPS.map((g) => (
                    <div key={g.key}>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-slate-900">{ratios[g.key]}% {g.label}</span>
                        <span className="font-extrabold text-slate-900">{formatVnd(amount(g.key))}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden my-1.5" role="progressbar" aria-valuenow={ratios[g.key]} aria-valuemin="0" aria-valuemax="100" aria-label={`${g.label} share`}>
                        <div className={`h-full rounded-full ${g.bar} transition-all duration-700`} style={{ width: `${ratios[g.key]}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-600">{g.examples}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 text-sm">
                <p className="flex items-center gap-1.5 font-bold text-slate-900 mb-1"><Icon name="Ruler" size={16} /> Formula</p>
                <ul className="flex flex-col gap-0.5 font-mono text-xs text-slate-600">
                  {GROUPS.map((g) => (
                    <li key={g.key}>{g.label} = {formatNumber(income)} × {ratios[g.key]}% = <strong className="text-slate-900">{formatVnd(amount(g.key))}</strong></li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" className={primaryButton} onClick={() => send('bb:set-budget', { budget: income }, '#/tools/expense-planner')}>
                  <Icon name="ReceiptText" size={18} /> Use as Expense Planner budget
                </button>
                <button type="button" className={secondaryButton} onClick={() => send('bb:set-monthly-saving', { amount: amount('savings') }, '#/tools/savings-goals')}>
                  <Icon name="PiggyBank" size={18} /> Send savings to Savings Goals
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600 py-10 text-center">Fix the highlighted field(s) on the left to see your split.</p>
          )}
          <p className="flex items-start gap-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
            <Icon name="Info" size={16} className="text-amber-700" />
            These results are estimates for learning only, not financial advice. The 50/30/20 split is a guideline: adjust the percentages to your real situation (e.g. high rent).
          </p>
        </Card>
      </div>
    </Section>
  )
}
