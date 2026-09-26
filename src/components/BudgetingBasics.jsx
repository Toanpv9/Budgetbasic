import { useState } from 'react'
import { Card, Section, SectionHeading, primaryButton, secondaryButton } from './ui.jsx'
import { formatVnd } from '../utils/money.js'
import data from '../data/budgeting-basics.json'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'

function Concepts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.concepts.map((c) => (
        <Card key={c.term} className="flex flex-col gap-2 hover:-translate-y-1 hover:shadow-md transition-all">
          <span className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Icon name={c.icon} size={22} />
          </span>
          <h3 className="font-heading text-lg text-slate-900 font-bold">{c.term}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{c.definition}</p>
          <p className="text-sm text-slate-900 mt-auto pt-2 border-t border-slate-200">
            <strong>Example:</strong> {c.example}
          </p>
        </Card>
      ))}
    </div>
  )
}

function SampleBudget() {
  const { income, items } = data.sampleBudget
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const totals = items.reduce((acc, i) => ({ ...acc, [i.group]: (acc[i.group] || 0) + i.amount }), {})
  const badge = { Need: 'bg-blue-100 text-blue-950', Want: 'bg-amber-100 text-amber-950', Savings: 'bg-emerald-100 text-emerald-950' }

  return (
    <Card className="overflow-x-auto">
      <h3 className="font-heading text-lg text-slate-900 font-bold mb-1">Sample monthly budget: Linh, 2nd-year student</h3>
      <p className="text-sm text-slate-600 mb-4">
        Income: {income.map((i) => `${i.source} ${formatVnd(i.amount)}`).join(' + ')} = <strong>{formatVnd(totalIncome)}</strong>
      </p>
      <table className="w-full text-sm min-w-[520px]">
        <caption className="sr-only">Sample student budget</caption>
        <thead>
          <tr className="text-left text-slate-600 border-b border-slate-200">
            <th className="py-2 font-semibold">Item</th>
            <th className="py-2 font-semibold">Type</th>
            <th className="py-2 font-semibold">Group</th>
            <th className="py-2 font-semibold text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.name} className="border-b border-slate-200/60">
              <td className="py-2 text-slate-900">{i.name}</td>
              <td className="py-2 text-slate-600">{i.type}</td>
              <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badge[i.group]}`}>{i.group}</span></td>
              <td className="py-2 text-right text-slate-900 font-semibold">{formatVnd(i.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="pt-4">
              <div className="flex flex-wrap gap-3 text-sm">
                {Object.entries(totals).map(([group, value]) => (
                  <span key={group} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-900">
                    {group}: <strong>{formatVnd(value)}</strong> ({Math.round((value / totalIncome) * 100)}%)
                  </span>
                ))}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </Card>
  )
}

function Quiz() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = data.quiz.filter((q, i) => answers[i] === q.answer).length
  const allAnswered = Object.keys(answers).length === data.quiz.length

  const reset = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="font-heading text-lg text-slate-900 font-bold">Check your understanding</h3>
        {submitted && (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-sm" aria-live="polite">
            Score: {score} / {data.quiz.length}
          </span>
        )}
      </div>
      <ol className="flex flex-col gap-5">
        {data.quiz.map((q, qi) => (
          <li key={q.question}>
            <fieldset>
              <legend className="font-semibold text-slate-900 mb-2">{qi + 1}. {q.question}</legend>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi
                  let style = chosen ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                  if (submitted && oi === q.answer) style = 'bg-emerald-100 text-emerald-950 border-emerald-700'
                  else if (submitted && chosen) style = 'bg-red-100 text-red-800 border-red-700'
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={submitted}
                      aria-pressed={chosen}
                      onClick={() => setAnswers({ ...answers, [qi]: oi })}
                      className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${style}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {submitted && <p className="flex items-start gap-1.5 text-sm text-slate-600 mt-2"><Icon name="Lightbulb" size={16} className="shrink-0 mt-0.5" /> {q.explanation}</p>}
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3 mt-6">
        {!submitted ? (
          <button type="button" className={primaryButton} disabled={!allAnswered} onClick={() => setSubmitted(true)}>
            Check answers
          </button>
        ) : (
          <button type="button" className={secondaryButton} onClick={reset}>
            <Icon name="RefreshCw" size={18} /> Try again
          </button>
        )}
        {submitted && score >= 4 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-100 text-amber-950" role="status">
            <span className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-inner">
              <BeeMark size={26} />
            </span>
            <span><strong>Worker Bee badge earned!</strong><br /><span className="text-xs">You scored {score}/{data.quiz.length}. Keep buzzing!</span></span>
          </div>
        )}
        {submitted && score < 4 && <span className="text-xs text-slate-600">Score 4 or more to earn the Worker Bee badge</span>}
        {!allAnswered && !submitted && <span className="text-xs text-slate-600">Answer all {data.quiz.length} questions to see your score.</span>}
      </div>
    </Card>
  )
}

export default function BudgetingBasics() {
  return (
    <Section id="budgeting-basics" tone="lowest">
      <SectionHeading
        eyebrow="Step 1 • Knowledge"
        title="Budgeting Basics"
        description="Six words you need before you make any budget. Read the cards, study the sample budget, then test yourself with the quiz."
      />
      <div className="flex flex-col gap-8">
        <Concepts />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <SampleBudget />
          <Quiz />
        </div>
      </div>
    </Section>
  )
}
