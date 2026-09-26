import { useCallback, useEffect, useMemo, useRef } from 'react'
import { findPage } from './pages.jsx'
import { useHashRoute } from './router.js'
import { AnchorContext } from './anchors.js'
import Reveal from './components/Reveal.jsx'
import Header from './layout/Header.jsx'
import Footer from './layout/Footer.jsx'
import Dialogs from './components/Dialogs.jsx'
import ChatBot from './components/ChatBot.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import AdminApp from './admin/AdminApp.jsx'
import { useCurrentUser } from './auth.js'

const BASE_VISITS = 128490

function useVisitCount() {
  return useMemo(() => {
    try {
      let extra = Number(localStorage.getItem('bb-visits') || 0)
      if (!sessionStorage.getItem('bb-visited')) {
        extra += 1
        localStorage.setItem('bb-visits', String(extra))
        sessionStorage.setItem('bb-visited', '1')
      }
      return BASE_VISITS + extra
    } catch {
      return BASE_VISITS
    }
  }, [])
}

function App() {
  const route = useHashRoute()
  const page = findPage(route.page)
  const visits = useVisitCount()
  const user = useCurrentUser()

  const anchors = useRef(new Map())
  const registerAnchor = useCallback((id, el) => {
    if (el) anchors.current.set(id, el)
    else anchors.current.delete(id)
  }, [])

  useEffect(() => {
    const section = page.sections.find((s) => s.id === route.section)
    document.title = `${section ? section.label : page.label} | BudgetBee`
    const frame = requestAnimationFrame(() => {
      const target = route.section && anchors.current.get(route.section)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [page, route])

  if (page.key === 'admin') {
    return (
      <AnchorContext.Provider value={registerAnchor}>
        <AdminApp section={route.section} />
      </AnchorContext.Provider>
    )
  }

  return (
    <AnchorContext.Provider value={registerAnchor}>
      <Header page={page} sectionId={route.section} user={user} />
      <main className="w-full pt-32 bg-white min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full" key={`${page.key}:${user?.id ?? 'guest'}`}>
          {page.sections
            .filter((section) => section.rendered !== false)
            .map((section, i) => (
              <Reveal key={section.id ?? i} id={section.id} animate={i > 0}>
                <section.Component />
              </Reveal>
            ))}
        </div>
      </main>
      <ScrollToTop />
      <ChatBot />
      <Footer visits={visits} />
      <Dialogs />
    </AnchorContext.Provider>
  )
}

export default App
