import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ChevronRight, CheckCircle, ListChecks } from 'lucide-react'
import AudioPlayer from './AudioPlayer.jsx'
import { guideForm } from '../services/api.js'

/**
 * Provides step-by-step guidance for filling forms.
 * Shown only when the document is identified as a form with sections.
 * Users can start the guide and then navigate through each section.
 */
export default function Guide({ sessionId, copy }) {
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [totalSteps, setTotalSteps] = useState(0)

  const startGuide = async () => {
    setLoading(true)
    try {
      const data = await guideForm(sessionId, 'start')
      if (data.completed) {
        setCompleted(true)
        setActive(false)
      } else {
        setCurrentStep(data)
        setTotalSteps(data.total_steps)
        setActive(true)
      }
    } catch (err) {
      console.error('Failed to start guide:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = async () => {
    setLoading(true)
    try {
      const data = await guideForm(sessionId, 'next')
      if (data.completed) {
        setCompleted(true)
        setActive(false)
        setCurrentStep(null)
      } else {
        setCurrentStep(data)
      }
    } catch (err) {
      console.error('Failed to get next step:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!active && !completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="rounded-3xl border-2 border-harbor-100 bg-white p-5 shadow-card dark:border-night-border dark:bg-night-card"
      >
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-harbor-100 text-harbor-700 dark:bg-harbor-800 dark:text-harbor-100">
            <ListChecks className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-harbor-900 dark:text-white">
              {copy.guideTitle || 'Form Guidance'}
            </p>
            <p className="font-body text-sm text-harbor-500 dark:text-harbor-300">
              {copy.guideHelp || 'Get step-by-step help filling this form'}
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={startGuide}
          disabled={loading}
          className="flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-harbor-700 px-6 text-lg font-semibold text-white shadow-soft transition-colors active:bg-harbor-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-harbor-500 dark:active:bg-harbor-600"
        >
          <Play className="h-5 w-5" />
          {loading ? (copy.guideLoading || 'Starting...') : (copy.guideStart || 'Start Guide')}
        </motion.button>
      </motion.div>
    )
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-2 border-saffron/30 bg-saffron/5 p-5 dark:border-saffron/20 dark:bg-saffron/10"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-saffron text-white">
            <CheckCircle className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-harbor-900 dark:text-white">
              {copy.guideCompleted || 'Guide Completed!'}
            </p>
            <p className="font-body text-sm text-harbor-600 dark:text-harbor-300">
              {copy.guideCompletedMessage || 'You have completed all the steps.'}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border-2 border-harbor-100 bg-white p-5 shadow-card dark:border-night-border dark:bg-night-card"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-harbor-100 text-harbor-700 dark:bg-harbor-800 dark:text-harbor-100">
          <ListChecks className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-harbor-900 dark:text-white">
              {copy.guideTitle || 'Form Guidance'}
            </p>
            <span className="font-body text-sm font-semibold text-harbor-500 dark:text-harbor-300">
              {currentStep?.step || 0} / {totalSteps}
            </span>
          </div>
          <p className="font-body text-sm text-harbor-500 dark:text-harbor-300">
            {copy.guideHelp || 'Follow the steps below'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 rounded-2xl border-2 border-harbor-100 bg-harbor-50 p-4 dark:border-night-border dark:bg-night-bg"
          >
            <h3 className="mb-2 font-display text-xl font-bold text-harbor-900 dark:text-white">
              {currentStep.section?.title || `Step ${currentStep.step}`}
            </h3>
            <p className="font-body text-base leading-relaxed text-harbor-700 dark:text-harbor-200">
              {currentStep.section?.instruction || currentStep.speech}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {currentStep?.audio_url && (
        <AudioPlayer
          src={currentStep.audio_url}
          label={copy.guideListen || 'Listen to instructions'}
          playAgainLabel={copy.guidePlayAgain || 'Play Again'}
        />
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={nextStep}
        disabled={loading}
        className="mt-4 flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-harbor-700 px-6 text-lg font-semibold text-white shadow-soft transition-colors active:bg-harbor-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-harbor-500 dark:active:bg-harbor-600"
      >
        {loading ? (
          <>{copy.guideLoading || 'Loading...'}</>
        ) : (
          <>
            {copy.guideNext || 'Next Step'}
            <ChevronRight className="h-5 w-5" />
          </>
        )}
      </motion.button>
    </motion.div>
  )
}
