import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { openLightbox, showMessage } from '../dialogs.js'
import items from '../data/infographics.json'

const CATEGORIES = ['All', 'Budgeting', 'Needs vs Wants', 'Saving']

function Card({ item }) {
  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative h-56 w-full overflow-hidden bg-slate-200">
        <img alt={item.alt} src={item.src} loading="lazy" className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${item.fit}`} />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 font-heading text-xs text-slate-900 font-bold backdrop-blur-sm">{item.tag}</span>
        <button type="button" aria-label={`Zoom in: ${item.title}`} onClick={() => openLightbox(item.title, item.src)}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-900 hover:text-emerald-700 flex items-center justify-center shadow-md backdrop-blur-sm transition-colors">
          <Icon name="ZoomIn" size={18} />
        </button>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
        <div>
          <h3 className="font-heading text-base lg:text-lg text-slate-900 font-bold group-hover:text-emerald-700 transition-colors">{item.title}</h3>
          <p className="font-body text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">{item.text}</p>
        </div>
        <button type="button" onClick={() => showMessage(item.title, `${item.text} Tap the zoom button to view it full size or download the image.`)}
          className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-sm hover:underline self-start">
          <Icon name="Eye" size={18} /> View details
        </button>
      </div>
    </article>
  )
}

export default function Infographics() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const q = query.trim().toLowerCase()
  const shown = items.filter(
    (i) => (category === 'All' || i.category === category) && (!q || `${i.title} ${i.text} ${i.tag}`.toLowerCase().includes(q)),
  )

  return (
    <section id="infographics-library" className="w-full bg-slate-50 py-12 lg:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-1.5 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-heading text-xs text-amber-700 uppercase tracking-wider font-bold">Learn visually</span>
          </div>
          <h2 className="font-heading text-2xl lg:text-3xl text-slate-900 font-bold">Money infographics at a glance</h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <label className="relative flex-1 max-w-md">
            <span className="sr-only">Search infographics</span>
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search infographics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter infographics">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${category === c ? 'bg-emerald-700 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                {c}
              </button>
            ))}
          </div>
          <span className="text-sm text-slate-600 md:ml-auto" aria-live="polite">
            {shown.length ? `${shown.length} shown` : 'No infographics match your search.'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shown.map((item) => <Card key={item.title} item={item} />)}
        </div>
      </div>
    </section>
  )
}
