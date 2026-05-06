"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Map as MapIcon, List, SlidersHorizontal, X } from "lucide-react"
import { ListingCard } from "@/components/listings/ListingCard"
import { Button } from "@/components/ui/button"
import MapLibreMap, { Marker } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

interface SearchResultsProps {
  initialListings: any[]
  cityFilter?: string
}

export function SearchResults({ initialListings, cityFilter = "" }: SearchResultsProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  // Filters
  const [priceMax, setPriceMax] = useState(500)
  const [minGuests, setMinGuests] = useState(1)
  const [propertyTypes, setPropertyTypes] = useState<Set<string>>(new Set())
  const [activeCityFilter, setActiveCityFilter] = useState(cityFilter)
  const [sortBy, setSortBy] = useState("recents")

  // Mobile filter visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  function togglePropertyType(type: string) {
    setPropertyTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  function clearCityFilter() {
    setActiveCityFilter("")
  }

  function resetFilters() {
    setPriceMax(500)
    setMinGuests(1)
    setPropertyTypes(new Set())
    setActiveCityFilter("")
    setSortBy("recents")
  }

  const filteredListings = useMemo(() => {
    let result = [...initialListings]

    // City filter
    if (activeCityFilter) {
      const q = activeCityFilter.toLowerCase()
      result = result.filter((l) => l.city.toLowerCase().includes(q))
    }

    // Price filter
    result = result.filter((l) => l.pricePerNight <= priceMax)

    // Guests filter
    result = result.filter((l) => l.maxGuests >= minGuests)

    // Property type filter
    if (propertyTypes.size > 0) {
      result = result.filter((l) => {
        if (propertyTypes.has("Autre")) {
          if (!["Maison", "Villa", "Appartement"].includes(l.propertyType)) return true
        }
        return propertyTypes.has(l.propertyType)
      })
    }

    // Sort
    switch (sortBy) {
      case "prix-asc":
        result.sort((a, b) => a.pricePerNight - b.pricePerNight)
        break
      case "prix-desc":
        result.sort((a, b) => b.pricePerNight - a.pricePerNight)
        break
      case "recents":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [initialListings, activeCityFilter, priceMax, minGuests, propertyTypes, sortBy])

  const filterContent = (
    <div className="space-y-8">
      {/* Prix */}
      <div>
        <h3 className="text-sm font-medium text-ink mb-4">Prix par nuit</h3>
        <p className="text-sm text-gray-700 mb-2">Jusqu'à {priceMax} € / nuit</p>
        <input
          type="range"
          min={0}
          max={500}
          step={10}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-coral"
        />
      </div>

      {/* Voyageurs */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-ink mb-4">Nombre de voyageurs</h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            value={minGuests}
            onChange={(e) => setMinGuests(Math.max(1, Number(e.target.value)))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: 8"
          />
        </div>
      </div>

      {/* Type */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-ink mb-4">Type de logement</h3>
        <div className="space-y-3">
          {["Maison", "Villa", "Appartement", "Autre"].map((type) => (
            <label key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-coral focus:ring-coral"
                checked={propertyTypes.has(type)}
                onChange={() => togglePropertyType(type)}
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* SIDEBAR FILTERS (Desktop) */}
      <aside className="w-full md:w-64 lg:w-80 shrink-0 border-r border-border bg-white hidden md:block overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-ink flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
            </h2>
          </div>

          {filterContent}

          <div className="mt-8 pt-6 border-t border-border">
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header mobile (Filters + Toggle) */}
        <div className="md:hidden border-b border-border bg-white p-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filtres
          </Button>
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-ink" : "text-gray-500"}`}
            >
              <List className="w-4 h-4" /> Liste
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${viewMode === "map" ? "bg-white shadow-sm text-ink" : "text-gray-500"}`}
            >
              <MapIcon className="w-4 h-4" /> Carte
            </button>
          </div>
        </div>

        {/* Mobile filters panel */}
        {showMobileFilters && (
          <div className="md:hidden border-b border-border bg-white p-4">
            {filterContent}
            <div className="mt-6 pt-6 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  resetFilters()
                  setShowMobileFilters(false)
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}

        {/* Results Header (Desktop) */}
        <div className="bg-white border-b border-border p-4 md:px-6 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-700 font-medium">
              {filteredListings.length} logements trouvés
            </p>
            {activeCityFilter && (
              <span className="inline-flex items-center gap-1 bg-coral-50 text-coral-700 text-xs font-medium px-2.5 py-1 rounded-full border border-coral-200">
                Ville : {activeCityFilter}
                <button onClick={clearCityFilter} className="hover:text-coral-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-ink" : "text-gray-500"}`}
              >
                <List className="w-4 h-4" /> Liste
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${viewMode === "map" ? "bg-white shadow-sm text-ink" : "text-gray-500"}`}
              >
                <MapIcon className="w-4 h-4" /> Carte
              </button>
            </div>

            <select
              className="border border-border rounded-lg text-sm px-3 py-1.5 text-gray-700 bg-white outline-none focus:ring-2 focus:ring-coral/20"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recents">Plus récents</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Mobile results header with city pill */}
        <div className="md:hidden bg-white border-b border-border px-4 py-2 flex items-center gap-3">
          <p className="text-sm text-gray-700 font-medium">
            {filteredListings.length} logements trouvés
          </p>
          {activeCityFilter && (
            <span className="inline-flex items-center gap-1 bg-coral-50 text-coral-700 text-xs font-medium px-2.5 py-1 rounded-full border border-coral-200">
              Ville : {activeCityFilter}
              <button onClick={clearCityFilter} className="hover:text-coral-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto relative">
          {viewMode === "list" ? (
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-xl font-medium text-ink mb-2">Aucun logement trouvé</h3>
                  <p className="text-gray-500 mb-6">Essayez d'élargir vos critères ou de changer de ville.</p>
                  <Button variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
                </div>
              ) : (
                filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-200">
              {filteredListings.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-ink mb-2">Aucun logement trouvé</h3>
                    <p className="text-gray-500 mb-6">Essayez d'élargir vos critères ou de changer de ville.</p>
                    <Button variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
                  </div>
                </div>
              ) : null}
              {typeof window !== "undefined" && (
                <div style={{ width: "100%", height: "100%" }}>
                  <MapLibreMap
                    initialViewState={{
                      longitude: 2.3522,
                      latitude: 48.8566,
                      zoom: 5,
                    }}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                  >
                    {filteredListings.map((listing) => (
                      <Marker
                        key={listing.id}
                        longitude={listing.longitude}
                        latitude={listing.latitude}
                        anchor="bottom"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation()
                          router.push(`/annonce/${listing.id}`)
                        }}
                      >
                        <div className="bg-coral text-white px-2 py-1 rounded-full font-bold shadow-md cursor-pointer text-xs">
                          {listing.pricePerNight} €
                        </div>
                      </Marker>
                    ))}
                  </MapLibreMap>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
