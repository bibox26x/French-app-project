import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending:   { label: "En attente de confirmation", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmée",                   className: "bg-green-100 text-green-800 border-green-200" },
  declined:  { label: "Refusée par l'hôte",          className: "bg-red-100 text-red-800 border-red-200" },
  cancelled: { label: "Annulée",                      className: "bg-gray-100 text-gray-600 border-gray-200" },
  completed: { label: "Terminée",                     className: "bg-gray-100 text-gray-600 border-gray-200" },
}

export default async function ReservationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/connexion")

  const bookings = await prisma.booking.findMany({
    where: { guestId: session.user.id },
    include: {
      listing: {
        select: { id: true, title: true, city: true, photos: true },
      },
    },
    orderBy: { startDate: "asc" },
  })

  const now = new Date()
  const upcoming = bookings.filter(
    (b) => new Date(b.endDate) >= now && b.status !== "cancelled" && b.status !== "declined"
  )
  const past = bookings.filter(
    (b) => new Date(b.endDate) < now || b.status === "completed"
  )
  const cancelled = bookings.filter(
    (b) => b.status === "cancelled" || b.status === "declined"
  )

  function BookingCard({ booking }: { booking: (typeof bookings)[0] }) {
    let cover = ""
    try { cover = JSON.parse(booking.listing.photos)[0] || "" } catch {}

    const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending

    return (
      <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
        {cover ? (
          <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0">
            <Image src={cover} alt={booking.listing.title} fill className="object-cover" sizes="80px" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-ink text-sm line-clamp-2 leading-snug">{booking.listing.title}</h3>
            <span className={`inline-block shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1">{booking.listing.city}</p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(booking.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              {" → "}
              {new Date(booking.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {booking.guestCount} voy.
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 mt-1">
          <Link href={`/reservation/${booking.id}`}>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    )
  }

  function EmptyState() {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl mb-4">🏡</p>
        <h3 className="text-xl font-medium text-ink mb-2">Aucune réservation pour l'instant</h3>
        <Button asChild className="mt-4 bg-coral hover:bg-[#E63946] text-white">
          <Link href="/recherche">Découvrir les logements</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-ink mb-8">Mes réservations</h1>

        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-10">
            {/* À venir */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">À venir</h2>
              {upcoming.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Aucune réservation à venir.</p>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
              )}
            </section>

            {/* Passées */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Passées</h2>
              {past.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Aucune réservation passée.</p>
              ) : (
                <div className="space-y-4">
                  {past.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
              )}
            </section>

            {/* Annulées */}
            {cancelled.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Annulées</h2>
                <div className="space-y-4">
                  {cancelled.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
