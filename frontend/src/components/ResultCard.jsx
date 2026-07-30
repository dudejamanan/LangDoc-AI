import { motion } from 'framer-motion'
import {
  FileText,
  MessageCircleHeart,
  ClipboardCheck,
  CalendarClock,
  Languages,
  AlertTriangle,
  ListChecks,
  Timer,
  FolderCheck,
  Info,
} from 'lucide-react'

const ICONS = {
  documentType: FileText,
  summary: MessageCircleHeart,
  actionRequired: ClipboardCheck,
  deadline: CalendarClock,
  priority: AlertTriangle,
  urgencyReason: Info,
  estimatedTime: Timer,
  documentsRequired: FolderCheck,
  keyPoints: ListChecks,
  englishGloss: Languages,
}

/**
 * A single rounded card in the results list. `variant` controls emphasis:
 * "highlight" for the deadline (stands out), "badge" for action required
 * (colored pill), "priority" for the priority level (severity-colored
 * pill), "default" for everything else (summary, key points, etc).
 */
export default function ResultCard({ icon, label, value, variant = 'default', delay = 0 }) {
  const Icon = ICONS[icon] || FileText

  const base =
    'rounded-3xl border-2 p-5 shadow-card flex gap-4 items-start'

  const variants = {
    default: 'bg-white border-harbor-100 dark:bg-night-card dark:border-night-border',
    highlight: 'bg-clay/10 border-clay dark:bg-clay/20',
    badge: 'bg-white border-harbor-100 dark:bg-night-card dark:border-night-border',
    priority: 'bg-white border-harbor-100 dark:bg-night-card dark:border-night-border',
  }

  const priorityTone = getPriorityTone(value)

  const iconWrap = {
    default: 'bg-harbor-100 text-harbor-700 dark:bg-harbor-800 dark:text-harbor-100',
    highlight: 'bg-clay text-white',
    badge: 'bg-leaf/15 text-leaf',
    priority: priorityTone.iconWrap,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={`${base} ${variants[variant]}`}
    >
      <span
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${iconWrap[variant]}`}
      >
        <Icon className="h-6 w-6" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-body text-sm font-semibold uppercase tracking-wide text-harbor-500 dark:text-harbor-300">
          {label}
        </p>
        {variant === 'badge' ? (
          <span className="mt-2 inline-block rounded-full bg-leaf/15 px-4 py-2 text-lg font-semibold text-leaf">
            {value}
          </span>
        ) : variant === 'priority' ? (
          <span className={`mt-2 inline-block rounded-full px-4 py-2 text-lg font-semibold ${priorityTone.pill}`}>
            {value}
          </span>
        ) : (
          <p
            className={`mt-1 font-body text-xl leading-snug ${
              variant === 'highlight' ? 'font-bold text-clay' : 'text-harbor-900 dark:text-white'
            }`}
          >
            {value}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Maps a priority string to a severity color. Only recognizes English
 * keywords for now (the dummy backend response is English-only regardless
 * of chosen language, same limitation as the rest of the dummy data) —
 * falls back to a neutral navy tone for anything unrecognized, so a
 * translated value from the real backend still renders cleanly, just
 * without severity coloring until this list is extended.
 */
function getPriorityTone(value) {
  const v = (value || '').toLowerCase()
  if (v.includes('high')) {
    return { pill: 'bg-clay/15 text-clay', iconWrap: 'bg-clay text-white' }
  }
  if (v.includes('medium')) {
    return { pill: 'bg-sun/20 text-clay', iconWrap: 'bg-sun text-harbor-900' }
  }
  if (v.includes('low')) {
    return { pill: 'bg-leaf/15 text-leaf', iconWrap: 'bg-leaf/80 text-white' }
  }
  return { pill: 'bg-harbor-100 text-harbor-700 dark:bg-harbor-800 dark:text-harbor-100', iconWrap: 'bg-harbor-100 text-harbor-700 dark:bg-harbor-800 dark:text-harbor-100' }
}
