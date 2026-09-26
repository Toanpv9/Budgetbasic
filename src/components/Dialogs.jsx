import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'
import { onDialog } from '../dialogs.js'

export default function Dialogs() {
  const [dialog, setDialog] = useState(null)
  const close = () => setDialog(null)

  useEffect(() => onDialog(setDialog), [])
  useEffect(() => {
    if (!dialog) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog])

  if (!dialog) return null

  if (dialog.type === 'lightbox') {
    return (
      <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" onClick={close}>
        <div className="bg-white max-w-4xl w-full p-6 rounded-3xl shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 id="lightbox-title" className="font-heading text-lg text-slate-900 font-bold flex items-center gap-2">
              <Icon name="Image" size={24} className="text-emerald-700" /> {dialog.title}
            </h3>
            <button type="button" aria-label="Close zoomed image" onClick={close} className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>
          <div className="w-full flex items-center justify-center bg-slate-50 rounded-2xl p-2 overflow-hidden">
            <img alt={dialog.title} src={dialog.src} className="max-h-[70vh] w-auto object-contain rounded-xl shadow" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={close} className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition-colors">Close</button>
            <a href={dialog.src} download className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-500 text-white hover:text-emerald-900 font-semibold text-sm shadow transition-all flex items-center gap-1.5">
              <Icon name="Download" size={18} /> Download image
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="message-title" onClick={close}>
      <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div id="message-title" className="flex items-center gap-2 text-emerald-700 font-heading text-lg font-bold">
            <BeeMark size={24} /> {dialog.title}
          </div>
          <button type="button" aria-label="Close" onClick={close} className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900">
            <Icon name="X" size={18} />
          </button>
        </div>
        <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed">{dialog.text}</p>
        <button type="button" onClick={close} className="w-full py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-500 text-white hover:text-emerald-900 font-semibold text-sm shadow transition-all">Got it!</button>
      </div>
    </div>
  )
}
