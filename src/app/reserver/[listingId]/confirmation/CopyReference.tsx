"use client"

import { useState } from "react"

export function CopyReference({ bookingRef }: { bookingRef: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bookingRef)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard not available — ignore silently
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="relative bg-gray-50 border border-border rounded-xl px-6 py-4 text-center w-full hover:bg-gray-100 transition-colors"
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Numéro de réservation</p>
      <p className="text-2xl font-bold text-ink tracking-widest font-mono">{bookingRef}</p>
      {copied && (
        <span className="absolute top-2 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
          Copié !
        </span>
      )}
    </button>
  )
}
