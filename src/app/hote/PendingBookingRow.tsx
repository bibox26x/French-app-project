"use client"

import { useState } from "react"
import { Loader2, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function PendingBookingRow({ booking }: { booking: any }) {
  const [loading, setLoading] = useState<"confirm" | "decline" | null>(null)
  const router = useRouter()

  async function handleAction(action: "confirmed" | "declined") {
    setLoading(action === "confirmed" ? "confirm" : "decline")
    await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-medium text-ink text-sm line-clamp-1">{booking.listing.title}</p>
        <p className="text-xs text-gray-500">
          {booking.guest.firstName} {booking.guest.lastName} · {booking.listing.city}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(booking.startDate).toLocaleDateString("fr-FR")} → {new Date(booking.endDate).toLocaleDateString("fr-FR")}
          {" "}· {booking.guestCount} voy.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 gap-1"
          disabled={!!loading}
          onClick={() => handleAction("declined")}
        >
          {loading === "decline" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Refuser
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white gap-1"
          disabled={!!loading}
          onClick={() => handleAction("confirmed")}
        >
          {loading === "confirm" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Confirmer
        </Button>
      </div>
    </div>
  )
}
