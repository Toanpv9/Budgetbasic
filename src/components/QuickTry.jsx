import { useState } from 'react'
import { Card, Section, SectionHeading } from './ui.jsx'
import { formatVnd } from '../utils/money.js'
import tips from '../data/money-tips.json'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'

const ITEMS = [
  { amount: 10000, label: 'a parking fee' },
  { amount: 20000, label: 'a soft drink' },
  { amount: 30000, label: 'a milk tea' },
  { amount: 50000, label: 'a café coffee' },
  { amount: 100000, label: 'a meal out' },
]

function DailySaver() {
  const [daily, setDaily] = useState(30000)
  const closest = ITEMS.reduce((a, b) => (Math.abs(b.amount - daily) < Math.abs(a.amount - daily) ? b : a))
  const results = [
    ['1 month', daily * 30],
    ['1 year', daily * 365],
    ['4 years of uni', daily * 365 * 4],
  ]

  return (
    <Card className="lg:col-span-7 flex flex-col gap-5">
      <div>
        <h3 className="font-heading text-xl text-slate-900 font-bold">What if I saved a little every day?</h3>
        <p className="text-sm text-slate-600">Drag the slider. Small daily amounts add up faster than you think.</p>
      </div>
      <label className="flex flex-col gap-3">
        <span className="flex items-baseline justify-between">
          <span className="text-sm text-slate-600">Save per day (about {closest.label})</span>
          <span className="text-2xl font-extrabold text-emerald-700">{formatVnd(daily)}</span>
        </span>
        <input
          type="range"
          min="5000"
          max="100000"
          step="5000"
          value={daily}
          onChange={(e) => setDaily(Number(e.target.value))}
          className="w-full accent-[#006c49] h-2 cursor-pointer"
          aria-label="Amount saved per day"
        />
      </label>
      <div className="grid grid-cols-3 gap-3" aria-live="polite">
        {results.map(([label, value], i) => (
          <div key={label} className={`p-4 rounded-2xl text-center ${i === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <p className="text-xs opacity-80">{label}</p>
            <p className="text-base md:text-lg font-extrabold">{formatVnd(value)}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600">Simple total without interest, for learning only.</p>
    </Card>
  )
}

function TipCard() {
  const [i, setI] = useState(() => Math.floor(Math.random() * tips.length))
  const [spin, setSpin] = useState(0)
  const next = () => {
    setI((i + 1 + Math.floor(Math.random() * (tips.length - 1))) % tips.length)
    setSpin(spin + 1)
  }
  const tip = tips[i]

  return (
    <Card className="lg:col-span-5 flex flex-col gap-4 bg-gradient-to-br from-amber-100 to-white">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700"><BeeMark size={16} /> Bee's tip</span>
        <span className="text-xs text-slate-600">{i + 1} / {tips.length}</span>
      </div>
      <div key={spin} className="flex-1 flex flex-col gap-3 animate-[tip-in_0.5s_ease-out]">
        <span className="w-16 h-16 rounded-2xl bg-white/70 flex items-center justify-center text-amber-700" aria-hidden="true">
          <Icon name={tip.icon} size={36} />
        </span>
        <p className="text-lg font-bold text-slate-900 leading-snug">{tip.text}</p>
      </div>
      <button type="button" onClick={next} className="self-start inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 text-slate-50 font-semibold text-sm hover:scale-105 transition-transform">
        <Icon name="Dices" size={18} /> Another tip
      </button>
    </Card>
  )
}

export default function QuickTry() {
  return (
    <Section id="quick-try" tone="low">
      <SectionHeading eyebrow="Try it in 10 seconds" title="Play with your money habits" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DailySaver />
        <TipCard />
      </div>
    </Section>
  )
}
