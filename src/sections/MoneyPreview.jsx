import { Card, Section, SectionHeading, inputClass, primaryButton, secondaryButton } from '../components/ui.jsx'
import { formatVnd, parseAmount } from '../utils/money.js'
import { useUserState } from '../utils/usePersistentState.js'
import { Donut } from '../components/BudgetSplit.jsx'
import { GROUPS } from '../utils/budgetGroups.js'
import plannerData from '../data/expense-planner.json'
import Icon from '../components/Icon.jsx'

const FIXED_RATIOS = { needs: 50, wants: 30, savings: 20 }
const PREVIEW_EXPENSES = plannerData.sampleExpenses.slice(0, 4)
const PREVIEW_BUDGET = plannerData.defaultBudget

function PreviewBadge({ children }) {
  return <span className="text-xs font-bold uppercase tracking-wider text-amber-700 whitespace-nowrap">{children}</span>
}

function SplitPreview() {
  const [incomeText, setIncomeText] = useUserState('income', '5,000,000')
  const income = parseAmount(incomeText) || 0
  const amount = (key) => (income * FIXED_RATIOS[key]) / 100

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg text-slate-900 font-bold">50/30/20 split</h3>
          <p className="text-sm text-slate-600">Type your income to see a fixed 50/30/20 split.</p>
        </div>
        <PreviewBadge>Fixed preview</PreviewBadge>
      </div>

      <input
        className={inputClass}
        inputMode="numeric"
        value={incomeText}
        onChange={(e) => setIncomeText(e.target.value)}
        aria-label="Monthly income (VND)"
        placeholder="e.g. 5,000,000"
      />

      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative shrink-0">
          <Donut ratios={FIXED_RATIOS} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-600">Total</span>
            <span className="text-lg font-extrabold text-slate-900">{(income / 1000000).toFixed(1)}M</span>
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2.5">
          {GROUPS.map((g) => (
            <div key={g.key} className="flex justify-between items-baseline gap-2 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }}></span>
                {FIXED_RATIOS[g.key]}% {g.label}
              </span>
              <span className="font-bold text-slate-900 whitespace-nowrap">{formatVnd(amount(g.key))}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-200">
        <a href="#/tools/50-30-20-calculator" className={primaryButton}>
          <Icon name="SlidersHorizontal" size={18} /> Adjust my own split
        </a>
        <a href="#/learn/budgeting-basics" className={secondaryButton}>What does 50/30/20 mean?</a>
      </div>
    </Card>
  )
}

function PlannerPreview() {
  const total = PREVIEW_EXPENSES.reduce((sum, e) => sum + e.amount, 0)
  const balance = PREVIEW_BUDGET - total

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg text-slate-900 font-bold">Expense planner</h3>
          <p className="text-sm text-slate-600">A peek at sample expenses and the running balance.</p>
        </div>
        <PreviewBadge>Sample data</PreviewBadge>
      </div>

      <ul className="flex flex-col">
        {PREVIEW_EXPENSES.map((e, i) => (
          <li key={i} className="flex items-center justify-between gap-3 py-2 text-sm border-b border-slate-100 last:border-0">
            <span className="min-w-0">
              <span className="block text-slate-900 truncate">{e.description}</span>
              <span className="text-xs text-slate-600">{e.category}</span>
            </span>
            <span className="font-semibold text-slate-900 whitespace-nowrap">{formatVnd(e.amount)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-baseline text-sm text-slate-600 pt-1">
        <span>Monthly budget</span>
        <span className="font-semibold text-slate-900">{formatVnd(PREVIEW_BUDGET)}</span>
      </div>
      <div className={`flex justify-between p-3 rounded-2xl ${balance >= 0 ? 'bg-emerald-100 text-emerald-950' : 'bg-red-100 text-red-800'}`}>
        <span className="font-bold">{balance >= 0 ? 'Balance left' : 'Over budget by'}</span>
        <span className="font-bold">{formatVnd(Math.abs(balance))}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-200">
        <a href="#/tools/expense-planner" className={primaryButton}>
          <Icon name="ReceiptText" size={18} /> Track my own expenses
        </a>
      </div>
    </Card>
  )
}

export default function MoneyPreview() {
  return (
    <Section id="money-preview" tone="low">
      <SectionHeading
        eyebrow="See it in action"
        title="Curious where your money goes?"
        description="A quick look at two BudgetBee tools with sample numbers. Open the full version any time to use your own."
        dot="bg-blue-400"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SplitPreview />
        <PlannerPreview />
      </div>
    </Section>
  )
}
