"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"
import { Loader2, Lock, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PaiementPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const listingId = params.listingId as string

  const total = searchParams.get("total") || "0"
  const nights = searchParams.get("nights") || "1"
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const guests = searchParams.get("guests") || "1"

  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function formatCard(val: string) {
    return val.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim()
  }
  function formatExpiry(val: string) {
    const d = val.replace(/\D/g, "").substring(0, 4)
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, startDate, endDate, guestCount: parseInt(guests) }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error?.message || "Une erreur est survenue. Réessayez.")
        setLoading(false)
        return
      }

      router.push(`/reserver/${listingId}/confirmation?bookingId=${data.booking.id}`)
    } catch {
      setError("Une erreur est survenue. Réessayez.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-xl">
        <Link
          href={`/reserver/${listingId}?startDate=${startDate}&endDate=${endDate}&guests=${guests}`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-ink mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Retour au récapitulatif
        </Link>

        <h1 className="text-3xl font-semibold text-ink mb-2">Paiement</h1>
        <p className="text-gray-500 mb-8 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-green-500" /> Paiement 100 % sécurisé.
        </p>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-ink mb-1.5">Numéro de carte</label>
              <input
                id="cardNumber"
                type="text"
                required
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) => update("cardNumber", formatCard(e.target.value))}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-mono tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-ink mb-1.5">Date d'expiration (MM/AA)</label>
                <input
                  id="expiry"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="12/26"
                  value={form.expiry}
                  onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-mono"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-ink mb-1.5">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="123"
                  maxLength={4}
                  value={form.cvc}
                  onChange={(e) => update("cvc", e.target.value.replace(/\D/g, "").substring(0, 4))}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-ink mb-1.5">Nom sur la carte</label>
              <input
                id="cardName"
                type="text"
                required
                placeholder="LUCAS DUBOIS"
                value={form.name}
                onChange={(e) => update("name", e.target.value.toUpperCase())}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all uppercase tracking-wider"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-coral hover:bg-[#E63946] text-white mt-2 py-6 text-base"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Traitement en cours…</>
              ) : (
                `Confirmer le paiement de ${total} €`
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 px-4">
          Démo : aucun paiement réel n'est traité. Cette plateforme est un projet pédagogique.
        </p>
      </div>
    </div>
  )
}
