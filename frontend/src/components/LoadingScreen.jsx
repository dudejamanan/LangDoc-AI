import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Search, PenLine, Volume2, BookOpenText } from 'lucide-react'

const ICONS = [Brain, Search, PenLine, Volume2]

/**
 * Full-screen animated progress sequence shown while the document is
 * being analyzed. Cycles through the given steps roughly in step with
 * the real request, so it never feels like a dead spinner.
 */
export default function LoadingScreen({ steps, durationMs = 2500 }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const stepDuration = durationMs / steps.length
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveIndex(i), i * stepDuration)
    )
    return () => timers.forEach(clearTimeout)
  }, [steps, durationMs])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-10 px-4 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -6, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-24 w-24 items-center justify-center rounded-3xl bg-harbor-700 shadow-soft animate-breathe"
      >
        <BookOpenText className="h-12 w-12 text-white" strokeWidth={1.8} />
      </motion.div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center gap-3"
          >
            {(() => {
              const Icon = ICONS[activeIndex % ICONS.length]
              return (
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sun/20 text-sun"
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </motion.span>
              )
            })()}
            <p className="font-display text-xl font-semibold text-harbor-900 dark:text-white sm:text-2xl">
              {steps[activeIndex]}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-harbor-700 dark:bg-harbor-400'
                  : i < activeIndex
                  ? 'w-2 bg-harbor-300 dark:bg-harbor-600'
                  : 'w-2 bg-harbor-100 dark:bg-night-border'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
