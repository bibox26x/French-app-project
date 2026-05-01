"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2, User, Mail, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [university, setUniversity] = useState("Sorbonne Université")
  const [studentId, setStudentId] = useState("")
  const [error, setError] = useState("")

  if (!session?.user) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>
  }

  const { user } = session

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsVerifying(true)

    // Simuler un délai de vérification
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const res = await fetch("/api/users/me/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university, studentId }),
      })

      if (!res.ok) {
        throw new Error("Échec de la vérification")
      }

      await update({ ...session, user: { ...user, isVerifiedStudent: true } })
      setShowModal(false)
      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue lors de la vérification. Veuillez réessayer.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink mb-8">Mon Profil</h1>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="w-16 h-16 bg-coral-50 rounded-full flex items-center justify-center text-2xl font-medium text-coral-700">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {user.isVerifiedStudent ? (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Étudiant vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Non vérifié
                    </span>
                  )}
                  <span className="inline-block bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {!user.isVerifiedStudent && (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-ink mb-2">Vérification étudiante</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Pour réserver sur Fête, en fait, vous devez prouver que vous êtes étudiant. La vérification prend 2 minutes.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-coral hover:bg-[#E63946] text-white"
            >
              <GraduationCap className="w-4 h-4 mr-2" /> Vérifier mon statut étudiant
            </Button>
          </div>
        )}
      </div>

      {/* MODAL DE VÉRIFICATION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-ink mb-2">Vérification de statut</h3>
              <p className="text-sm text-gray-500 mb-6">
                Pour ce prototype, cette étape est simulée. Entrez n'importe quelle information.
              </p>

              {error && (
                <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Établissement</label>
                  <select
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  >
                    <option>Sorbonne Université</option>
                    <option>EPITA</option>
                    <option>Université Paris-Saclay</option>
                    <option>Sciences Po</option>
                    <option>HEC Paris</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Numéro étudiant (fictif)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 20249876"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                    disabled={isVerifying}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-coral hover:bg-[#E63946] text-white"
                    disabled={isVerifying || !studentId}
                  >
                    {isVerifying ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Traitement...</>
                    ) : (
                      "Soumettre"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
