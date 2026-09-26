import { useState } from 'react'
import { Card, Section, SectionHeading } from './ui.jsx'
import data from '../data/glossary.json'
import Icon from './Icon.jsx'

export default function GlossaryFaq() {
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const q = query.trim().toLowerCase()
  const terms = data.terms.filter((t) => !q || `${t.term} ${t.meaning}`.toLowerCase().includes(q))
  const faq = data.faq.filter((f) => !q || `${f.q} ${f.a}`.toLowerCase().includes(q))

  return (
    <Section id="glossary-faq" tone="lowest">
      <SectionHeading
        eyebrow="Quick reference"
        title="Money glossary & FAQ"
        description="Look up a word you don't understand, or find answers to questions students ask most."
      />
      <label className="relative block max-w-md mb-8">
        <span className="sr-only">Search the glossary and FAQ</span>
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. emergency fund, credit card..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card>
          <h3 className="flex items-center gap-2 font-heading text-lg text-slate-900 font-bold mb-4"><Icon name="BookOpen" size={20} /> Glossary ({terms.length})</h3>
          {terms.length ? (
            <dl className="flex flex-col divide-y divide-slate-200">
              {terms.map((t) => (
                <div key={t.term} className="py-2.5">
                  <dt className="font-bold text-slate-900">{t.term}</dt>
                  <dd className="text-sm text-slate-600">{t.meaning}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-slate-600">No terms match "{query}".</p>
          )}
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 font-heading text-lg text-slate-900 font-bold mb-4"><Icon name="CircleHelp" size={20} /> Frequently asked questions ({faq.length})</h3>
          <div className="flex flex-col gap-2">
            {faq.map((f, i) => (
              <div key={f.q} className="rounded-2xl bg-slate-50 overflow-hidden">
                <button
                  type="button"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left font-semibold text-slate-900 hover:bg-slate-100"
                >
                  <span className="flex-1">{f.q}</span>
                  <Icon name={openFaq === i ? 'Minus' : 'Plus'} size={24} className="text-slate-600" />
                </button>
                {openFaq === i && <p className="px-4 pb-4 text-sm text-slate-600">{f.a}</p>}
              </div>
            ))}
            {!faq.length && <p className="text-sm text-slate-600">No questions match "{query}".</p>}
          </div>
        </Card>
      </div>
    </Section>
  )
}
