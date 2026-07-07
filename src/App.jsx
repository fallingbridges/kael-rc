import { useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame.jsx'
import ComponentLibrary from './screens/ComponentLibrary.jsx'
import BrandGuide from './screens/BrandGuide.jsx'
import StoreScreens from './screens/StoreScreens.jsx'
import Onboarding from './screens/Onboarding.jsx'
import OnboardingV2 from './screens/OnboardingV2.jsx'
import OnboardingV3 from './screens/OnboardingV3.jsx'
import OnboardingV4 from './screens/OnboardingV4.jsx'
import OnboardingV5 from './screens/OnboardingV5.jsx'
import OnboardingV6 from './screens/OnboardingV6.jsx'
import OnboardingV7 from './screens/OnboardingV7.jsx'
import CloseV8 from './screens/CloseV8.jsx'
import ReflectConcept, { Home as ReflectHome, Room as ReflectRoom, autoTone } from './screens/ReflectConcept.jsx'
import FirstRunConcept from './screens/FirstRunConcept.jsx'
import PaywallLab from './screens/PaywallLab.jsx'
import ReflectionCards from './screens/ReflectionCards.jsx'
import KaelDuo from './screens/KaelDuo.jsx'
import IntroConcept from './screens/IntroConcept.jsx'
import JourneyConcept from './screens/JourneyConcept.jsx'
import { Sparkle, Sun, Moon, Download, Grid } from './components/Icons.jsx'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [view, setView] = useState('app')
  const [studioTab, setStudioTab] = useState('components')
  const [reflectView, setReflectView] = useState({ kind: 'home' })
  const [reflectTone, setReflectTone] = useState('auto') // preview the invitation card across the day
  const [doneTones, setDoneTones] = useState({}) // which time-windows already have a reflection → card collapses
  const [scale, setScale] = useState(0.72)

  const currentTone = reflectTone === 'auto' ? autoTone() : reflectTone

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

  const ease = [0.22, 0.61, 0.36, 1]

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
    a.download = `kael-reflect-${theme}.png`
    a.click()
  }

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
                data-on={studioTab === 'onboarding-v5'}
                onClick={() => setStudioTab('onboarding-v5')}
              >
                Onboarding V5
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v6'}
                onClick={() => setStudioTab('onboarding-v6')}
              >
                Onboarding V6
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v7'}
                onClick={() => setStudioTab('onboarding-v7')}
              >
                Onboarding V7
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'v8close'}
                onClick={() => setStudioTab('v8close')}
              >
                V8 Close
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'reflect'}
                onClick={() => setStudioTab('reflect')}
              >
                Reflect
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'firstrun'}
                onClick={() => setStudioTab('firstrun')}
              >
                First run
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
              <button
                className="studio-tab"
                data-on={studioTab === 'duo'}
                onClick={() => setStudioTab('duo')}
              >
                2-Screen
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'intro'}
                onClick={() => setStudioTab('intro')}
              >
                Intro
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'journey'}
                onClick={() => setStudioTab('journey')}
              >
                Journey
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
              ) : studioTab === 'onboarding-v5' ? (
                <OnboardingV5 />
              ) : studioTab === 'onboarding-v6' ? (
                <OnboardingV6 />
              ) : studioTab === 'onboarding-v7' ? (
                <OnboardingV7 />
              ) : studioTab === 'v8close' ? (
                <CloseV8 />
              ) : studioTab === 'reflect' ? (
                <ReflectConcept />
              ) : studioTab === 'firstrun' ? (
                <FirstRunConcept />
              ) : studioTab === 'paywall' ? (
                <PaywallLab />
              ) : studioTab === 'cards' ? (
                <ReflectionCards />
              ) : studioTab === 'duo' ? (
                <KaelDuo />
              ) : studioTab === 'intro' ? (
                <IntroConcept />
              ) : studioTab === 'journey' ? (
                <JourneyConcept />
              ) : (
                <Onboarding />
              )}
            </div>
          </div>
        ) : (
        <>
        {reflectView.kind === 'home' && (
          <div className="reflect-tone-demo">
            {[['auto', 'Auto'], ['dawn', 'Dawn'], ['day', 'Day'], ['dusk', 'Evening'], ['night', 'Night']].map(([id, label]) => (
              <button key={id} className="rf-demo-chip" data-on={reflectTone === id || undefined} onClick={() => setReflectTone(id)}>{label}</button>
            ))}
            <span className="rf-demo-sep" />
            <button
              className="rf-demo-chip"
              data-on={doneTones[currentTone] || undefined}
              onClick={() => setDoneTones((d) => ({ ...d, [currentTone]: !d[currentTone] }))}
            >
              Reflected
            </button>
          </div>
        )}
        <motion.div
          className="stage-device"
          style={{ '--scale': scale }}
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          <PhoneFrame theme={theme} hideNav>
            {reflectView.kind === 'home' ? (
              <ReflectHome
                promptTone={reflectTone === 'auto' ? undefined : reflectTone}
                reflected={!!doneTones[currentTone]}
                onInvite={() => { setDoneTones((d) => ({ ...d, [currentTone]: true })); setReflectView({ kind: 'new' }) }}
                onReopen={() => setReflectView({ kind: 'new' })}
                onNew={() => setReflectView({ kind: 'new' })}
                onOpen={(id) => setReflectView({ kind: 'old', id })}
              />
            ) : (
              <ReflectRoom
                key={reflectView.kind === 'old' ? `old-${reflectView.id}` : 'new'}
                mode={reflectView}
                onBack={() => setReflectView({ kind: 'home' })}
                onNew={() => setReflectView({ kind: 'new' })}
              />
            )}
          </PhoneFrame>
        </motion.div>
        </>
        )}
      </main>
    </div>
  )
}
