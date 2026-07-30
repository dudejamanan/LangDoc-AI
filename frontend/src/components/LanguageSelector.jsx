import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const LANGUAGES = [
  { code: 'ta', label: 'தமிழ்', sublabel: 'Tamil', scriptClass: 'lang-ta' },
  { code: 'hi', label: 'हिन्दी', sublabel: 'Hindi', scriptClass: 'lang-hi' },
  { code: 'en', label: 'English', sublabel: 'English', scriptClass: '' },
]

/**
 * Large tap targets for choosing the explanation language.
 * Selected language gets a solid blue background, per spec.
 */
export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {LANGUAGES.map((lang, i) => {
        const selected = value === lang.code
        return (
          <motion.button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            whileTap={{ scale: 0.96 }}
            aria-pressed={selected}
            className={`relative flex min-h-[92px] flex-col items-center justify-center gap-1 rounded-3xl border-2 px-4 py-6 shadow-card transition-colors ${
              selected
                ? 'border-harbor-700 bg-harbor-700 text-white'
                : 'border-harbor-100 bg-white text-harbor-900 hover:border-harbor-300 dark:border-night-border dark:bg-night-card dark:text-white dark:hover:border-harbor-400'
            }`}
          >
            {selected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-sun text-white"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </motion.span>
            )}
            <span className={`${lang.scriptClass} text-2xl font-semibold`}>
              {lang.label}
            </span>
            <span
              className={`text-sm font-medium ${
                selected ? 'text-harbor-100' : 'text-harbor-500'
              }`}
            >
              {lang.sublabel}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
