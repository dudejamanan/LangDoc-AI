import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ImageUp, RotateCcw } from 'lucide-react'

/**
 * Lets the person capture a photo with their camera or pick an existing
 * image. Shows an immediate preview once a file is chosen.
 */
export default function UploadBox({ image, onSelect, copy }) {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onSelect(file)
  }

  if (image) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border-2 border-harbor-100 bg-white shadow-card dark:border-night-border dark:bg-night-card"
      >
        <img
          src={image.previewUrl}
          alt="Uploaded document preview"
          className="max-h-72 w-full object-contain bg-harbor-50 dark:bg-night-bg"
        />
        <button
          type="button"
          onClick={() => {
            cameraInputRef.current.value = ''
            galleryInputRef.current.value = ''
            onSelect(null)
          }}
          className="flex w-full min-h-[60px] items-center justify-center gap-2 border-t-2 border-harbor-100 py-3 text-lg font-semibold text-harbor-700 active:bg-harbor-50 dark:border-night-border dark:text-harbor-200 dark:active:bg-night-bg"
        >
          <RotateCcw className="h-5 w-5" />
          {copy.changeImage}
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="empty-upload"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border-2 border-dashed border-harbor-200 bg-harbor-50/60 p-6 dark:border-night-border dark:bg-night-card/60"
      >
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <ImageUp className="h-10 w-10 text-harbor-400 dark:text-harbor-300" strokeWidth={1.8} />
          <p className="font-body text-base text-harbor-500 dark:text-harbor-200">{copy.uploadHelp}</p>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => cameraInputRef.current.click()}
            className="flex min-h-[64px] items-center justify-center gap-3 rounded-2xl bg-harbor-700 px-6 text-xl font-semibold text-white shadow-soft active:bg-harbor-800 dark:bg-harbor-500 dark:active:bg-harbor-600"
          >
            <Camera className="h-6 w-6" strokeWidth={2.2} />
            {copy.takePhoto}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => galleryInputRef.current.click()}
            className="flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border-2 border-harbor-200 bg-white px-6 text-xl font-semibold text-harbor-700 active:bg-harbor-50 dark:border-night-border dark:bg-night-card dark:text-white dark:active:bg-night-bg"
          >
            <ImageUp className="h-6 w-6" strokeWidth={2.2} />
            {copy.uploadImage}
          </motion.button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  )
}
