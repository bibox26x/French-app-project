import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Phone, Mail, ArrowRight, Home } from "lucide-react"
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: { listingId: string }
  searchParams: { bookingId?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/connexion")

  const resolvedSearch = await searchParams
  const bookingId = resolvedSearch.bookingId
  if (!bookingId) return notFound()

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: {
        include: {
          host: { select: { firstName: true, lastName: true, email: true, phone: true } },
        },
      },
    },
  })

  if (!booking || booking.guestId !== session.user.id) return notFound()

  const ref = `REF-${booking.id.substring(0, 8).toUpperCase()}`

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-6 flex items-start justify-center">
      <div className="w-full max-w-lg">
        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-semibold text-ink mb-2">Réservation confirmée !</h1>
          <p className="text-gray-500">Votre hôte a été notifié. Voici ses coordonnées pour la suite.</p>
        </div>

        {/* Host contact */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 pb-5 border-b border-border mb-5">
            <div className="w-12 h-12 bg-coral-50 rounded-full flex items-center justify-center text-lg font-medium text-coral-700">
              {booking.listing.host.firstName.charAt(0)}{booking.listing.host.lastName.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Votre hôte</p>
              <p className="font-semibold text-ink">{booking.listing.host.firstName} {booking.listing.host.lastName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{booking.listing.host.email}</span>
            </div>
            {booking.listing.host.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{booking.listing.host.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reference */}
        <div className="bg-gray-50 border border-border rounded-xl px-6 py-4 text-center mb-8">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Numéro de réservation</p>
          <p className="text-2xl font-bold text-ink tracking-widest font-mono">{ref}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1 bg-coral hover:bg-[#E63946] text-white" asChild>
            <Link href="/reservations">
              <ArrowRight className="w-5 h-5 mr-2" /> Voir mes réservations
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="flex-1" asChild>
            <Link href="/">
              <Home className="w-5 h-5 mr-2" /> Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
