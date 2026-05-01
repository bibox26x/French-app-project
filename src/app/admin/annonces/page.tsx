export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"
import Image from "next/image"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { ToggleListingButton } from "./ToggleListingButton"

export default async function AdminListingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/")

  const listings = await prisma.listing.findMany({
    include: {
      host: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-ink mb-8">Toutes les annonces</h1>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Photo</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Titre</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Hôte</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Ville</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Statut</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((l) => {
                  let cover = ""
                  try { cover = JSON.parse(l.photos)[0] || "" } catch {}
                  return (
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        {cover ? (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden">
                            <Image src={cover} alt={l.title} fill className="object-cover" sizes="48px" />
                          </div>
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-gray-200" />
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-ink max-w-[200px]">
                        <p className="line-clamp-1">{l.title}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{l.host.firstName} {l.host.lastName}</td>
                      <td className="px-5 py-3 text-gray-600">{l.city}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${l.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {l.status === "published" ? "Publiée" : "Masquée"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <ToggleListingButton listingId={l.id} currentStatus={l.status} />
                      </td>
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
