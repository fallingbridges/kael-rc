import { useEffect, useRef, useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import HomeScreen from './HomeScreen.jsx'
import ChatScreen from './ChatScreen.jsx'
import YouScreen from './YouScreen.jsx'
import JourneyScreen from './JourneyScreen.jsx'
import LearnScreen from './LearnScreen.jsx'
import LessonScreen from './LessonScreen.jsx'
import { kaelReply, chipExchange, moodExchange } from '../kael.js'
import { getLesson } from '../lessons.js'

const SEED = [
  { id: 1, who: 'user', text: 'He said he needs space and now I’m spiraling.', time: '9:32 am' },
  {
    id: 2,
    who: 'kael',
    text: 'Let’s slow it down. What part hurts most right now: the distance, the ambiguity, or what it seems to mean about you?',
  },
]

function nowTime() {
  return new Date()
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .toLowerCase()
}

// Inline-editable title (DOM is source of truth; exporter reads it).
function Ed({ as: Tag = 'span', className = '', html }) {
  return (
    <Tag
      className={`ed ${className}`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// A self-contained, fully interactive Kael app — click through it, then export.
function MiniApp({ theme, initialTab = 'home', rimColor = '#0d0c0a', rimWidth = 6 }) {
  const [tab, setTab] = useState(initialTab)
  const [messages, setMessages] = useState(SEED)
  const [typing, setTyping] = useState(false)
  const [sheet, setSheet] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const idRef = useRef(SEED.length + 1)
  const timerRef = useRef(null)

  function respond(text) {
    setTyping(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, { id: idRef.current++, who: 'kael', text }])
      setTyping(false)
    }, 650)
  }
  function sendText(t) {
    const c = (t || '').trim()
    if (!c) return
    setMessages((m) => [...m, { id: idRef.current++, who: 'user', text: c, time: nowTime() }])
    respond(kaelReply(c))
  }
  function sendChip(type) {
    const { user, kael } = chipExchange(type)
    setMessages((m) => [...m, { id: idRef.current++, who: 'user', text: user, time: nowTime() }])
    respond(kael)
  }
  function startFromPrompt(label) {
    setTab('chat')
    sendText(label)
  }
  function bringMood(id) {
    const { user, kael } = moodExchange(id)
    setTab('chat')
    setMessages((m) => [...m, { id: idRef.current++, who: 'user', text: user, time: nowTime() }])
    respond(kael)
  }
  function discussLesson(lesson) {
    setActiveLesson(null)
    setTab('chat')
    sendText(`I just read “${lesson.title}.” It stirred something up. Can we talk about it?`)
  }
  function sheetCta(message) {
    setSheet(null)
    setTab('chat')
    sendText(message)
  }

  const handlers = {
    sendText,
    sendChip,
    goChat: () => setTab('chat'),
    goHome: () => setTab('home'),
    startFromPrompt,
    bringMood,
    openLesson: (id) => setActiveLesson(id),
    openSheet: (d) => setSheet(d),
  }

  const lesson = activeLesson ? getLesson(activeLesson) : null

  let screen
  if (tab === 'chat')
    screen = (
      <ChatScreen
        messages={messages}
        typing={typing}
        onSend={sendText}
        onChip={sendChip}
        onBack={handlers.goHome}
      />
    )
  else if (tab === 'you')
    screen = <YouScreen onOpenSheet={handlers.openSheet} onPrompt={startFromPrompt} />
  else if (tab === 'journey')
    screen = <JourneyScreen onNavigate={handlers.goChat} onOpenSheet={handlers.openSheet} />
  else if (tab === 'learn') screen = <LearnScreen onOpenLesson={handlers.openLesson} />
  else screen = <HomeScreen onPrompt={startFromPrompt} onMood={bringMood} />

  return (
    <div
      className="store-phone"
      style={{
        background: rimColor,
        padding: `${rimWidth}px`,
        boxShadow: rimIsLight(rimColor) ? `${PHONE_SHADOW}, inset 0 0 0 1px rgba(20, 18, 14, 0.12)` : PHONE_SHADOW,
      }}
    >
      <div className="phone-screen" data-theme={theme}>
        <StatusBar />
        <div className="screen-body">{screen}</div>
        {tab !== 'chat' && <BottomNav active={tab} onSelect={setTab} />}
        <div className="home-indicator" />
        {lesson && (
          <div className="overlay-layer">
            <LessonScreen lesson={lesson} onBack={() => setActiveLesson(null)} onDiscuss={discussLesson} />
          </div>
        )}
        <BottomSheet sheet={sheet} onClose={() => setSheet(null)} onCta={sheetCta} />
      </div>
    </div>
  )
}

// Standalone story shot: a designed composition for the "Love gets messy" headline.
// Not the live app and not editable — curated components telling messy → held, then export.
function StoryFrame({ frameRef }) {
  return (
    <div className="store-frame sf-frame" data-theme="light" ref={frameRef}>
      <div className="sf-titleblock">
        <h2 className="sf-title">
          Love gets <i>messy.</i>
        </h2>
        <div className="sf-title-2">Kael helps you through it.</div>
      </div>

      <div className="sf-card sf-them">
        <div className="sf-meta">Jay · 11:52 pm</div>
        <div className="sf-card-body">can we talk tomorrow</div>
      </div>

      <div className="sf-card sf-you">
        <div className="sf-card-body">Are we okay??</div>
        <div className="sf-meta sf-meta-dark">Draft · deleted twice</div>
      </div>

      <div className="sf-chip sf-chip-1">Anxious</div>
      <div className="sf-chip sf-chip-2">Overthinking</div>
      <div className="sf-chip sf-chip-3">Can’t sleep</div>

      <div className="sf-typing" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="sf-kael">
        <div className="sf-kael-head">
          <span className="sf-kael-dot" />
          <span className="sf-kael-name">Kael</span>
        </div>
        <p className="sf-kael-msg">
          Take a breath. A slow reply is not a verdict. Before you type anything back, tell me
          what you’re afraid it means.
        </p>
      </div>

      <div className="sf-pattern">
        <span className="sf-pattern-dot" />
        Pattern noticed · the late night spiral
      </div>
    </div>
  )
}

const SHOTS = [
  { id: 'hero', theme: 'light', initialTab: 'home', hero: true, kael: 'Kael', title: 'Your coach for better relationships.', devScale: 2.3, devTop: 940 },
  { id: 'decode', theme: 'dark', initialTab: 'home', title: 'Decode fights, distance, and mixed signals', devScale: 2.55, devTop: 700 },
  { id: 'patterns', theme: 'light', initialTab: 'you', title: 'Uncover your patterns & triggers', devScale: 2.55, devTop: 700 },
  { id: 'change', theme: 'dark', initialTab: 'journey', title: 'Watch yourself actually change', devScale: 2.55, devTop: 700 },
  { id: 'lessons', theme: 'light', initialTab: 'learn', title: 'Lessons matched to your patterns', devScale: 2.55, devTop: 700 },
  { id: 'secure', theme: 'light', initialTab: 'you', title: 'Build healthy, secure relationships', devScale: 2.55, devTop: 700 },
]

const FG_SWATCHES = ['#1b1a17', '#6e5638', '#7c7568', '#f7f5f0']
const BG_SWATCHES = ['#f0ebe1', '#f6f2ea', '#ffffff', '#e7e1d5', '#1b1a17']

// Phone rim (bezel) options.
const RIM_COLORS = ['#0d0c0a', '#3a3833', '#8a8780', '#d9d5cc', '#ffffff', '#c2a06a']
const RIM_WIDTHS = [
  { label: 'Thin', w: 4 },
  { label: 'Med', w: 6 },
  { label: 'Thick', w: 10 },
]
// Serif options for the App Store title typography (studio preview).
const SERIF_FONTS = [
  { label: 'Newsreader (current)', family: 'Newsreader', weight: 600 },
  { label: 'Charter', family: 'Charter', weight: 600 },
  { label: 'Fraunces', family: 'Fraunces', weight: 600 },
  { label: 'Domine', family: 'Domine', weight: 600 },
  { label: 'Alice', family: 'Alice', weight: 400 },
  { label: 'Cormorant Garamond', family: 'Cormorant Garamond', weight: 600 },
  { label: 'Playfair Display', family: 'Playfair Display', weight: 500 },
  { label: 'Spectral', family: 'Spectral', weight: 500 },
  { label: 'Bodoni Moda', family: 'Bodoni Moda', weight: 500 },
  { label: 'DM Serif Display', family: 'DM Serif Display', weight: 400 },
]

const PHONE_SHADOW = '0 26px 60px -28px rgba(20, 18, 14, 0.4)'
function rimIsLight(hex) {
  const h = (hex || '').replace('#', '')
  if (h.length < 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}

// Elements that can be lifted out into a "pop" — the nearest one to a click wins.
const POP_SELECTOR =
  '.mcard, .value-tile, .mhero, .growth-edge, .belief-quote, .belief-truth, .j-card, .j-node, .journey-intro, .litem, .mood-tile, .way-pill, .fk-card, .pickup, .bubble-kael, .bubble-user, .chip, .snap-values'

// Studio-only position ruler down the frame (0..2796px), every 100px, labelled each 500.
const RULER_MARKS = Array.from({ length: 28 }, (_, i) => i * 100)
// Drag shows a red guide line at every ruler mark (each 100px).
const CHECKPOINTS = RULER_MARKS
const CHECKPOINT_SNAP = 22 // frame px within which the guide shows

function StoreRuler() {
  return (
    <div className="store-ruler" aria-hidden="true">
      {RULER_MARKS.map((y) => (
        <div key={y} className="rl-tick" data-major={y % 500 === 0 || undefined} style={{ top: `calc(${y}px * var(--ps))` }}>
          {y % 500 === 0 && <span className="rl-label">{y}</span>}
        </div>
      ))}
    </div>
  )
}

// One lifted-out, draggable, editable card floating over the phone.
function PopCard({ pop, active, editing, onDown }) {
  const ref = useRef(null)
  useEffect(() => {
    if (editing && ref.current) ref.current.focus()
  }, [editing])
  // bg/fg drive the whole card by overriding theme tokens; secondary tones are mixed.
  const colorVars = {}
  if (pop.bg) {
    colorVars['--surface'] = pop.bg
    colorVars['--surface-2'] = pop.bg
    colorVars['--paper'] = pop.bg
    colorVars['--field'] = pop.bg
  }
  if (pop.fg) {
    const into = pop.bg || 'transparent'
    colorVars['--ink'] = pop.fg
    colorVars['--ink-2'] = `color-mix(in srgb, ${pop.fg} 72%, ${into})`
    colorVars['--ink-3'] = `color-mix(in srgb, ${pop.fg} 50%, ${into})`
    colorVars['--line'] = `color-mix(in srgb, ${pop.fg} 18%, transparent)`
    colorVars['--line-2'] = `color-mix(in srgb, ${pop.fg} 12%, transparent)`
    colorVars['--line-strong'] = `color-mix(in srgb, ${pop.fg} 32%, transparent)`
  }
  return (
    <div
      className="store-pop"
      data-theme={pop.theme}
      data-sel={active ? 'true' : undefined}
      data-edit={editing ? 'true' : undefined}
      style={{ left: `${pop.x}px`, top: `${pop.y}px`, width: `${pop.w}px`, '--pop-scale': pop.scale, ...colorVars }}
      onPointerDown={onDown}
    >
      <div
        className="pop-body"
        ref={ref}
        contentEditable={editing}
        suppressContentEditableWarning
        spellCheck={false}
        dangerouslySetInnerHTML={{ __html: pop.html }}
      />
    </div>
  )
}

function StoreFrame({ shot, theme, rimColor, rimWidth, top, scale, titleTop, titleScale, bg, fg, picking, onPick, pops, blur, active, editing, onPopDown, onDeselect, onPhoneDown, onTitleDown, guide, frameRef }) {
  const blurred = pops.length > 0 && blur > 0
  return (
    <div
      className="store-frame"
      data-theme="light"
      ref={frameRef}
      style={{ background: bg }}
      onPointerDown={(e) => {
        if (!e.target.closest('.store-pop')) onDeselect()
      }}
    >
      <div
        className="store-titleblock"
        style={{ '--title-top': `${titleTop}px`, '--title-scale': titleScale, '--title-color': fg }}
        onPointerDown={onTitleDown}
      >
        {shot.hero && (
          <>
            <Ed className="st-logo-name" html={shot.kael} />
            <span className="st-rule" />
          </>
        )}
        <Ed as="h2" className={`st-title${shot.hero ? ' hero' : ''}`} html={shot.title} />
      </div>
      <div
        className="store-device"
        data-pick={picking ? 'true' : undefined}
        style={{ top: `${top}px`, '--dev-scale': scale, filter: blurred ? `blur(${blur}px)` : undefined }}
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={onPhoneDown}
        onClickCapture={
          picking
            ? (e) => {
                e.preventDefault()
                e.stopPropagation()
                const el = e.target.closest(POP_SELECTOR)
                if (el) onPick(el.outerHTML, el.offsetWidth)
              }
            : undefined
        }
      >
        <MiniApp theme={theme} initialTab={shot.initialTab} rimColor={rimColor} rimWidth={rimWidth} />
      </div>
      {pops.map((p) => (
        <PopCard
          key={p.pid}
          pop={p}
          active={active === p.pid}
          editing={editing === p.pid}
          onDown={(e) => onPopDown(p.pid, e)}
        />
      ))}
      {guide != null && <div className="store-guide" style={{ top: `${guide}px` }} aria-hidden="true" />}
    </div>
  )
}

export default function StoreScreens() {
  const [themes, setThemes] = useState(() => Object.fromEntries(SHOTS.map((s) => [s.id, s.theme])))
  const [targets, setTargets] = useState(() => Object.fromEntries(SHOTS.map((s) => [s.id, 'phone'])))
  const [cfg, setCfg] = useState(() =>
    Object.fromEntries(
      SHOTS.map((s) => [
        s.id,
        {
          top: s.devTop,
          scale: s.devScale,
          titleTop: 140,
          titleScale: 1,
          bg: '#f0ebe1',
          fg: '#1b1a17',
          rimColor: '#0d0c0a',
          rimWidth: 6,
          pops: [],
          blur: 0,
        },
      ]),
    ),
  )
  const [picking, setPicking] = useState(null)
  const [active, setActive] = useState({}) // frameId -> active pop pid
  const [editing, setEditing] = useState({}) // frameId -> pid being text-edited
  const [guide, setGuide] = useState({}) // frameId -> checkpoint Y while dragging
  const [history, setHistory] = useState([]) // snapshots for undo
  const [serifIdx, setSerifIdx] = useState(0) // App Store title serif (independent of app serif)
  const pidRef = useRef(1)
  const refs = useRef({})

  // Snapshot current structural state (immutable updates make refs safe to keep).
  function pushHistory() {
    setHistory((h) => [...h.slice(-49), { cfg, themes, targets }])
  }
  function undo() {
    if (!history.length) return
    const prev = history[history.length - 1]
    setCfg(prev.cfg)
    setThemes(prev.themes)
    setTargets(prev.targets)
    setHistory((h) => h.slice(0, -1))
    setActive({})
    setEditing({})
    setPicking(null)
    setGuide({})
  }

  function resize(id, d) {
    setCfg((c) => ({ ...c, [id]: { ...c[id], scale: Math.round((c[id].scale + d) * 100) / 100 } }))
  }
  function resizeTitle(id, d) {
    setCfg((c) => ({ ...c, [id]: { ...c[id], titleScale: Math.round((c[id].titleScale + d) * 100) / 100 } }))
  }
  function toggleTarget(id) {
    setTargets((t) => ({ ...t, [id]: t[id] === 'title' ? 'phone' : 'title' }))
  }
  function size(id, dir) {
    pushHistory()
    if (targets[id] === 'title') resizeTitle(id, dir * 0.06)
    else resize(id, dir * 0.1)
  }
  // Bold / italic the current title selection. execCommand edits the live DOM,
  // which is exactly what the PNG exporter reads. ⌘B / ⌘I work natively too.
  // With nothing selected, it toggles the whole headline.
  function formatTitle(id, cmd) {
    const frame = refs.current[id]
    if (!frame) return
    const sel = window.getSelection()
    let host = null
    if (sel && sel.rangeCount && !sel.isCollapsed) {
      const node = sel.anchorNode
      const start = node && (node.nodeType === 1 ? node : node.parentElement)
      const found = start && start.closest('.st-title, .st-logo-name')
      if (found && frame.contains(found)) host = found
    }
    if (host) {
      host.focus()
    } else {
      host = frame.querySelector('.st-title')
      if (!host) return
      host.focus()
      const range = document.createRange()
      range.selectNodeContents(host)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    document.execCommand('styleWithCSS', false, false)
    document.execCommand(cmd, false, null)
  }
  // Vertical drag for the phone / title. Tiny moves stay clicks (interact / edit).
  function startVDrag(id, kind, e) {
    if (kind === 'phone' && picking === id) return
    const frame = refs.current[id]
    if (!frame) return
    const ratio = frame.getBoundingClientRect().width / 1290
    const sy = e.clientY
    const sx = e.clientX
    const key = kind === 'title' ? 'titleTop' : 'top'
    const start = cfg[id][key]
    let dragging = false
    function onMove(ev) {
      if (!dragging) {
        if (Math.abs(ev.clientY - sy) + Math.abs(ev.clientX - sx) <= 6) return
        dragging = true
        pushHistory()
        const sel = window.getSelection && window.getSelection()
        if (sel) sel.removeAllRanges()
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur()
      }
      ev.preventDefault()
      const ny = Math.round(start + (ev.clientY - sy) / ratio)
      let cp = null
      for (const m of CHECKPOINTS) {
        if (Math.abs(ny - m) <= CHECKPOINT_SNAP) {
          cp = m
          break
        }
      }
      setCfg((c) => ({ ...c, [id]: { ...c[id], [key]: ny } }))
      setGuide((g) => (g[id] === cp ? g : { ...g, [id]: cp }))
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp, true)
      setGuide((g) => ({ ...g, [id]: null }))
      if (dragging) {
        // swallow the click that follows a drag so the app / title doesn't act
        const sup = (ev) => {
          ev.stopPropagation()
          ev.preventDefault()
          frame.removeEventListener('click', sup, true)
        }
        frame.addEventListener('click', sup, true)
        setTimeout(() => frame.removeEventListener('click', sup, true), 150)
      }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, true)
  }
  function setColor(id, key, val) {
    pushHistory()
    setCfg((c) => ({ ...c, [id]: { ...c[id], [key]: val } }))
  }
  function colorPop(id, pid, patch) {
    pushHistory()
    patchPop(id, pid, patch)
  }

  function startPick(id) {
    setPicking((p) => (p === id ? null : id))
  }
  function addPop(id, html, w) {
    pushHistory()
    const pid = pidRef.current++
    setCfg((c) => {
      const n = c[id].pops.length
      const pop = { pid, html, w, x: 300 + (n % 3) * 70, y: 740 + (n % 4) * 90, scale: 2, theme: themes[id], bg: null, fg: null }
      return { ...c, [id]: { ...c[id], pops: [...c[id].pops, pop] } }
    })
    setActive((a) => ({ ...a, [id]: pid }))
  }
  function patchPop(id, pid, patch) {
    setCfg((c) => ({
      ...c,
      [id]: { ...c[id], pops: c[id].pops.map((p) => (p.pid === pid ? { ...p, ...patch } : p)) },
    }))
  }
  function removePop(id, pid) {
    pushHistory()
    setCfg((c) => ({ ...c, [id]: { ...c[id], pops: c[id].pops.filter((p) => p.pid !== pid) } }))
    setActive((a) => ({ ...a, [id]: null }))
    setEditing((e) => ({ ...e, [id]: null }))
  }
  function resizePop(id, pid, d) {
    pushHistory()
    setCfg((c) => ({
      ...c,
      [id]: {
        ...c[id],
        pops: c[id].pops.map((p) =>
          p.pid === pid ? { ...p, scale: Math.max(0.3, Math.round((p.scale + d) * 100) / 100) } : p,
        ),
      },
    }))
  }
  function togglePopTheme(id, pid) {
    pushHistory()
    setCfg((c) => ({
      ...c,
      [id]: {
        ...c[id],
        pops: c[id].pops.map((p) =>
          p.pid === pid ? { ...p, theme: p.theme === 'dark' ? 'light' : 'dark', bg: null, fg: null } : p,
        ),
      },
    }))
  }
  function toggleEdit(id, pid) {
    setEditing((e) => ({ ...e, [id]: e[id] === pid ? null : pid }))
  }
  function clearSel(id) {
    setActive((a) => ({ ...a, [id]: null }))
    setEditing((e) => ({ ...e, [id]: null }))
  }
  function setBlurAmt(id, d) {
    pushHistory()
    setCfg((c) => ({ ...c, [id]: { ...c[id], blur: Math.max(0, c[id].blur + d) } }))
  }
  function startDragPop(id, pid, e) {
    setActive((a) => ({ ...a, [id]: pid }))
    if (editing[id] === pid) return // editing this card: let text interactions through
    setEditing((ed) => ({ ...ed, [id]: null }))
    e.preventDefault()
    const frame = refs.current[id]
    if (!frame) return
    const ratio = frame.getBoundingClientRect().width / 1290 // preview scale
    const sx = e.clientX
    const sy = e.clientY
    const pop = cfg[id].pops.find((p) => p.pid === pid)
    if (!pop) return
    const ox = pop.x
    const oy = pop.y
    let pushed = false
    function onMove(ev) {
      if (!pushed) {
        pushHistory()
        pushed = true
      }
      patchPop(id, pid, {
        x: Math.round(ox + (ev.clientX - sx) / ratio),
        y: Math.round(oy + (ev.clientY - sy) / ratio),
      })
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  async function download(id) {
    const node = refs.current[id]
    if (!node) return
    // Drop selection chrome (ring / edit caret) and let React paint before capture.
    setPicking(null)
    setActive((a) => ({ ...a, [id]: null }))
    setEditing((e) => ({ ...e, [id]: null }))
    setGuide((g) => ({ ...g, [id]: null }))
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    // html-to-image resets scrollTop on its clone, so bake the current inner
    // scroll offset into a transform (then restore) to capture the scrolled view.
    const restore = []
    node.querySelectorAll('.screen-scroll, .chat-scroll').forEach((sc) => {
      const s = sc.scrollTop
      if (!s) return
      const kids = Array.from(sc.children)
      const prevTransforms = kids.map((k) => k.style.transform)
      const prevOverflow = sc.style.overflow
      sc.style.overflow = 'hidden'
      sc.scrollTop = 0
      kids.forEach((k) => {
        k.style.transform = `translateY(${-s}px)`
      })
      restore.push(() => {
        sc.style.overflow = prevOverflow
        kids.forEach((k, i) => {
          k.style.transform = prevTransforms[i]
        })
        sc.scrollTop = s
      })
    })
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        width: 1290,
        height: 2796,
        canvasWidth: 1290,
        canvasHeight: 2796,
        style: { transform: 'none', transformOrigin: 'top left', margin: '0' },
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `appstore-${id}.png`
      a.click()
    } finally {
      restore.forEach((r) => r())
    }
  }

  function toggleTheme(id) {
    pushHistory()
    setThemes((t) => ({ ...t, [id]: t[id] === 'dark' ? 'light' : 'dark' }))
  }

  return (
    <div className="lib-page store-page">
      <div className="store-head">
        <div>
          <h1 className="lib-title">App Store</h1>
          <p className="lib-sub">
            1290 × 2796. Click through the live app to set up each shot, edit the title, then export the PNG.
          </p>
        </div>
        <div className="store-head-tools">
          <label className="store-fontpick">
            <span>Title serif</span>
            <select value={serifIdx} onChange={(e) => setSerifIdx(Number(e.target.value))}>
              {SERIF_FONTS.map((f, i) => (
                <option key={f.family} value={i}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <button className="store-undo" onClick={undo} disabled={!history.length} title="Undo last change">
            ↩ Undo
          </button>
        </div>
      </div>

      <div
        className="store-grid"
        style={{
          '--store-serif': `'${SERIF_FONTS[serifIdx].family}', Georgia, serif`,
          '--store-serif-w': SERIF_FONTS[serifIdx].weight,
        }}
      >
        <div className="store-cell" key="story">
          <div className="store-cell-bar">
            <span className="scb-name">story · messy</span>
            <div className="scb-tools">
              <button className="scb-btn scb-png" onClick={() => download('story')}>PNG</button>
            </div>
          </div>
          <div className="store-stage">
            <StoreRuler />
            <div className="store-scaler">
              <StoryFrame frameRef={(el) => (refs.current.story = el)} />
            </div>
          </div>
        </div>
        {SHOTS.map((shot) => {
          const ap = cfg[shot.id].pops.find((p) => p.pid === active[shot.id]) || null
          return (
          <div className="store-cell" key={shot.id}>
            <div className="store-cell-bar">
              <span className="scb-name">{shot.id}</span>
              <div className="scb-tools">
                  <span className="scb-group">
                    <button className="scb-seg scb-target" onClick={() => toggleTarget(shot.id)} title="Drag the phone or title to move; − + resizes this one">
                      {targets[shot.id] === 'title' ? 'Title' : 'Phone'}
                    </button>
                    <button className="scb-seg" onClick={() => size(shot.id, -1)} title="Smaller">−</button>
                    <button className="scb-seg" onClick={() => size(shot.id, 1)} title="Bigger">+</button>
                  </span>
                  <span className="scb-group">
                    <button
                      className="scb-seg scb-fmt"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => formatTitle(shot.id, 'bold')}
                      title="Bold the selected title text (⌘B). Nothing selected bolds the whole line."
                    >
                      <b>B</b>
                    </button>
                    <button
                      className="scb-seg scb-fmt"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => formatTitle(shot.id, 'italic')}
                      title="Italic the selected title text (⌘I). Nothing selected italicizes the whole line."
                    >
                      <i>I</i>
                    </button>
                  </span>
                  <span className="scb-group">
                    <button className="scb-seg" onClick={() => toggleTheme(shot.id)}>
                      {themes[shot.id] === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </span>
                  <button className="scb-btn scb-png" onClick={() => download(shot.id)}>PNG</button>
                </div>
              <div className="scb-tools scb-colorrow">
                <span className="scb-group scb-colorgroup">
                  <span className="scb-lbl">Font</span>
                  {FG_SWATCHES.map((c) => (
                    <button
                      key={c}
                      className="scb-sw"
                      data-on={cfg[shot.id].fg === c}
                      style={{ background: c }}
                      onClick={() => setColor(shot.id, 'fg', c)}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    className="scb-pick"
                    value={cfg[shot.id].fg}
                    onChange={(e) => setColor(shot.id, 'fg', e.target.value)}
                    title="Custom font color"
                  />
                </span>
                <span className="scb-group scb-colorgroup">
                  <span className="scb-lbl">Bg</span>
                  {BG_SWATCHES.map((c) => (
                    <button
                      key={c}
                      className="scb-sw"
                      data-on={cfg[shot.id].bg === c}
                      style={{ background: c }}
                      onClick={() => setColor(shot.id, 'bg', c)}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    className="scb-pick"
                    value={cfg[shot.id].bg}
                    onChange={(e) => setColor(shot.id, 'bg', e.target.value)}
                    title="Custom background color"
                  />
                </span>
              </div>
              <div className="scb-tools">
                <span className="scb-group scb-colorgroup">
                  <span className="scb-lbl">Rim</span>
                  {RIM_COLORS.map((c) => (
                    <button
                      key={c}
                      className="scb-sw"
                      data-on={cfg[shot.id].rimColor === c}
                      style={{ background: c }}
                      onClick={() => setColor(shot.id, 'rimColor', c)}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    className="scb-pick"
                    value={cfg[shot.id].rimColor}
                    onChange={(e) => setColor(shot.id, 'rimColor', e.target.value)}
                    title="Custom rim color"
                  />
                </span>
                <span className="scb-group">
                  <span className="scb-lbl">Width</span>
                  {RIM_WIDTHS.map((rw) => (
                    <button
                      key={rw.w}
                      className="scb-seg"
                      data-on={cfg[shot.id].rimWidth === rw.w}
                      onClick={() => setColor(shot.id, 'rimWidth', rw.w)}
                    >
                      {rw.label}
                    </button>
                  ))}
                </span>
              </div>
              <div className="scb-tools scb-poprow">
                <span className="scb-group">
                  <span className="scb-lbl">Pop</span>
                  <button
                    className="scb-seg scb-pickbtn"
                    data-on={picking === shot.id}
                    onClick={() => startPick(shot.id)}
                  >
                    {picking === shot.id ? 'Tap cards…' : 'Pick'}
                  </button>
                </span>
                {ap && (
                  <span className="scb-group">
                    <span className="scb-lbl">Card</span>
                    <button
                      className="scb-seg"
                      onClick={() => togglePopTheme(shot.id, ap.pid)}
                      title="Card light / dark"
                    >
                      {ap.theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                    <button className="scb-seg" onClick={() => resizePop(shot.id, ap.pid, -0.15)} title="Smaller">−</button>
                    <button className="scb-seg" onClick={() => resizePop(shot.id, ap.pid, 0.15)} title="Bigger">+</button>
                    <button
                      className="scb-seg"
                      data-on={editing[shot.id] === ap.pid}
                      onClick={() => toggleEdit(shot.id, ap.pid)}
                      title="Edit text"
                    >
                      Edit
                    </button>
                    <button className="scb-seg" onClick={() => removePop(shot.id, ap.pid)} title="Delete card">Delete</button>
                  </span>
                )}
                <span className="scb-group">
                  <span className="scb-lbl">Blur</span>
                  <button className="scb-seg" onClick={() => setBlurAmt(shot.id, -1)} title="Less blur">−</button>
                  <button className="scb-seg" onClick={() => setBlurAmt(shot.id, 1)} title="More blur">+</button>
                </span>
              </div>
              {ap && (
                <div className="scb-tools scb-colorrow">
                  <span className="scb-group scb-colorgroup">
                    <span className="scb-lbl">Card text</span>
                    {FG_SWATCHES.map((c) => (
                      <button
                        key={c}
                        className="scb-sw"
                        data-on={ap.fg === c}
                        style={{ background: c }}
                        onClick={() => colorPop(shot.id, ap.pid, { fg: c })}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      className="scb-pick"
                      value={ap.fg || '#1b1a17'}
                      onChange={(e) => colorPop(shot.id, ap.pid, { fg: e.target.value })}
                      title="Custom card text color"
                    />
                  </span>
                  <span className="scb-group scb-colorgroup">
                    <span className="scb-lbl">Card bg</span>
                    {BG_SWATCHES.map((c) => (
                      <button
                        key={c}
                        className="scb-sw"
                        data-on={ap.bg === c}
                        style={{ background: c }}
                        onClick={() => colorPop(shot.id, ap.pid, { bg: c })}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      className="scb-pick"
                      value={ap.bg || '#f0ebe1'}
                      onChange={(e) => colorPop(shot.id, ap.pid, { bg: e.target.value })}
                      title="Custom card bg color"
                    />
                  </span>
                </div>
              )}
            </div>
            <div className="store-stage">
              <StoreRuler />
              <div className="store-scaler">
              <StoreFrame
                shot={shot}
                theme={themes[shot.id]}
                rimColor={cfg[shot.id].rimColor}
                rimWidth={cfg[shot.id].rimWidth}
                top={cfg[shot.id].top}
                scale={cfg[shot.id].scale}
                titleTop={cfg[shot.id].titleTop}
                titleScale={cfg[shot.id].titleScale}
                bg={cfg[shot.id].bg}
                fg={cfg[shot.id].fg}
                picking={picking === shot.id}
                onPick={(html, w) => addPop(shot.id, html, w)}
                pops={cfg[shot.id].pops}
                blur={cfg[shot.id].blur}
                active={active[shot.id] ?? null}
                editing={editing[shot.id] ?? null}
                onPopDown={(pid, e) => startDragPop(shot.id, pid, e)}
                onDeselect={() => clearSel(shot.id)}
                onPhoneDown={(e) => startVDrag(shot.id, 'phone', e)}
                onTitleDown={(e) => startVDrag(shot.id, 'title', e)}
                guide={guide[shot.id] ?? null}
                frameRef={(el) => (refs.current[shot.id] = el)}
              />
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
