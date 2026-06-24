import { motion, AnimatePresence } from 'framer-motion'

export default function ConsentModal({ onAccept, onDecline }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-6">
            <span className="text-2xl">🔒</span>
          </div>

          {/* Title */}
          <h2 className="text-white text-2xl font-bold mb-2">Before we begin</h2>
          <p className="text-gray-400 text-sm mb-6">
            The Digital Footprint Visualizer collects information about your online habits
            to help you understand your privacy exposure. Please read and accept the following:
          </p>

          {/* Terms list */}
          <div className="space-y-3 mb-8">
            {[
              'Your data is anonymised and used only for this research study',
              'No sensitive personal information is collected without your knowledge',
              'You can withdraw and delete your data at any time',
              'Data will not be shared with third parties',
              'Participation is entirely voluntary',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 text-xs">✓</span>
                </div>
                <p className="text-gray-300 text-sm">{item}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-lg transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-2 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              I Accept & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}