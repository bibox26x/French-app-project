import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export default async function AdminReservationsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/")

  const bookings = await prisma.booking.findMany({
    include: {
      listing: { select: { title: true, city: true } },
      guest: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    pending:   { label: "En attente",  className: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Confirmée",   className: "bg-green-100 text-green-700" },
    declined:  { label: "Refusée",     className: "bg-red-100 text-red-700" },
    cancelled: { label: "Annulée",     className: "bg-gray-100 text-gray-500" },
    completed: { label: "Terminée",    className: "bg-gray-100 text-gray-500" },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-ink mb-8">Toutes les réservations</h1>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  {["Référence", "Annonce", "Voyageur", "Dates", "Statut", "Total"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => {
                  const status = STATUS_LABELS[b.status] || STATUS_LABELS.pending
                  const ref = `REF-${b.id.substring(0, 8).toUpperCase()}`
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-gray-600">{ref}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-ink line-clamp-1 max-w-[160px]">{b.listing.title}</p>
                        <p className="text-xs text-gray-400">{b.listing.city}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{b.guest.firstName} {b.guest.lastName}</p>
                        <p className="text-xs text-gray-400">{b.guest.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {new Date(b.startDate).toLocaleDateString("fr-FR")} →
                        <br />{new Date(b.endDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-ink">{b.totalPrice} €</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
