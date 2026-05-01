import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { Plus, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HostListingCard } from "./HostListingCard"
import { PendingBookingRow } from "./PendingBookingRow"

export default async function HotePage() {
  const session = await auth()
  if (!session?.user) redirect("/connexion")
  if (session.user.role !== "host" && session.user.role !== "admin") redirect("/")

  const [listings, pendingBookings] = await Promise.all([
    prisma.listing.findMany({
      where: { hostId: session.user.id },
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        listing: { hostId: session.user.id },
        status: "pending",
      },
      include: {
        listing: { select: { title: true, city: true } },
        guest: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthBookings = await prisma.booking.count({
    where: {
      listing: { hostId: session.user.id },
      status: { in: ["confirmed", "completed"] },
      createdAt: { gte: monthStart },
    },
  })
  const monthRevenue = await prisma.booking.aggregate({
    where: {
      listing: { hostId: session.user.id },
      status: { in: ["confirmed", "completed"] },
      createdAt: { gte: monthStart },
    },
    _sum: { totalPrice: true },
  })

  const stats = [
    { label: "Annonces actives", value: listings.filter((l) => l.status === "published").length },
    { label: "Réservations en attente", value: pendingBookings.length },
    { label: "Réservations ce mois", value: monthBookings },
    { label: "Revenus simulés ce mois", value: `${monthRevenue._sum.totalPrice ?? 0} €` },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-coral flex items-center gap-1.5 mb-1">
              <LayoutDashboard className="w-4 h-4" /> Espace Hôte
            </p>
            <h1 className="text-3xl font-semibold text-ink">Mon espace hôte</h1>
          </div>
          <Button className="bg-coral hover:bg-[#E63946] text-white gap-2" asChild>
            <Link href="/hote/annonces/nouvelle">
              <Plus className="w-4 h-4" /> Nouvelle annonce
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-6 text-center">
              <p className="text-2xl font-bold text-ink mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pending bookings */}
        {pendingBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-ink mb-4">Réservations à traiter</h2>
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <PendingBookingRow key={b.id} booking={b} />
              ))}
            </div>
          </section>
        )}

        {/* Listings */}
        <section>
          <h2 className="text-xl font-semibold text-ink mb-6">Mes annonces</h2>
          {listings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <p className="text-4xl mb-4">🏠</p>
              <p className="text-gray-500 mb-6">Vous n'avez pas encore d'annonce.</p>
              <Button className="bg-coral hover:bg-[#E63946] text-white" asChild>
                <Link href="/hote/annonces/nouvelle">
                  <Plus className="w-4 h-4 mr-2" /> Créer ma première annonce
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <HostListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
