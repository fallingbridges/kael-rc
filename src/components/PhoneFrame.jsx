import { AnimatePresence, motion } from 'framer-motion'
import StatusBar from './StatusBar.jsx'
import BottomNav from './BottomNav.jsx'
import BottomSheet from './BottomSheet.jsx'

const screenVariants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const ease = [0.22, 0.61, 0.36, 1]

export default function PhoneFrame({
  theme,
  active,
  onSelect,
  hideNav = false,
  overlay = null,
  sheet = null,
  onCloseSheet,
  onSheetCta,
  children,
}) {
  return (
    <div className="phone-reserve">
      <div className="phone-scaler">
        <div className="phone">
          <div className="phone-screen" data-theme={theme}>
            <StatusBar tone="light" />
            <div className="screen-body">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  style={{ position: 'absolute', inset: 0 }}
                  variants={screenVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  transition={{ duration: 0.34, ease }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>

            {!hideNav && <BottomNav active={active} onSelect={onSelect} />}
            <div className="home-indicator" />

            <AnimatePresence>
              {overlay && (
                <motion.div
                  className="overlay-layer"
                  key="overlay"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.34, ease }}
                >
                  {overlay}
                </motion.div>
              )}
            </AnimatePresence>

            <BottomSheet sheet={sheet} onClose={onCloseSheet} onCta={onSheetCta} />
          </div>
        </div>
      </div>
    </div>
  )
}
