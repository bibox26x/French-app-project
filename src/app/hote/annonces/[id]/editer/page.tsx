"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2, Plus, Trash2, Check, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PROPERTY_TYPES = ["Maison", "Villa", "Appartement", "Autre"]
const AMENITIES_OPTIONS = [
  "piscine", "parking", "jardin", "sono", "barbecue",
  "lave-vaisselle", "machine à laver", "wifi", "terrasse", "cuisine équipée"
]

export default function EditerAnnoncePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [newPhotoUrl, setNewPhotoUrl] = useState("")

  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`)
        if (!res.ok) throw new Error("Annonce introuvable")
        const data = await res.json()
        
        // Parse JSON arrays back into arrays
        let photos = []
        let amenities = []
        try { photos = JSON.parse(data.listing.photos || "[]") } catch {}
        try { amenities = JSON.parse(data.listing.amenities || "[]") } catch {}
        
        setForm({
          ...data.listing,
          photos,
          amenities,
          maxGuests: String(data.listing.maxGuests),
          bedrooms: String(data.listing.bedrooms),
          pricePerNight: String(data.listing.pricePerNight),
          weekendPrice: data.listing.weekendPrice ? String(data.listing.weekendPrice) : "",
          depositAmount: data.listing.depositAmount ? String(data.listing.depositAmount) : "",
          latitude: String(data.listing.latitude || ""),
          longitude: String(data.listing.longitude || ""),
        })
      } catch (err) {
        setError("Impossible de charger cette annonce.")
      } finally {
        setFetching(false)
      }
    }
    fetchListing()
  }, [params.id])

  function update(field: string, value: any) {
    setForm((f: any) => ({ ...f, [field]: value }))
  }

  function toggleAmenity(amenity: string) {
    setForm((f: any) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a: string) => a !== amenity)
        : [...f.amenities, amenity],
    }))
  }

  function addPhoto() {
    if (newPhotoUrl.trim()) {
      setForm((f: any) => ({ ...f, photos: [...f.photos, newPhotoUrl.trim()] }))
      setNewPhotoUrl("")
    }
  }

  function removePhoto(idx: number) {
    setForm((f: any) => ({ ...f, photos: f.photos.filter((_: any, i: number) => i !== idx) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const res = await fetch(`/api/listings/${params.id}`, {
        method: "PATCH",
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
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error?.message || "Erreur de sauvegarde")
      }
      
      router.push("/hote")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.")
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"

  if (fetching) return <div className="p-10 text-center text-gray-500">Chargement...</div>
  if (!form) return <div className="p-10 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <Link href="/hote" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-ink mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Retour à l'espace hôte
        </Link>
        
        <h1 className="text-3xl font-semibold text-ink mb-8">Modifier l'annonce</h1>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Titre & Description */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">Informations principales</h2>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Titre</label>
                <input required type="text" value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
                <textarea required rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-3">Type de logement</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("propertyType", t)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${form.propertyType === t.toLowerCase() || form.propertyType === t ? "border-coral bg-coral-50 text-coral" : "border-border text-gray-600 hover:border-gray-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">Localisation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Adresse complète</label>
                  <input type="text" value={form.addressLine} onChange={(e) => update("addressLine", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Ville</label>
                  <input required type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Capacités & Équipements */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">Détails</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Voyageurs max</label>
                  <input required type="number" min="1" value={form.maxGuests} onChange={(e) => update("maxGuests", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Chambres</label>
                  <input required type="number" min="1" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-3">Équipements</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                <textarea rows={3} value={form.houseRules} onChange={(e) => update("houseRules", e.target.value)} className={inputCls + " resize-none"} />
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">Photos</h2>
              <div className="flex gap-2">
                <input type="url" placeholder="URL de l'image (ex: Unsplash)" value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} className={inputCls} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())} />
                <Button type="button" variant="outline" onClick={addPhoto}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.photos.length > 0 && (
                <ul className="space-y-2">
                  {form.photos.map((url: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-sm border border-border">
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

            {/* Prix */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-ink border-b border-border pb-2">Tarification</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Prix / nuit (€)</label>
                  <input required type="number" min="0" value={form.pricePerNight} onChange={(e) => update("pricePerNight", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Prix weekend (€)</label>
                  <input type="number" min="0" value={form.weekendPrice} onChange={(e) => update("weekendPrice", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Caution (€)</label>
                  <input type="number" min="0" value={form.depositAmount} onChange={(e) => update("depositAmount", e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button type="submit" disabled={loading} className="bg-coral hover:bg-[#E63946] text-white px-8">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
