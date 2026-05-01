"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const PROPERTY_TYPES = ["Maison", "Villa", "Appartement", "Autre"]
const AMENITIES_OPTIONS = [
  "piscine", "parking", "jardin", "sono", "barbecue",
  "lave-vaisselle", "machine à laver", "wifi", "terrasse", "cuisine équipée"
]

const STEPS = ["Les bases", "Localisation", "Détails", "Photos", "Tarifs"]

type FormData = {
  title: string
  description: string
  propertyType: string
  addressLine: string
  city: string
  latitude: string
  longitude: string
  maxGuests: string
  bedrooms: string
  amenities: string[]
  houseRules: string
  photos: string[]
  pricePerNight: string
  weekendPrice: string
  depositAmount: string
}

export default function NouvellAnnoncePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [error, setError] = useState("")
  const [newPhotoUrl, setNewPhotoUrl] = useState("")

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    propertyType: "Maison",
    addressLine: "",
    city: "",
    latitude: "",
    longitude: "",
    maxGuests: "10",
    bedrooms: "3",
    amenities: [],
    houseRules: "",
    photos: [],
    pricePerNight: "",
    weekendPrice: "",
    depositAmount: "",
  })

  function update(field: keyof FormData, value: string | string[]) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleAmenity(amenity: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }))
  }

  function addPhoto() {
    if (newPhotoUrl.trim()) {
      setForm((f) => ({ ...f, photos: [...f.photos, newPhotoUrl.trim()] }))
      setNewPhotoUrl("")
    }
  }

  function removePhoto(idx: number) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }))
  }

  async function geocode() {
    if (!form.addressLine || !form.city) return
    setGeocoding(true)
    try {
      const query = encodeURIComponent(`${form.addressLine}, ${form.city}, France`)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      const data = await res.json()
      if (data[0]) {
        update("latitude", data[0].lat)
        update("longitude", data[0].lon)
      }
    } catch {}
    setGeocoding(false)
  }

  async function handleSubmit() {
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxGuests: parseInt(form.maxGuests),
          bedrooms: parseInt(form.bedrooms),
          pricePerNight: parseFloat(form.pricePerNight),
          weekendPrice: form.weekendPrice ? parseFloat(form.weekendPrice) : null,
          depositAmount: form.depositAmount ? parseFloat(form.depositAmount) : 0,
          latitude: parseFloat(form.latitude) || 0,
          longitude: parseFloat(form.longitude) || 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error?.message || "Une erreur est survenue.")
        setLoading(false)
        return
      }
      router.push("/hote")
    } catch {
      setError("Une erreur est survenue. Réessayez.")
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? "bg-green-500 text-white"
                  : i === step ? "bg-coral text-white"
                  : "bg-gray-200 text-gray-500"
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-coral" : "text-gray-400"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-ink mb-2">
            Étape {step + 1}/5 — {STEPS[step]}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {[
              "Dites-nous l'essentiel sur votre logement.",
              "Où se trouve votre logement ?",
              "Capacité, équipements et règles.",
              "Ajoutez des photos via URL (Unsplash recommandé).",
              "Définissez vos tarifs."
            ][step]}
          </p>

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Titre de l'annonce</label>
                <input type="text" placeholder="Villa avec piscine pour vos weekends" value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
                <textarea rows={5} placeholder="Décrivez votre logement, ce qui le rend spécial, le quartier…" value={form.description} onChange={(e) => update("description", e.target.value)} className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-3">Type de logement</label>
                <div className="grid grid-cols-2 gap-3">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("propertyType", t)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${form.propertyType === t ? "border-coral bg-coral-50 text-coral" : "border-border text-gray-600 hover:border-gray-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Adresse</label>
                <input type="text" placeholder="12 Chemin des Oliviers" value={form.addressLine} onChange={(e) => update("addressLine", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Ville</label>
                <input type="text" placeholder="Marseille" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} />
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={geocode} disabled={geocoding}>
                {geocoding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Géocoder l'adresse
              </Button>
              {form.latitude && form.longitude && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  ✓ Coordonnées : {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
                </div>
              )}
              <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-400">
                Prévisualisation carte (MapLibre)
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Voyageurs max</label>
                  <input type="number" min="1" value={form.maxGuests} onChange={(e) => update("maxGuests", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Chambres</label>
                  <input type="number" min="1" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-3">Équipements</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES_OPTIONS.map((a) => (
                    <label key={a} className="flex items-center gap-2 capitalize cursor-pointer">
                      <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="w-4 h-4 rounded border-gray-300 text-coral focus:ring-coral" />
                      <span className="text-sm text-gray-700">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Règles de la maison</label>
                <textarea rows={3} placeholder="Ex: Pas de fumée à l'intérieur…" value={form.houseRules} onChange={(e) => update("houseRules", e.target.value)} className={inputCls + " resize-none"} />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">Pour la démo, collez 3 à 8 URLs d'images (Unsplash par exemple).</p>
              <div className="flex gap-2">
                <input type="url" placeholder="https://images.unsplash.com/..." value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} className={inputCls} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())} />
                <Button type="button" variant="outline" onClick={addPhoto}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.photos.length > 0 && (
                <ul className="space-y-2">
                  {form.photos.map((url, i) => (
                    <li key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-sm">
                      <img src={url} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                      <span className="flex-1 truncate text-gray-700">{url}</span>
                      <button type="button" onClick={() => removePhoto(i)} className="text-red-400 hover:text-red-600 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Prix par nuit (€)</label>
                <input type="number" min="0" placeholder="300" value={form.pricePerNight} onChange={(e) => update("pricePerNight", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex justify-between">
                  Prix forfait weekend (vendredi → dimanche)
                  <span className="font-normal text-gray-400">(optionnel)</span>
                </label>
                <input type="number" min="0" placeholder="800" value={form.weekendPrice} onChange={(e) => update("weekendPrice", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex justify-between">
                  Caution
                  <span className="font-normal text-gray-400">(optionnel)</span>
                </label>
                <input type="number" min="0" placeholder="500" value={form.depositAmount} onChange={(e) => update("depositAmount", e.target.value)} className={inputCls} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                className="bg-coral hover:bg-[#E63946] text-white gap-1"
                onClick={() => setStep((s) => s + 1)}
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={loading}
                className="bg-coral hover:bg-[#E63946] text-white gap-1"
                onClick={handleSubmit}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Publier l'annonce
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
