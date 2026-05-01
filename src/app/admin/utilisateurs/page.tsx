import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { ShieldCheck } from "lucide-react"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-ink mb-8">Utilisateurs</h1>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Nom</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Rôle</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Vérifié</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-ink">{u.firstName} {u.lastName}</td>
                    <td className="px-5 py-4 text-gray-600">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === "admin" ? "bg-purple-100 text-purple-700"
                        : u.role === "host" ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {u.isVerifiedStudent ? (
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {u.createdAt.toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
