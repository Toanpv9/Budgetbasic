import { useEffect, useState } from 'react'
import { Card, Section, SectionHeading, primaryButton, secondaryButton } from './ui.jsx'
import { formatVnd } from '../utils/money.js'
import personas from '../data/personas.json'
import challenge from '../data/challenge.json'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'

function loadPersona(income) {
  window.dispatchEvent(new CustomEvent('bb:set-income', { detail: { income } }))
  window.location.hash = '#/tools/50-30-20-calculator'
}

export function Personas() {
  return (
    <Section id="student-profiles" tone="low">
      <SectionHeading
        eyebrow="Real-life examples"
        title="Pick a student like you"
        description="Each profile has a different situation. Load one into the calculator to see how the 50/30/20 split looks for them."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {personas.map((p) => (
          <Card key={p.name} className="flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center" aria-hidden="true"><Icon name={p.icon} size={26} /></span>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                <p className="text-sm text-emerald-700 font-bold">{formatVnd(p.income)} / month</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{p.desc}</p>
            <p className="flex items-start gap-1.5 text-sm p-3 rounded-2xl bg-slate-50 text-slate-900"><BeeMark size={16} className="mt-0.5" /> {p.tip}</p>
            <button type="button" className={`${primaryButton} mt-auto`} onClick={() => loadPersona(p.income)}>
              <Icon name="Calculator" size={18} /> Use this budget
            </button>
          </Card>
        ))}
      </div>
    </Section>
  )
}

const STORAGE_KEY = 'bb-challenge-days'

function loadDays() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function SavingsChallenge() {
  const [done, setDone] = useState(loadDays)
  const [selected, setSelected] = useState(1)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done))
    } catch {}
  }, [done])

  const toggle = (day) => setDone(done.includes(day) ? done.filter((d) => d !== day) : [...done, day])
  const percent = Math.round((done.length / challenge.length) * 100)
  const task = challenge.find((c) => c.day === selected)

  return (
    <Section id="savings-challenge" tone="low">
      <SectionHeading
        eyebrow="Build the habit"
        title="30-day savings challenge"
        description="One small money habit a day. Tap a cell to see the task, then mark it done. Fill the whole honeycomb!"
        dot="bg-amber-400"
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2" role="grid" aria-label="30-day challenge">
            {challenge.map((c) => {
              const isDone = done.includes(c.day)
              return (
                <button
                  key={c.day}
                  type="button"
                  onClick={() => setSelected(c.day)}
                  aria-label={`Day ${c.day}${isDone ? ', done' : ''}`}
                  aria-pressed={selected === c.day}
                  className={`aspect-square flex items-center justify-center text-sm font-bold transition-all hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0%_50%)] ${
                    isDone ? 'bg-amber-400 text-amber-900' : 'bg-slate-200 text-slate-600'
                  } ${selected === c.day ? 'ring-4 ring-emerald-700 scale-110' : ''}`}
                >
                  {isDone ? <Icon name="Check" size={18} /> : c.day}
                </button>
              )
            })}
          </div>
        </Card>
        <Card className="lg:col-span-4 flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-600">Progress</span>
              <span className="font-bold text-emerald-700">{done.length} / {challenge.length} days ({percent}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label="Challenge progress">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-700 transition-all duration-500" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Day {task.day}</p>
            <p className="font-bold text-slate-900 text-lg mt-1">{task.task}</p>
          </div>
          <button type="button" className={done.includes(task.day) ? secondaryButton : primaryButton} onClick={() => toggle(task.day)}>
            {done.includes(task.day) ? 'Mark as not done' : (<><Icon name="Check" size={16} /> Mark as done</>)}
          </button>
          {percent === 100 && <p className="flex items-center justify-center gap-1.5 text-center font-bold text-emerald-700"><Icon name="Trophy" size={18} /> Challenge complete! You're a true Worker Bee.</p>}
          <button type="button" className="text-xs text-slate-600 underline self-center" onClick={() => setDone([])}>Reset challenge</button>
        </Card>
      </div>
    </Section>
  )
}
