"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    setLoading(true)
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    }
  }

  if (confirming) {
    return (
      <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-800 font-medium mb-3">
          Êtes-vous sûr·e ? Cette action est irréversible.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => setConfirming(false)}
          >
            Annuler
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
            onClick={handleCancel}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Confirmer l'annulation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={() => setConfirming(true)}
    >
      <XCircle className="w-4 h-4 mr-2" /> Annuler la réservation
    </Button>
  )
}
