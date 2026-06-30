import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Sparkle, PaperPlaneTilt, Microphone } from '@phosphor-icons/react'

export default function ChatScreen({ messages, typing, draft, onDraftChange, onSend, onWeave, onBack }) {
  const threadRef = useRef(null)

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [messages.length, typing])

  const last = messages[messages.length - 1]
  const showOpts = !typing && last?.who === 'kael' && last.options?.length > 0

  const submit = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
  }

  return (
    <div className="ka-chat">
      <header className="ka-chat-top">
        <button className="ka-icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <div className="ka-chat-id"><b>Kael</b><span>Present</span></div>
        <button className="ka-today-btn" onClick={onWeave}>Today<ArrowRight size={13} weight="bold" /></button>
      </header>

      <div className="ka-chat-thread" ref={threadRef}>
        {messages.map((m) => (
          <div key={m.id} className={`io-cmsg io-cmsg-${m.who}`}>
            {m.who === 'kael' && <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>}
            <p>{m.text}</p>
          </div>
        ))}
        {typing && <div className="ka-typing"><span /><span /><span /></div>}
        {showOpts && (
          <div className="ka-opts">
            {last.options.map((o) => (
              <button key={o} className="ka-opt" onClick={() => onSend(o)}>{o}</button>
            ))}
          </div>
        )}
      </div>

      <form className="ka-composer" onSubmit={submit}>
        <input
          className="ka-composer-input"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Message Kael…"
          autoComplete="off"
        />
        <button type={draft.trim() ? 'submit' : 'button'} className="ka-composer-btn" aria-label={draft.trim() ? 'Send' : 'Voice'}>
          {draft.trim() ? <PaperPlaneTilt size={18} weight="fill" /> : <Microphone size={18} weight="fill" />}
        </button>
      </form>
    </div>
  )
}
