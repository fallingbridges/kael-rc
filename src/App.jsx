import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import ChatScreen from './screens/ChatScreen.jsx'
import YouScreen from './screens/YouScreen.jsx'
import JourneyScreen from './screens/JourneyScreen.jsx'
import LearnScreen from './screens/LearnScreen.jsx'
import LessonScreen from './screens/LessonScreen.jsx'
import ComponentLibrary from './screens/ComponentLibrary.jsx'
import BrandGuide from './screens/BrandGuide.jsx'
import StoreScreens from './screens/StoreScreens.jsx'
import Onboarding from './screens/Onboarding.jsx'
import OnboardingV2 from './screens/OnboardingV2.jsx'
import OnboardingV3 from './screens/OnboardingV3.jsx'
import OnboardingV4 from './screens/OnboardingV4.jsx'
import PaywallLab from './screens/PaywallLab.jsx'
import ReflectionCards from './screens/ReflectionCards.jsx'
import { Sparkle, Sun, Moon, Download, Grid } from './components/Icons.jsx'
import { kaelReply, chipExchange, moodExchange } from './kael.js'
import { getLesson } from './lessons.js'

function nowTime() {
  return new Date()
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .toLowerCase()
}

const SEED = [
  { id: 1, who: 'user', text: 'He said he needs space and now I’m spiraling.', time: '9:32 am' },
  {
    id: 2,
    who: 'kael',
    text: 'Let’s slow it down. What part hurts most right now: the distance, the ambiguity, or what it seems to mean about you?',
  },
]

function ScreenView({ tab, messages, typing, handlers }) {
  switch (tab) {
    case 'chat':
      return (
        <ChatScreen
          messages={messages}
          typing={typing}
          onSend={handlers.sendText}
          onChip={handlers.sendChip}
          onBack={handlers.goHome}
        />
      )
    case 'you':
      return (
        <YouScreen
          onNavigate={handlers.goChat}
          onOpenSheet={handlers.openSheet}
          onPrompt={handlers.startFromPrompt}
        />
      )
    case 'journey':
      return <JourneyScreen onNavigate={handlers.goChat} onOpenSheet={handlers.openSheet} />
    case 'learn':
      return <LearnScreen onOpenLesson={handlers.openLesson} />
    default:
      return (
        <HomeScreen
          onPrompt={handlers.startFromPrompt}
          onMood={handlers.bringMood}
          onOpenRead={handlers.goYou}
        />
      )
  }
}

export default function App() {
  const [theme, setTheme] = useState('light')
  const [view, setView] = useState('app')
  const [studioTab, setStudioTab] = useState('components')
  const [tab, setTab] = useState('home')
  const [messages, setMessages] = useState(SEED)
  const [typing, setTyping] = useState(false)
  const [scale, setScale] = useState(0.72)
  const [activeLesson, setActiveLesson] = useState(null)
  const [sheet, setSheet] = useState(null)

  useLayoutEffect(() => {
    const fit = () => {
      const topH = document.querySelector('.stage-top')?.offsetHeight ?? 52
      const avail = window.innerHeight - topH - 20
      const s = Math.min(avail / 954, (window.innerWidth - 28) / 452, 1)
      setScale(Math.max(0.4, s))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const idRef = useRef(SEED.length + 1)
  const timerRef = useRef(null)
  const ease = [0.22, 0.61, 0.36, 1]

  const nextId = () => idRef.current++

  function respond(replyText) {
    setTyping(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, { id: nextId(), who: 'kael', text: replyText }])
      setTyping(false)
    }, 950)
  }

  function sendText(text) {
    const clean = text.trim()
    if (!clean) return
    setMessages((m) => [...m, { id: nextId(), who: 'user', text: clean, time: nowTime() }])
    respond(kaelReply(clean))
  }

  function sendChip(type) {
    const { user, kael } = chipExchange(type)
    setMessages((m) => [...m, { id: nextId(), who: 'user', text: user, time: nowTime() }])
    respond(kael)
  }

  function startFromPrompt(label) {
    setTab('chat')
    sendText(label)
  }

  function bringMood(id) {
    const { user, kael } = moodExchange(id)
    setTab('chat')
    setMessages((m) => [...m, { id: nextId(), who: 'user', text: user, time: nowTime() }])
    respond(kael)
  }

  function openLesson(id) {
    setActiveLesson(id)
  }

  function discussLesson(lesson) {
    setActiveLesson(null)
    setTab('chat')
    sendText(`I just read “${lesson.title}.” It stirred something up. Can we talk about it?`)
  }

  function openSheet(detail) {
    setSheet(detail)
  }

  function sheetCta(message) {
    setSheet(null)
    setTab('chat')
    sendText(message)
  }

  async function downloadShot() {
    const node = document.querySelector('.phone-screen')
    if (!node) return
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      style: { borderRadius: '0px' },
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `kael-${tab}-${theme}.png`
    a.click()
  }

  const handlers = {
    sendText,
    sendChip,
    goChat: () => setTab('chat'),
    goHome: () => setTab('home'),
    goYou: () => setTab('you'),
    startFromPrompt,
    bringMood,
    openLesson,
    openSheet,
  }

  const lesson = activeLesson ? getLesson(activeLesson) : null

  return (
    <div className="stage" data-theme={theme}>
      <motion.header
        className="stage-top"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="brand-mark">
          <span className="brand-glyph">
            <Sparkle size={24} sw={1.5} />
          </span>
          <div>
            <div className="brand-name">Kael</div>
            <div className="brand-caption">Relationship intelligence</div>
          </div>
        </div>
        <div className="top-controls">
          <button
            className="shot-btn"
            data-on={view === 'studio'}
            onClick={() => setView((v) => (v === 'studio' ? 'app' : 'studio'))}
            aria-label="Design studio"
          >
            <Grid size={17} sw={1.6} />
          </button>
          {view === 'app' && (
            <button className="shot-btn" onClick={downloadShot} aria-label="Download screen as PNG">
              <Download size={17} sw={1.6} />
            </button>
          )}
          <div className="toggle" role="group" aria-label="Theme">
            <button data-on={theme === 'light'} onClick={() => setTheme('light')} aria-label="Light">
              <Sun size={17} />
            </button>
            <button data-on={theme === 'dark'} onClick={() => setTheme('dark')} aria-label="Dark">
              <Moon size={17} />
            </button>
          </div>
        </div>
      </motion.header>

      <main className="stage-main">
        {view === 'studio' ? (
          <div className="studio">
            <div className="studio-tabs">
              <button
                className="studio-tab"
                data-on={studioTab === 'components'}
                onClick={() => setStudioTab('components')}
              >
                Components
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'brand'}
                onClick={() => setStudioTab('brand')}
              >
                Brand
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'store'}
                onClick={() => setStudioTab('store')}
              >
                App Store
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding'}
                onClick={() => setStudioTab('onboarding')}
              >
                Onboarding
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v2'}
                onClick={() => setStudioTab('onboarding-v2')}
              >
                Onboarding V2
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v3'}
                onClick={() => setStudioTab('onboarding-v3')}
              >
                Onboarding V3
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v4'}
                onClick={() => setStudioTab('onboarding-v4')}
              >
                Onboarding V4
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'paywall'}
                onClick={() => setStudioTab('paywall')}
              >
                Paywalls
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'cards'}
                onClick={() => setStudioTab('cards')}
              >
                Cards
              </button>
            </div>
            <div className="studio-body">
              {studioTab === 'components' ? (
                <ComponentLibrary />
              ) : studioTab === 'brand' ? (
                <BrandGuide />
              ) : studioTab === 'store' ? (
                <StoreScreens />
              ) : studioTab === 'onboarding-v2' ? (
                <OnboardingV2 />
              ) : studioTab === 'onboarding-v3' ? (
                <OnboardingV3 />
              ) : studioTab === 'onboarding-v4' ? (
                <OnboardingV4 />
              ) : studioTab === 'paywall' ? (
                <PaywallLab />
              ) : studioTab === 'cards' ? (
                <ReflectionCards />
              ) : (
                <Onboarding />
              )}
            </div>
          </div>
        ) : (
        <motion.div
          className="stage-device"
          style={{ '--scale': scale }}
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          <PhoneFrame
            theme={theme}
            active={tab}
            onSelect={setTab}
            hideNav={tab === 'chat'}
            overlay={
              lesson ? (
                <LessonScreen
                  lesson={lesson}
                  onBack={() => setActiveLesson(null)}
                  onDiscuss={discussLesson}
                />
              ) : null
            }
            sheet={sheet}
            onCloseSheet={() => setSheet(null)}
            onSheetCta={sheetCta}
          >
            <ScreenView tab={tab} messages={messages} typing={typing} handlers={handlers} />
          </PhoneFrame>
        </motion.div>
        )}
      </main>
    </div>
  )
}
