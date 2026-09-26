import { useEffect, useState } from 'react'
import { Card, Field, Section, SectionHeading, inputClass, primaryButton, secondaryButton } from './ui.jsx'
import { formatNumber, formatVnd, parseAmount } from '../utils/money.js'
import data from '../data/expense-planner.json'
import { usePersistentState, useUserState } from '../utils/usePersistentState.js'
import Icon from './Icon.jsx'

const CATEGORIES = data.categories
const COLORS = {
  Food: 'bg-[#10b981]',
  Transport: 'bg-[#3B82F6]',
  Education: 'bg-[#8B5CF6]',
  Entertainment: 'bg-[#fea619]',
  Shopping: 'bg-[#EC4899]',
  Utilities: 'bg-[#06B6D4]',
  Miscellaneous: 'bg-[#6B7280]',
}
const SORTS = {
  'date-desc': { label: 'Newest first', fn: (a, b) => b.date.localeCompare(a.date) || b.id - a.id },
  'date-asc': { label: 'Oldest first', fn: (a, b) => a.date.localeCompare(b.date) || a.id - b.id },
  'amount-desc': { label: 'Amount: high → low', fn: (a, b) => b.amount - a.amount },
  'amount-asc': { label: 'Amount: low → high', fn: (a, b) => a.amount - b.amount },
  category: { label: 'Category A → Z', fn: (a, b) => a.category.localeCompare(b.category) },
}

const today = () => new Date().toISOString().slice(0, 10)
const EMPTY = { date: '', category: 'Food', description: '', amount: '' }

function validate(item) {
  const errors = {}
  if (!item.date) errors.date = 'Pick a date.'
  if (!item.description.trim()) errors.description = 'Describe the expense.'
  const text = String(item.amount).trim()
  const amount = parseAmount(text)
  if (text === '') errors.amount = 'Enter an amount.'
  else if (text.startsWith('-')) errors.amount = 'Amount cannot be negative.'
  else if (Number.isNaN(amount)) errors.amount = 'Numbers only, e.g. 35000.'
  else if (amount <= 0) errors.amount = 'Amount must be greater than 0.'
  return { errors, amount }
}

function ExpenseForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [item, setItem] = useState(initial ?? { ...EMPTY, date: today() })
  const [touched, setTouched] = useState(false)
  const { errors, amount } = validate(item)
  const show = touched ? errors : {}
  const set = (key) => (e) => setItem({ ...item, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    onSubmit({ date: item.date, category: item.category, description: item.description.trim(), amount })
    if (!onCancel) {
      setItem({ ...EMPTY, date: item.date, category: item.category })
      setTouched(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[9rem_10rem_1fr_9rem_auto] gap-3 items-start">
      <Field label="Date" error={show.date}>
        <input type="date" className={inputClass} value={item.date} onChange={set('date')} />
      </Field>
      <Field label="Category">
        <select className={inputClass} value={item.category} onChange={set('category')}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Description" error={show.description}>
        <input className={inputClass} placeholder="e.g. Bus pass" value={item.description} maxLength={60} onChange={set('description')} />
      </Field>
      <Field label="Amount (VND)" error={show.amount}>
        <input className={inputClass} inputMode="numeric" placeholder="50,000" value={item.amount} onChange={set('amount')} />
      </Field>
      <div className="flex gap-2 lg:pt-7">
        <button type="submit" className={primaryButton}>{submitLabel}</button>
        {onCancel && <button type="button" className={secondaryButton} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default function ExpensePlanner() {
  const [items, setItems] = useUserState('expenses', [])
  const [budgetText, setBudgetText] = useUserState('budget', formatNumber(data.defaultBudget))
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = usePersistentState('planner-filter', 'All')
  const [sort, setSort] = usePersistentState('planner-sort', 'date-desc')
  const nextId = items.reduce((max, i) => Math.max(max, i.id), 0) + 1

  useEffect(() => {
    const onSync = (e) => setBudgetText(formatNumber(e.detail.budget))
    window.addEventListener('bb:set-budget', onSync)
    return () => window.removeEventListener('bb:set-budget', onSync)
  }, [setBudgetText])

  const budget = parseAmount(budgetText)
  const budgetError = budgetText.trim() === '' ? 'Enter your monthly budget.' : !(budget > 0) ? 'Numbers only, greater than 0.' : null
  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const balance = budget > 0 ? budget - total : null
  const byCategory = CATEGORIES.map((c) => [c, items.filter((i) => i.category === c).reduce((s, i) => s + i.amount, 0)]).filter(([, v]) => v > 0)
  const visible = (filter === 'All' ? items : items.filter((i) => i.category === filter)).slice().sort(SORTS[sort].fn)

  const addItem = (item) => {
    setItems([...items, { ...item, id: nextId }])
  }
  const saveItem = (id, item) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...item } : i)))
    setEditingId(null)
  }
  const deleteItem = (id) => setItems(items.filter((i) => i.id !== id))

  return (
    <Section id="expense-planner" tone="lowest">
      <SectionHeading
        eyebrow="Planning tool"
        title="Expense Planner"
        description="Add, edit or delete expenses. Totals and your remaining balance update automatically. Entries only live in this browser tab (sample data) and disappear when you reload."
        dot="bg-blue-400"
      />

      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="font-heading text-base text-slate-900 font-bold mb-3">Add an expense</h3>
          <ExpenseForm submitLabel="Add" onSubmit={addItem} />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 overflow-x-auto">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <h3 className="font-heading text-base text-slate-900 font-bold">Your expenses ({visible.length})</h3>
              <div className="flex flex-wrap gap-3">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Filter
                  <select className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    {['All', ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Sort by
                  <select className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900" value={sort} onChange={(e) => setSort(e.target.value)}>
                    {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                  </select>
                </label>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="text-sm text-slate-600 py-6 text-center" role="status">No expenses match this filter. Add one above or choose "All".</p>
            ) : (
              <table className="w-full text-sm min-w-[600px]">
                <caption className="sr-only">Expense list</caption>
                <thead>
                  <tr className="text-left text-slate-600 border-b border-slate-200">
                    <th className="py-2 font-semibold">Date</th>
                    <th className="py-2 font-semibold">Category</th>
                    <th className="py-2 font-semibold">Description</th>
                    <th className="py-2 font-semibold text-right">Amount</th>
                    <th className="py-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) =>
                    editingId === item.id ? (
                      <tr key={item.id} className="border-b border-slate-200/60">
                        <td colSpan="5" className="py-3">
                          <ExpenseForm
                            initial={{ date: item.date, category: item.category, description: item.description, amount: formatNumber(item.amount) }}
                            submitLabel="Save"
                            onSubmit={(updated) => saveItem(item.id, updated)}
                            onCancel={() => setEditingId(null)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={item.id} className="border-b border-slate-200/60 hover:bg-slate-50/60">
                        <td className="py-2.5 text-slate-600 whitespace-nowrap">{item.date}</td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <span className={`w-2.5 h-2.5 rounded-full ${COLORS[item.category]}`}></span>{item.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-900">{item.description}</td>
                        <td className="py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap">{formatVnd(item.amount)}</td>
                        <td className="py-2.5 text-right whitespace-nowrap">
                          <button type="button" className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600" aria-label={`Edit ${item.description}`} onClick={() => setEditingId(item.id)}>
                            <Icon name="Pencil" size={18} />
                          </button>
                          <button type="button" className="p-1.5 rounded-full hover:bg-red-100 text-red-700" aria-label={`Delete ${item.description}`} onClick={() => deleteItem(item.id)}>
                            <Icon name="Trash2" size={18} />
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </Card>

          <Card className="lg:col-span-4 flex flex-col gap-4 h-fit">
            <Field label="Monthly budget (VND)" error={budgetError}>
              <input className={inputClass} inputMode="numeric" value={budgetText} onChange={(e) => setBudgetText(e.target.value)} />
            </Field>
            <div className="flex flex-col gap-2.5 text-sm" aria-live="polite">
              {byCategory.map(([c, value]) => (
                <div key={c}>
                  <div className="flex justify-between">
                    <span className="text-slate-900">{c}</span>
                    <span className="font-semibold text-slate-900">{formatVnd(value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mt-1">
                    <div className={`h-full ${COLORS[c]}`} style={{ width: `${total ? (value / total) * 100 : 0}%` }}></div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 pt-3 mt-1">
                <span className="font-bold text-slate-900">Total spent</span>
                <span className="font-bold text-slate-900">{formatVnd(total)}</span>
              </div>
              {balance !== null && (
                <div className={`flex justify-between p-3 rounded-2xl ${balance >= 0 ? 'bg-emerald-100 text-emerald-950' : 'bg-red-100 text-red-800'}`}>
                  <span className="font-bold">{balance >= 0 ? 'Balance left' : 'Over budget by'}</span>
                  <span className="font-bold">{formatVnd(Math.abs(balance))}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  )
}
