"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

interface BookingWidgetProps {
  listingId: string
  pricePerNight: number
  weekendPrice: number | null
  depositAmount: number | null
  maxGuests: number
}

function daysBetween(a: Date, b: Date): number {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)))
}

export function BookingWidget({
  listingId,
  pricePerNight,
  weekendPrice,
  depositAmount,
  maxGuests,
}: BookingWidgetProps) {
  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [guests, setGuests] = useState(1)

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0
    return daysBetween(new Date(startDate), new Date(endDate))
  }, [startDate, endDate])

  const subtotal = pricePerNight * nights
  const total = subtotal + (depositAmount ?? 0)
  const canBook = nights > 0 && guests <= maxGuests

  return (
    <div className="sticky top-24 border border-border rounded-2xl p-6 shadow-lg shadow-black/5 bg-white">
      <div className="mb-6">
        <span className="text-2xl font-semibold text-ink">{pricePerNight} €</span>
        <span className="text-gray-500 text-sm"> par nuit</span>
        {weekendPrice && (
          <p className="text-sm text-gray-500 mt-1">
            Ou <span className="font-medium text-ink">{weekendPrice} €</span> le weekend complet
          </p>
        )}
      </div>

      <form action={`/reserver/${listingId}`} method="GET" className="mb-4">
        <div className="border border-border rounded-xl mb-6 overflow-hidden focus-within:ring-2 focus-within:ring-coral/20">
          <div className="flex border-b border-border">
            <div className="flex-1 p-3 border-r border-border">
              <label htmlFor="startDate" className="block text-[10px] uppercase font-bold text-ink mb-1">
                Arrivée
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm text-ink outline-none bg-transparent cursor-pointer"
              />
            </div>
            <div className="flex-1 p-3">
              <label htmlFor="endDate" className="block text-[10px] uppercase font-bold text-ink mb-1">
                Départ
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-sm text-ink outline-none bg-transparent cursor-pointer"
              />
            </div>
          </div>
          <div className="p-3">
            <label htmlFor="guests" className="block text-[10px] uppercase font-bold text-ink mb-1">
              Voyageurs
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              min="1"
              max={maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
              className="w-full text-sm text-ink outline-none bg-transparent"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!canBook}
          className="w-full bg-coral hover:bg-peach text-white text-base py-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Réserver
        </Button>
      </form>

      {!canBook && (
        <p className="text-center text-sm text-coral font-medium mb-4">
          {nights < 1 ? "Sélectionnez vos dates pour continuer." : `Maximum ${maxGuests} voyageurs.`}
        </p>
      )}

      <p className="text-center text-sm text-gray-500 mb-6">
        Aucun montant ne vous sera débité pour le moment
      </p>

      {(depositAmount ?? 0) > 0 && (
        <div className="flex justify-between items-center text-sm mb-4">
          <span className="text-gray-600 underline decoration-dotted underline-offset-4">Caution</span>
          <span className="text-ink">{depositAmount} €</span>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        {nights > 0 && (
          <p className="text-xs text-gray-500 mb-2">
            {nights} nuit{nights > 1 ? "s" : ""} · {pricePerNight} € × {nights}
          </p>
        )}
        <div className="flex justify-between items-center font-semibold text-lg text-ink">
          <span>Total</span>
          <span>{nights > 0 ? `${total} €` : "— €"}</span>
        </div>
      </div>
    </div>
  )
}
