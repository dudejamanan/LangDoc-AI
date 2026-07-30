import { motion } from 'framer-motion'
import { Landmark } from 'lucide-react'

/**
 * Navy top bar shown on every screen after language selection.
 * Modeled on the plain, emblem-plus-wordmark header used by Indian
 * government portals rather than a decorative app header.
 */
export default function Header({ title = 'LangDoc AI', tagline }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="-mx-5 flex items-center gap-3 bg-harbor-800 px-5 py-3 dark:bg-night-card sm:-mx-8 sm:px-8"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-saffron bg-harbor-900">
        <Landmark className="h-5 w-5 text-saffron" strokeWidth={2} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold text-white">
          {title}
        </span>
        {tagline && (
          <span className="font-body text-xs text-harbor-200">{tagline}</span>
        )}
      </div>
    </motion.header>
  )
}
