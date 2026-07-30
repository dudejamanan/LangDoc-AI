import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, MessageCircleQuestion, AlertCircle } from 'lucide-react'
import AudioPlayer from './AudioPlayer.jsx'
import { askQuestion } from '../services/api.js'

const LOCALES = { ta: 'ta-IN', hi: 'hi-IN', en: 'en-IN' }

/**
 * Lets the person ask follow-up questions about the document that was
 * just explained, by voice. Shown on the Result screen, below the main
 * AudioPlayer. Each question becomes a card with the transcribed
 * question, a text answer, and a spoken answer (reusing AudioPlayer).
 *
 * Falls back to a text input if the browser has no SpeechRecognition
 * support, or if the microphone permission is denied.
 */
export default function VoiceQA({ language, copy, documentContext }) {
  const [history, setHistory] = useState([])
  const [listening, setListening] = useState(false)
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [error, setError] = useState(null)
  const [textMode, setTextMode] = useState(false)
  const [textValue, setTextValue] = useState('')
  const recognitionRef = useRef(null)

  const SpeechRecognitionCtor =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    if (!SpeechRecognitionCtor) setTextMode(true)
    return () => {
      recognitionRef.current?.stop?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitQuestion = async (question) => {
    const trimmed = (question || '').trim()
    if (!trimmed) return
    setError(null)
    setLoadingAnswer(true)
    try {
      const data = await askQuestion(trimmed, documentContext, language)
      setHistory((h) => [
        ...h,
        {
          id: `${Date.now()}-${h.length}`,
          question: trimmed,
          answerText: data.answer_text,
          audioUrl: data.audio_url,
        },
      ])
    } catch (err) {
      setError(copy.qaMicError)
    } finally {
      setLoadingAnswer(false)
    }
  }

  const startListening = () => {
    setError(null)
    if (!SpeechRecognitionCtor) {
      setTextMode(true)
      setError(copy.qaUnsupported)
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = LOCALES[language] || 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => {
      setListening(false)
      setTextMode(true)
      setError(copy.qaMicError)
    }
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript
      if (transcript) submitQuestion(transcript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleTextSubmit = (e) => {
    e.preventDefault()
    submitQuestion(textValue)
    setTextValue('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="rounded-3xl border-2 border-harbor-100 bg-white p-5 shadow-card dark:border-night-border dark:bg-night-card"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-harbor-100 text-harbor-700 dark:bg-harbor-800 dark:text-harbor-100">
          <MessageCircleQuestion className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-harbor-900 dark:text-white">{copy.qaTitle}</p>
          <p className="font-body text-sm text-harbor-500 dark:text-harbor-300">{copy.qaHelp}</p>
        </div>
      </div>

      <AnimatePresence>
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-4 flex flex-col gap-2 border-t-2 border-harbor-100 pt-4 dark:border-night-border"
          >
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-harbor-500 dark:text-harbor-300">
              {copy.qaYourQuestion}
            </p>
            <p className="font-body text-lg text-harbor-900 dark:text-white">{item.question}</p>

            <p className="mt-2 font-body text-sm font-semibold uppercase tracking-wide text-harbor-500 dark:text-harbor-300">
              {copy.qaAnswerLabel}
            </p>
            <p className="font-body text-lg leading-snug text-harbor-900 dark:text-white">{item.answerText}</p>

            <AudioPlayer src={item.audioUrl} label={copy.qaListenAnswer} playAgainLabel={copy.qaPlayAgain} />
          </motion.div>
        ))}
      </AnimatePresence>

      {loadingAnswer && (
        <p className="mb-4 text-center font-body text-base text-harbor-500 dark:text-harbor-300">
          {copy.qaThinking}
        </p>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-clay/40 bg-clay/10 px-4 py-3 text-clay">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="font-body text-sm">{error}</p>
        </div>
      )}

      {!textMode ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={startListening}
          disabled={listening || loadingAnswer}
          className={`flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl px-6 text-xl font-semibold text-white shadow-soft transition-colors ${
            listening
              ? 'animate-pulse bg-clay'
              : 'bg-harbor-700 active:bg-harbor-800 dark:bg-harbor-500 dark:active:bg-harbor-600'
          } ${loadingAnswer ? 'opacity-60' : ''}`}
        >
          <Mic className="h-6 w-6" strokeWidth={2.2} />
          {listening ? copy.qaListening : copy.qaMicIdle}
        </motion.button>
      ) : (
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={copy.qaTextPlaceholder}
            className="min-h-[60px] flex-1 rounded-lg border-2 border-harbor-200 bg-white px-4 text-lg text-harbor-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-harbor-500 dark:border-night-border dark:bg-night-bg dark:text-white"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loadingAnswer || !textValue.trim()}
            className="flex min-h-[60px] items-center justify-center gap-2 rounded-lg bg-harbor-700 px-6 text-lg font-semibold text-white active:bg-harbor-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-harbor-500 dark:active:bg-harbor-600"
          >
            <Send className="h-5 w-5" />
            {copy.qaTextSend}
          </motion.button>
        </form>
      )}
    </motion.div>
  )
}
