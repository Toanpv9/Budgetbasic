import Icon from '../components/Icon.jsx'
import { PAGES } from '../pages.jsx'

function Chip({ href, label, active }) {
  return (
    <a
      href={href}
      aria-current={active ? 'true' : undefined}
      className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-colors ${
        active ? 'bg-emerald-700 text-white' : 'bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-900'
      }`}
    >
      {label}
    </a>
  )
}

export default function SubNav({ page, sectionId }) {
  const section = page.sections.find((s) => s.id && s.id === sectionId)
  const crumbs = [{ href: '#/home', label: 'Home' }]
  if (page.key !== 'home') crumbs.push({ href: `#/${page.key}`, label: page.label })
  if (section) crumbs.push({ href: `#/${page.key}/${section.id}`, label: section.label })

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-3 text-sm font-heading overflow-x-auto">
        <nav aria-label="Breadcrumb" className="shrink-0">
          <ol className="flex items-center gap-1.5">
            {crumbs.map((c, i) =>
              i === crumbs.length - 1 ? (
                <li key={c.href}><span aria-current="page" className="font-bold text-slate-900">{c.label}</span></li>
              ) : (
                <li key={c.href} className="flex items-center gap-1.5">
                  <a href={c.href} className="text-slate-600 hover:text-emerald-700">{c.label}</a>
                  <Icon name="ChevronRight" size={16} className="text-slate-500" />
                </li>
              ),
            )}
          </ol>
        </nav>
        <span className="h-5 w-px bg-slate-300 shrink-0" aria-hidden="true"></span>
        <nav aria-label="Pages" className="flex xl:hidden items-center gap-2">
          {PAGES.filter((p) => !p.hidden).map((p) => <Chip key={p.key} href={`#/${p.key}`} label={p.label} active={p.key === page.key} />)}
        </nav>
        <nav aria-label="On this page" className="hidden xl:flex items-center gap-2">
          {page.sections.filter((s) => s.id).map((s) => (
            <Chip key={s.id} href={`#/${page.key}/${s.id}`} label={s.label} active={s.id === sectionId} />
          ))}
        </nav>
      </div>
    </div>
  )
}
