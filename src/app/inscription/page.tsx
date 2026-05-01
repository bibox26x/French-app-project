"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"

export default function InscriptionPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptCGU: false,
  })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.acceptCGU) {
      setError("Vous devez accepter les conditions pour continuer.")
      return
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      if (data.error?.code === "EMAIL_TAKEN") {
        setError("Un compte existe déjà avec cette adresse.")
      } else if (data.error?.code === "INVALID_EMAIL") {
        setError("Adresse email invalide.")
      } else {
        setError("Une erreur est survenue. Réessayez.")
      }
      return
    }

    // Auto-sign-in after registration
    const { signIn } = await import("next-auth/react")
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/icon-mark.svg" alt="Fête, en fait" width={48} height={48} className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-semibold text-ink mb-2">Créer un compte</h1>
          <p className="text-gray-500">C'est gratuit et ça prend 30 secondes.</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-ink mb-1.5">Prénom</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  placeholder="Lucas"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-ink mb-1.5">Nom</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  placeholder="Dubois"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-ink mb-1.5">Adresse email</label>
              <input
                id="reg-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                placeholder="vous@email.fr"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-ink mb-1.5">
                Mot de passe <span className="text-gray-400 font-normal">(8 caractères minimum)</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-2.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="acceptCGU"
                type="checkbox"
                checked={form.acceptCGU}
                onChange={(e) => update("acceptCGU", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-coral focus:ring-coral"
              />
              <label htmlFor="acceptCGU" className="text-sm text-gray-600">
                J'accepte les{" "}
                <span className="text-coral font-medium cursor-pointer hover:underline">
                  conditions générales d'utilisation
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral hover:bg-[#E63946] text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Créer mon compte
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="font-medium text-coral hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
