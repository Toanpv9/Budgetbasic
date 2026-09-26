import { useState } from 'react'
import { Card, Section, SectionHeading, secondaryButton } from './ui.jsx'
import items from '../data/needs-wants-items.json'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'

const ROUND_SIZE = 5

function newRound() {
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, ROUND_SIZE)
}

const FILTER_QUESTIONS = [
  ['Is this an urgent need?', 'If you went without it for the next 24 hours, would your life or studies be seriously affected?'],
  ['Does it fit within your 30% "Wants" limit?', 'Would it cut into your food, rent or savings money?'],
  ['Can you wait another 72 hours?', 'Let the feeling settle. If you still need it after 3 days, then consider spending.'],
]

export default function NeedsWantsGame() {
  const [round, setRound] = useState(newRound)
  const [answers, setAnswers] = useState({})

  const answered = Object.keys(answers).length
  const score = round.filter((item, i) => answers[i] === item.answer).length
  const finished = answered === round.length

  const restart = () => {
    setRound(newRound())
    setAnswers({})
  }

  return (
    <Section id="needs-wants-game" tone="low">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-x-4">
        <SectionHeading
          eyebrow="Hands-on practice"
          title="Mini-game: Need or Want?"
          description={`Sort ${ROUND_SIZE} random expenses into the right basket. Every round picks new items from a list of ${items.length}.`}
        />
        <div className="flex items-center gap-3 shrink-0 mb-10">
          <span className="px-4 py-2 rounded-full bg-white border border-slate-200 font-bold text-slate-900" aria-live="polite">
            Score: <span className="text-emerald-700">{score} / {round.length}</span>
          </span>
          <button type="button" className={secondaryButton} onClick={restart}>
            <Icon name="Shuffle" size={18} /> New round
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-3">
          {round.map((item, i) => {
            const choice = answers[i]
            const correct = choice === item.answer
            return (
              <Card key={item.name} className={`!p-4 transition-all ${choice ? (correct ? 'ring-2 ring-emerald-700' : 'ring-2 ring-red-700') : ''}`}>
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center" aria-hidden="true">
                    <Icon name={item.icon} size={22} />
                  </span>
                  <p className="flex-1 font-semibold text-slate-900">{item.name}</p>
                  <div className="flex gap-2 shrink-0">
                    {['need', 'want'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={!!choice}
                        aria-pressed={choice === option}
                        onClick={() => setAnswers({ ...answers, [i]: option })}
                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase transition-colors ${
                          choice === option
                            ? correct ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
                            : option === 'need'
                              ? 'bg-blue-100 text-blue-950 hover:brightness-95'
                              : 'bg-amber-100 text-amber-950 hover:brightness-95'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                {choice && (
                  <p className="flex items-start gap-1.5 text-sm text-slate-600 mt-2 pl-12">
                    <Icon name={correct ? 'CircleCheck' : 'CircleX'} size={16} className={`shrink-0 mt-0.5 ${correct ? 'text-emerald-700' : 'text-red-700'}`} />
                    <span>{correct ? 'Correct! ' : `It's a ${item.answer}. `}{item.why}</span>
                  </p>
                )}
              </Card>
            )
          })}

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-100/60 text-slate-900" aria-live="polite">
            <BeeMark size={30} className="shrink-0" />
            <div>
              <p className="font-bold">Bee Bot's advice:</p>
              <p className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                {!finished
                  ? `Pick NEED or WANT for each item (${answered}/${round.length} done).`
                  : score === round.length
                    ? (<><Icon name="Award" size={16} className="shrink-0" /> Perfect score! You can clearly tell needs from wants.</>)
                    : `You got ${score}/${round.length}. Read the explanations, then try a new round.`}
              </p>
            </div>
          </div>
        </div>

        <Card className="lg:col-span-5 bg-slate-50 h-fit">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Icon name="Network" size={18} /> 3-question filter before you buy
          </p>
          <h3 className="font-heading text-lg text-slate-900 font-bold mb-4">Decision flow: "Should I spend this?"</h3>
          <ol className="flex flex-col gap-3">
            {FILTER_QUESTIONS.map(([q, detail], i) => (
              <li key={q} className="flex gap-3 p-3 rounded-2xl bg-white">
                <span className="w-7 h-7 shrink-0 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{q}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="flex items-start gap-1.5 mt-4 p-3 rounded-2xl bg-emerald-100/60 text-sm text-slate-900">
            <Icon name="Lightbulb" size={16} className="shrink-0 mt-0.5" /> Tip: The longer you put off emotional shopping, the sooner you reach financial freedom.
          </p>
        </Card>
      </div>
    </Section>
  )
}
