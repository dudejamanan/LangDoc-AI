import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, RotateCcw } from 'lucide-react'

/**
 * Plays the spoken explanation. Tries to autoplay as soon as the audio
 * source is available; browsers that block autoplay still show a normal
 * player + a large "listen again" button so the person is never stuck.
 */
export default function AudioPlayer({ src, label, playAgainLabel }) {
  const audioRef = useRef(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => setBlocked(true))
    }
  }, [src])

  const replay = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => setBlocked(true))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-3xl border-2 border-harbor-100 bg-harbor-900 p-5 text-white shadow-soft"
    >
      <div className="mb-3 flex items-center gap-2">
        <Volume2 className="h-6 w-6 text-sun" strokeWidth={2.2} />
        <p className="font-display text-lg font-semibold">{label}</p>
      </div>

      <audio ref={audioRef} src={src} controls className="w-full rounded-xl">
        Your browser does not support audio playback.
      </audio>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={replay}
        className="mt-4 flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-white/10 text-lg font-semibold text-white active:bg-white/20"
      >
        <RotateCcw className="h-5 w-5" />
        {playAgainLabel}
      </motion.button>

      {blocked && (
        <p className="mt-2 text-center text-sm text-harbor-200">
          Tap the play button above to start listening.
        </p>
      )}
    </motion.div>
  )
}
