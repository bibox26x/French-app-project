import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, Users, CreditCard } from "lucide-react"

export default async function RecapPage({
  params,
  searchParams,
}: {
  params: { listingId: string }
  searchParams: { startDate?: string; endDate?: string; guests?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/connexion")

  const resolvedParams = await params
  const resolvedSearch = await searchParams

  const listing = await prisma.listing.findUnique({
    where: { id: resolvedParams.listingId },
    include: {
      host: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
  })
  if (!listing) return notFound()

  const startDate = resolvedSearch.startDate || ""
  const endDate = resolvedSearch.endDate || ""
  const guestCount = parseInt(resolvedSearch.guests || "1", 10)

  // Calculate nights
  let nights = 1
  let subtotal = listing.pricePerNight
  if (startDate && endDate) {
    const s = new Date(startDate)
    const e = new Date(endDate)
    nights = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)))
    subtotal = listing.pricePerNight * nights
  }
  const total = subtotal + (listing.depositAmount || 0)

  const photos = (() => {
    try { return JSON.parse(listing.photos) } catch { return [] }
  })()
  const cover = photos[0] || ""

  const searchStr = new URLSearchParams({
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    guests: String(guestCount),
  }).toString()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <Link href={`/annonce/${listing.id}`} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-ink mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Modifier ma réservation
        </Link>

        <h1 className="text-3xl font-semibold text-ink mb-8">Récapitulatif de votre réservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">
            {/* Listing preview */}
            <div className="bg-white rounded-2xl border border-border p-6 flex items-center gap-5">
              {cover && (
                <div className="w-24 h-20 relative rounded-xl overflow-hidden shrink-0">
                  <Image src={cover} alt={listing.title} fill className="object-cover" sizes="96px" />
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{listing.city}</p>
                <h2 className="font-semibold text-ink text-lg leading-snug">{listing.title}</h2>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-medium text-ink flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-coral" /> Dates
              </h3>
              {startDate && endDate ? (
                <p className="text-gray-700">
                  Du <strong>{new Date(startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</strong> au{" "}
                  <strong>{new Date(endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>
                  {" "}· <strong>{nights}</strong> nuit{nights > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="text-gray-400 italic">Aucune date sélectionnée</p>
              )}
            </div>

            {/* Voyageurs */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-medium text-ink flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-coral" /> Voyageurs
              </h3>
              <p className="text-gray-700">
                <strong>{guestCount}</strong> voyageur{guestCount > 1 ? "s" : ""}
              </p>
            </div>

            {/* Contact note */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-sm text-blue-800">
              <CreditCard className="w-5 h-5 mb-2 text-blue-600" />
              Les coordonnées de votre hôte vous seront communiquées après confirmation du paiement.
            </div>
          </div>

          {/* RIGHT — Prix & CTA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-ink text-lg mb-6">Récapitulatif de prix</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>{listing.pricePerNight} € × {nights} nuit{nights > 1 ? "s" : ""}</span>
                  <span>{subtotal} €</span>
                </div>
                {(listing.depositAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Caution</span>
                    <span>{listing.depositAmount} €</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex justify-between font-semibold text-lg text-ink">
                <span>Total</span>
                <span>{total} €</span>
              </div>

              <Button
                size="lg"
                className="w-full bg-coral hover:bg-[#E63946] text-white mt-6"
                asChild
              >
                <Link
                  href={`/reserver/${listing.id}/paiement?${searchStr}&total=${total}&nights=${nights}`}
                >
                  Continuer vers le paiement
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
