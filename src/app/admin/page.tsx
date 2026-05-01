import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { Users, Building2, Calendar, TrendingUp } from "lucide-react"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/")

  const [userCount, listingCount, bookingCount] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.booking.count(),
  ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthBookings = await prisma.booking.count({
    where: { createdAt: { gte: monthStart } }
  })

  const stats = [
    { label: "Utilisateurs", value: userCount, icon: Users, href: "/admin/utilisateurs" },
    { label: "Annonces", value: listingCount, icon: Building2, href: "/admin/annonces" },
    { label: "Réservations", value: bookingCount, icon: Calendar, href: "/admin/reservations" },
    { label: "Réservations ce mois", value: monthBookings, icon: TrendingUp, href: "/admin/reservations" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-ink mb-10">Administration</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
              <Icon className="w-6 h-6 text-coral mb-3" />
              <p className="text-2xl font-bold text-ink mb-1">{value}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Utilisateurs", href: "/admin/utilisateurs", desc: "Gérer les comptes et rôles" },
            { label: "Annonces", href: "/admin/annonces", desc: "Masquer ou réactiver des annonces" },
            { label: "Réservations", href: "/admin/reservations", desc: "Consulter toutes les réservations" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-2xl border border-border p-6 hover:border-coral/30 hover:shadow-sm transition-all"
            >
              <p className="font-medium text-ink mb-1">{link.label}</p>
              <p className="text-sm text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
