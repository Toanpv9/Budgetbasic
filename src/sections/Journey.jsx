import Icon from '../components/Icon.jsx'
import steps from '../data/journey.json'


export default function Journey() {
  return (
    <section id="4-step-journey" className="w-full bg-white py-16 lg:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="px-3.5 py-1 rounded-full bg-slate-200 text-slate-600 font-heading text-xs font-bold">Step-by-step path</span>
          <h2 className="font-heading text-2xl lg:text-3xl text-slate-900 font-bold">A 4-step journey to mastering student finances</h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-xl">Learn systematically - Practice right away - Plan realistically - Protect your wallet for good.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-heading text-lg font-bold mb-4 ${s.badge}`}>{s.n}</div>
                <span className={`font-heading text-xs uppercase font-bold tracking-wider ${s.labelTone}`}>{s.label}</span>
                <h3 className="font-heading text-base lg:text-lg text-slate-900 font-bold mt-1 mb-2">{s.title}</h3>
                <p className="font-body text-sm text-slate-600 leading-relaxed mb-5">{s.text}</p>
              </div>
              <a href={s.href} className={`inline-flex items-center gap-1.5 font-semibold text-sm hover:underline ${s.linkTone}`}>
                {s.link} <Icon name={s.icon} size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
