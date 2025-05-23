"use client"

import { motion } from "framer-motion"

interface PresentationControlsProps {
  isActive: boolean
  onToggle: () => void
}

export function PresentationControls({ isActive, onToggle }: PresentationControlsProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-4 left-4 z-50 rounded-full p-3 shadow-lg bg-[#DEA742] text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      aria-label={isActive ? "Desactivar modo presentación" : "Activar modo presentación"}
    >
      <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.5 }}>
        {isActive ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        )}
      </motion.div>
    </motion.button>
  )
}
