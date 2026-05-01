import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { Calendar, Users, Home, Mail, Phone, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CancelBookingButton } from "./CancelBookingButton"

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending:   { label: "En attente de confirmation", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmée",                   className: "bg-green-100 text-green-800 border-green-200" },
  declined:  { label: "Refusée par l'hôte",          className: "bg-red-100 text-red-800 border-red-200" },
  cancelled: { label: "Annulée",                      className: "bg-gray-100 text-gray-600 border-gray-200" },
  completed: { label: "Terminée",                     className: "bg-gray-100 text-gray-600 border-gray-200" },
}

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/connexion")

  const resolvedParams = await params
  const booking = await prisma.booking.findUnique({
    where: { id: resolvedParams.id },
    include: {
      listing: {
        include: {
          host: { select: { firstName: true, lastName: true, email: true, phone: true } },
        },
      },
    },
  })

  if (!booking || booking.guestId !== session.user.id) return notFound()

  let cover = ""
  try { cover = JSON.parse(booking.listing.photos)[0] || "" } catch {}

  const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending
  const canCancel = booking.status === "pending" || booking.status === "confirmed"
  const showHostContact = booking.status === "confirmed" || booking.status === "completed"
  const ref = `REF-${booking.id.substring(0, 8).toUpperCase()}`

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl">
        <Link href="/reservations" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-ink mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Mes réservations
        </Link>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Cover */}
          {cover && (
            <div className="relative h-48 w-full">
              <Image src={cover} alt={booking.listing.title} fill className="object-cover" sizes="672px" />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Status + reference */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-ink mb-1">{booking.listing.title}</h1>
                <p className="text-sm text-gray-500">{booking.listing.city}</p>
              </div>
              <span className={`shrink-0 inline-block text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            </div>

            <div className="text-xs font-medium text-gray-400">
              Réf : <span className="font-mono text-ink font-bold tracking-widest">{ref}</span>
            </div>

            {/* Dates & guests */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Dates
                </p>
                <p className="text-sm text-ink font-medium">
                  {new Date(booking.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  <br />
                  → {new Date(booking.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Voyageurs
                </p>
                <p className="text-sm text-ink font-medium">
                  {booking.guestCount} voyageur{booking.guestCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Sous-total</span>
                <span>{booking.totalPrice} €</span>
              </div>
              {booking.depositAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Caution</span>
                  <span>{booking.depositAmount} €</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-ink text-base pt-2 border-t border-border">
                <span>Total payé</span>
                <span>{booking.totalPrice + (booking.depositAmount || 0)} €</span>
              </div>
            </div>

            {/* Host contact (only if confirmed/completed) */}
            {showHostContact ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="text-sm font-semibold text-green-900 mb-3">Coordonnées de votre hôte</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <span className="font-medium">{booking.listing.host.firstName} {booking.listing.host.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{booking.listing.host.email}</span>
                  </div>
                  {booking.listing.host.phone && (
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{booking.listing.host.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                Les coordonnées de votre hôte vous seront communiquées après confirmation du paiement.
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/annonce/${booking.listing.id}`}>
                  <Home className="w-4 h-4 mr-2" /> Voir l'annonce
                </Link>
              </Button>
              {canCancel && <CancelBookingButton bookingId={booking.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
