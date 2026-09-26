import { useState } from 'react'
import { Card, Section, SectionHeading } from './ui.jsx'
import methods from '../data/budget-methods.json'
import traps from '../data/spending-traps.json'
import mistakes from '../data/money-mistakes.json'
import scams from '../data/scams.json'
import Icon from './Icon.jsx'

export function BudgetMethods() {
  return (
    <Section id="budget-methods" tone="low">
      <SectionHeading
        eyebrow="Compare"
        title="4 ways to budget: which one fits you?"
        description="There is no single right method. Try one for a month and switch if it doesn't feel natural."
      />
      <Card className="overflow-x-auto !p-0">
        <table className="w-full text-sm min-w-[720px]">
          <caption className="sr-only">Comparison of budgeting methods</caption>
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-4 font-semibold">Method</th>
              <th className="p-4 font-semibold">How it works</th>
              <th className="p-4 font-semibold"><span className="inline-flex items-center gap-1.5"><Icon name="ThumbsUp" size={16} /> Strength</span></th>
              <th className="p-4 font-semibold"><span className="inline-flex items-center gap-1.5"><Icon name="TriangleAlert" size={16} /> Watch out</span></th>
              <th className="p-4 font-semibold">Best for</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.name} className="border-t border-slate-200 align-top hover:bg-slate-50/60">
                <th scope="row" className="p-4 text-left font-bold text-slate-900 whitespace-nowrap">{m.name}</th>
                <td className="p-4 text-slate-600">{m.how}</td>
                <td className="p-4 text-slate-600">{m.good}</td>
                <td className="p-4 text-slate-600">{m.watch}</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold whitespace-nowrap">{m.bestFor}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Section>
  )
}

export function SpendingTraps() {
  return (
    <Section id="spending-traps" tone="lowest">
      <SectionHeading
        eyebrow="Know your brain"
        title="5 spending traps students fall into"
        description="Shops and apps are designed to make you spend. Recognise these thoughts and you can stop them."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {traps.map((t, i) => (
          <Card key={t.name} className="flex flex-col gap-2 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-full bg-red-100 text-red-800 flex items-center justify-center">
                <Icon name={t.icon} size={22} />
              </span>
              <span className="text-xs font-bold text-slate-500">#{i + 1}</span>
            </div>
            <h3 className="font-bold text-slate-900">{t.name}</h3>
            <p className="text-sm italic text-slate-600">{t.trap}</p>
            <p className="text-sm text-slate-900 mt-auto pt-2 border-t border-slate-200">
              <strong className="text-emerald-700">Defence:</strong> {t.defence}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export function MoneyMistakes() {
  const [open, setOpen] = useState(0)
  return (
    <Section id="money-mistakes" tone="lowest">
      <SectionHeading
        eyebrow="Risk warning"
        title={`${mistakes.length} common money mistakes that leave students broke`}
        description="Each mistake shows a real student situation, what happens, and how to fix it. Tap a mistake to open it."
        dot="bg-red-700"
      />
      <div className="flex flex-col gap-3">
        {mistakes.map((m, i) => {
          const isOpen = open === i
          return (
            <div key={m.title} className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mistake-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-100 transition-colors"
              >
                <span className="w-8 h-8 shrink-0 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center">{i + 1}</span>
                <span className="flex-1 font-bold text-slate-900">{m.title}</span>
                <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={24} className="text-slate-600" />
              </button>
              {isOpen && (
                <div id={`mistake-panel-${i}`} className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-4 rounded-2xl bg-white"><p className="font-bold text-slate-900 mb-1">Real situation:</p><p className="text-slate-600">{m.situation}</p></div>
                  <div className="p-4 rounded-2xl bg-red-100/50"><p className="font-bold text-red-800 mb-1">Consequence:</p><p className="text-slate-600">{m.consequence}</p></div>
                  <div className="p-4 rounded-2xl bg-emerald-100/60"><p className="font-bold text-emerald-950 mb-1">How to fix it:</p><p className="text-slate-600">{m.fix}</p></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export function ScamAlert() {
  return (
    <Section id="scam-alert" tone="lowest">
      <SectionHeading
        eyebrow="Stay safe"
        title="Scam alert: 5 tricks that target students"
        description="Scammers love students because they are new to managing money. Learn the warning signs."
        dot="bg-red-700"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scams.map((s) => (
          <Card key={s.name} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-red-100 text-red-800 flex items-center justify-center">
                <Icon name={s.icon} size={24} />
              </span>
              <h3 className="font-bold text-slate-900 text-lg">{s.name}</h3>
            </div>
            <p className="text-sm text-slate-600">{s.how}</p>
            <p className="text-sm"><strong className="inline-flex items-center gap-1 text-red-700"><Icon name="Flag" size={14} /> Warning signs:</strong> <span className="text-slate-600">{s.signs}</span></p>
            <p className="text-sm mt-auto p-3 rounded-2xl bg-emerald-100/60 text-slate-900"><strong>Protect yourself:</strong> {s.protect}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
