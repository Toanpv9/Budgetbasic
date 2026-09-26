import { useEffect, useRef, useState } from 'react'
import bot from '../data/chatbot.json'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'
import { getCurrentUser } from '../auth.js'
import { logEvent } from '../admin/adminStore.js'

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const hasWord = (text, word) => new RegExp(`(^|[^a-z0-9])${escape(word)}(s|es)?($|[^a-z0-9])`).test(text)

function findRule(message) {
  const text = message.toLowerCase()
  let best = null
  let bestScore = 0
  for (const rule of bot.rules) {
    const score = rule.keywords.filter((k) => hasWord(text, k)).length
    if (score > bestScore) {
      best = rule
      bestScore = score
    }
  }
  return best
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'bot', text: bot.greeting }])
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('bb:open-chat', onOpen)
    return () => window.removeEventListener('bb:open-chat', onOpen)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const ask = (text) => {
    const question = text.trim()
    if (!question) return
    setInput('')
    const rule = findRule(question)
    const user = getCurrentUser()
    logEvent('chat', { userId: user?.id ?? null, name: user?.name ?? 'Guest', text: question, matched: !!rule })
    setMessages((m) => [
      ...m,
      { from: 'user', text: question },
      rule ? { from: 'bot', text: rule.answer, link: rule.link, linkLabel: rule.linkLabel } : { from: 'bot', text: bot.fallback },
    ])
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[calc(100vw-3rem)] max-w-sm h-[32rem] max-h-[75vh] bg-white rounded-3xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.25)] border border-slate-200 flex flex-col overflow-hidden" role="dialog" aria-label="Bee Bot chat">
          <div className="flex items-center justify-between px-4 py-3 bg-amber-400 text-amber-900">
            <div className="flex items-center gap-2">
              <BeeMark size={28} />
              <div>
                <p className="font-bold leading-tight">Bee Bot — Q&amp;A Assistant</p>
                <p className="text-xs opacity-80">Quick answers to money questions</p>
              </div>
            </div>
            <button type="button" className="p-1.5 rounded-full hover:bg-black/10" aria-label="Close chat" onClick={() => setOpen(false)}>
              <Icon name="X" size={24} />
            </button>
          </div>

              <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.from === 'user' ? 'self-end bg-emerald-700 text-white rounded-br-md' : 'self-start bg-slate-50 text-slate-900 rounded-bl-md'}`}>
                    {m.text}
                    {m.link && (
                      <a href={m.link} className="block mt-1.5 font-bold text-emerald-700 underline" onClick={() => setOpen(false)}>
                        {m.linkLabel} <Icon name="ArrowRight" size={14} className="inline" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-3 pt-2 flex gap-1.5 overflow-x-auto">
                {bot.quickReplies.map((q) => (
                  <button key={q} type="button" onClick={() => ask(q)} className="shrink-0 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-900 hover:bg-slate-200">
                    {q}
                  </button>
                ))}
              </div>
              <form className="p-3 pb-1 flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
                <label htmlFor="bee-question" className="sr-only">Your question for Bee Bot</label>
                <input
                  id="bee-question"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  maxLength={300}
                  className="flex-1 min-w-0 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" disabled={!input.trim()} className="px-4 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm">
                  Ask
                </button>
              </form>
              <p className="px-4 pb-3 text-[10px] text-slate-600">
                Bee Bot gives general educational information only. It is not professional financial advice.
              </p>
        </div>
      )}

      <div className="flex items-end gap-3 group">
        {!open && (
          <div className="hidden md:block bg-white text-slate-900 p-3 rounded-2xl shadow-[0_16px_36px_-8px_rgba(245,158,11,0.28)] text-sm max-w-xs transition-transform group-hover:scale-105">
            <p className="flex items-center gap-1.5 text-emerald-700 font-bold mb-0.5"><BeeMark size={18} /> Friendly Bee Bot</p>
            <p className="text-slate-600 leading-snug">Hi! Need some spending advice from Bee?</p>
          </div>
        )}
        <button
          type="button"
          aria-label={open ? 'Close Bee Bot' : 'Chat with Bee Bot'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center transition-transform hover:scale-110"
          style={{ animation: open ? 'none' : 'bee-pulse 2.5s ease infinite' }}
        >
          <Icon name={open ? 'X' : 'Bot'} size={32} />
        </button>
      </div>
    </div>
  )
}
