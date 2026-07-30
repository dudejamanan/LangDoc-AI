import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  Landmark,
} from 'lucide-react'
import Header from './components/Header.jsx'
import UploadBox from './components/UploadBox.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'
import VoiceQA from './components/VoiceQA.jsx'
import { COPY, WELCOME_TRIO, WELCOME_PURPOSE, BRAND_NAME } from './content.js'
import { explainDocument } from './services/api.js'

const SCREENS = {
  WELCOME: 'welcome',
  UPLOAD: 'upload',
  LOADING: 'loading',
  RESULT: 'result',
}

const THEME_KEY = 'langdoc-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage?.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function ScreenShell({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME)
  const [language, setLanguage] = useState(null) // null until the user picks one on the welcome screen
  const [theme, setTheme] = useState(getInitialTheme)
  const [image, setImage] = useState(null) // { file, previewUrl }
  const [result, setResult] = useState(null)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    window.localStorage?.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const copy = COPY[language] || COPY.ta

  const chooseLanguage = (code) => {
    setLanguage(code)
    setScreen(SCREENS.UPLOAD)
  }

  const changeLanguage = () => {
    setLanguage(null)
    setImage(null)
    setResult(null)
    setScreen(SCREENS.WELCOME)
  }

  const handleSelectImage = (file) => {
    if (!file) {
      if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl)
      setImage(null)
      return
    }
    const previewUrl = URL.createObjectURL(file)
    setImage({ file, previewUrl })
  }

  const handleExplain = async () => {
    setScreen(SCREENS.LOADING)
    try {
      const data = await explainDocument(image?.file, language)
      setResult(data)
      setScreen(SCREENS.RESULT)
    } catch (err) {
      setScreen(SCREENS.UPLOAD)
    }
  }

  const startOver = () => {
    if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl)
    setImage(null)
    setResult(null)
    setScreen(SCREENS.UPLOAD)
  }

  if (screen === SCREENS.WELCOME) {
    return <WelcomePage theme={theme} onToggleTheme={toggleTheme} onChoose={chooseLanguage} />
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 sm:max-w-lg sm:px-8">
        <Header title={copy.appTitle} tagline={copy.tagline} />

        <AnimatePresence mode="wait">
          {screen === SCREENS.UPLOAD && (
            <ScreenShell key="upload">
              <div className="flex min-h-[70vh] flex-col justify-center gap-6 pt-6">
                <BackButton onClick={changeLanguage} label={copy.changeLanguage} />
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="font-display text-2xl font-bold text-harbor-900 dark:text-white sm:text-3xl">
                    {copy.uploadTitle}
                  </h2>
                </div>
                <UploadBox image={image} onSelect={handleSelectImage} copy={copy} />
                <motion.button
                  type="button"
                  disabled={!image}
                  whileTap={image ? { scale: 0.97 } : {}}
                  onClick={handleExplain}
                  className={`flex min-h-[64px] w-full items-center justify-center rounded-lg px-8 text-xl font-bold text-white shadow-soft transition-colors ${
                    image
                      ? 'bg-harbor-600 active:bg-harbor-700 dark:bg-harbor-500 dark:active:bg-harbor-600'
                      : 'cursor-not-allowed bg-harbor-200 dark:bg-night-border'
                  }`}
                >
                  {copy.explainButton}
                </motion.button>
              </div>
            </ScreenShell>
          )}

          {screen === SCREENS.LOADING && (
            <ScreenShell key="loading">
              <LoadingScreen steps={copy.loadingSteps} durationMs={2500} />
            </ScreenShell>
          )}

          {screen === SCREENS.RESULT && result && (
            <ScreenShell key="result">
              <div className="flex flex-col gap-6 py-6">
                <h2 className="text-center font-display text-2xl font-bold text-harbor-900 dark:text-white sm:text-3xl">
                  {copy.resultTitle}
                </h2>

                <div className="flex flex-col gap-4">
                  <ResultCard icon="documentType" label={copy.documentType} value={result.document_type} delay={0} />
                  <ResultCard icon="summary" label={copy.summary} value={result.summary} delay={0.05} />
                  <ResultCard icon="actionRequired" label={copy.actionRequired} value={result.action_required} variant="badge" delay={0.1} />
                  <ResultCard icon="deadline" label={copy.deadline} value={result.deadline} variant="highlight" delay={0.15} />
                  <ResultCard icon="priority" label={copy.priority} value={result.priority} variant="priority" delay={0.2} />
                  <ResultCard icon="urgencyReason" label={copy.urgencyReason} value={result.urgency_reason} delay={0.25} />
                  <ResultCard icon="estimatedTime" label={copy.estimatedTime} value={result.estimated_time} variant="highlight" delay={0.3} />
                  <ResultCard icon="documentsRequired" label={copy.documentsRequired} value={result.documents_required} delay={0.35} />
                  <ResultCard icon="keyPoints" label={copy.keyPoints} value={result.key_points} delay={0.4} />
                  <ResultCard icon="englishGloss" label={copy.englishGloss} value={result.english_gloss} delay={0.45} />
                </div>

                <AudioPlayer src={result.audio_url} label={copy.listenLabel} playAgainLabel={copy.playAgain} />

                <VoiceQA language={language} copy={copy} documentContext={result} />

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={startOver}
                  className="flex min-h-[60px] w-full items-center justify-center rounded-lg border-2 border-harbor-200 bg-white px-8 text-lg font-bold text-harbor-700 active:bg-harbor-50 dark:border-night-border dark:bg-night-card dark:text-white dark:active:bg-night-bg"
                >
                  {copy.newDocument}
                </motion.button>
              </div>
            </ScreenShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * The opening screen, styled after India's national/departmental portals:
 * a tricolour identity strip, a plain navy header with an emblem, a large
 * trilingual hero, a stated purpose, and — below the fold — the three
 * language options laid out horizontally.
 */
function WelcomePage({ theme, onToggleTheme, onChoose }) {
  const scrollToOptions = () => {
    document.getElementById('language-options')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors">
      {/* tricolour identity strip */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-indiagreen" />
      </div>

      {/* utility bar */}
      <div className="flex items-center justify-between border-b border-harbor-100 bg-white px-4 py-1.5 text-xs dark:border-night-border dark:bg-night-card sm:px-8">
        <a href="#language-options" className="font-body text-harbor-500 underline dark:text-harbor-300">
          Skip to language options
        </a>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex min-h-[36px] items-center gap-1.5 rounded border border-harbor-200 px-2.5 py-1 font-body font-semibold text-harbor-600 dark:border-night-border dark:text-harbor-200"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-3.5 w-3.5 text-saffron" /> Light mode
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5" /> Dark mode
            </>
          )}
        </button>
      </div>

      {/* navy header with emblem */}
      <header className="bg-harbor-800 dark:bg-night-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-8">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-saffron bg-harbor-900">
            <Landmark className="h-5 w-5 text-saffron" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-white sm:text-lg">{BRAND_NAME}</p>
            <p className="font-body text-[11px] text-harbor-200 sm:text-xs">
              Document Explanation Initiative &middot; Intelligence with Purpose
            </p>
          </div>
        </div>
      </header>

      {/* hero */}
      <main className="mx-auto max-w-5xl px-4 sm:px-8">
        <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 border-b border-harbor-100 py-10 text-center dark:border-night-border">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl font-black tracking-tight text-harbor-900 dark:text-white sm:text-5xl"
          >
            {BRAND_NAME}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
          >
            {WELCOME_TRIO.map((lang, i) => (
              <span key={lang.code} className="flex items-center gap-3">
                <span className={`${lang.scriptClass} text-xl font-bold text-harbor-700 dark:text-harbor-200 sm:text-2xl`}>
                  {lang.tagline}
                </span>
                {i < WELCOME_TRIO.length - 1 && (
                  <span className="text-xl font-light text-saffron sm:text-2xl" aria-hidden="true">|</span>
                )}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex max-w-2xl flex-col gap-2 rounded-lg border border-harbor-100 bg-white px-6 py-5 shadow-card dark:border-night-border dark:bg-night-card"
          >
            {WELCOME_TRIO.map((lang) => (
              <p key={lang.code} className={`${lang.scriptClass} font-body text-base leading-relaxed text-harbor-600 dark:text-harbor-200`}>
                {WELCOME_PURPOSE[lang.code]}
              </p>
            ))}
          </motion.div>

          <motion.button
            type="button"
            onClick={scrollToOptions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ opacity: { delay: 0.4, duration: 0.4 }, y: { delay: 0.6, duration: 1.6, repeat: Infinity } }}
            className="flex flex-col items-center gap-1 text-harbor-500 dark:text-harbor-300"
          >
            <span className="font-body text-sm">
              Scroll down to choose your language &middot; नीचे स्क्रॉल करें &middot; கீழே செல்லவும் 
            </span>
            <ChevronDown className="h-6 w-6" />
          </motion.button>
        </section>

        {/* language options — below the fold, laid out horizontally */}
        <section id="language-options" className="py-12">
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold text-harbor-900 dark:text-white">
              Choose your language &middot; भाषा चुनें &middot; மொழியைத் தேர்ந்தெடுக்கவும் 
            </h2>
            <p className="mt-1 font-body text-sm text-harbor-500 dark:text-harbor-300">
              Select one option to continue in that language only
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {WELCOME_TRIO.map((lang, i) => (
              <motion.button
                key={lang.code}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onChoose(lang.code)}
                className="flex min-h-[220px] flex-col items-center gap-3 rounded-lg border-2 border-harbor-100 bg-white p-6 text-center shadow-card transition-colors hover:border-saffron active:border-saffron dark:border-night-border dark:bg-night-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-harbor-200 text-sm font-bold text-harbor-600 dark:border-harbor-500 dark:text-harbor-200">
                  {lang.code.toUpperCase()}
                </span>
                <span className={`${lang.scriptClass} font-display text-2xl font-bold text-harbor-900 dark:text-white`}>
                  {lang.label}
                </span>
                <span className={`${lang.scriptClass} font-body text-sm leading-relaxed text-harbor-500 dark:text-harbor-300`}>
                  {lang.desc}
                </span>
                <span className={`${lang.scriptClass} mt-auto flex min-h-[52px] w-full items-center justify-center rounded-md bg-harbor-700 px-4 text-base font-bold text-white dark:bg-harbor-500`}>
                  {lang.start}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-harbor-400 dark:text-harbor-300">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-body text-xs">
              Your information stays safe  &middot; आपकी जानकारी सुरक्षित है &middot; உங்கள் தகவல் பாதுகாப்பாக உள்ளது
            </span>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="border-t border-harbor-100 bg-white px-4 py-4 text-center dark:border-night-border dark:bg-night-card sm:px-8">
        <p className="font-body text-xs text-harbor-400 dark:text-harbor-300">
          {BRAND_NAME} &middot; Built for GDG VIT Chennai &times; Gemma 4 Hackathon &middot; Track: Intelligence with Purpose
        </p>
      </footer>
    </div>
  )
}

function BackButton({ onClick, label }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex min-h-[48px] items-center gap-1 self-start text-lg font-semibold text-harbor-500 dark:text-harbor-300"
    >
      <ChevronLeft className="h-5 w-5" />
      {label}
    </motion.button>
  )
}
