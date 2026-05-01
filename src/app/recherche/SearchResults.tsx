"use client"

import { useState } from "react"
import { Map as MapIcon, List, SlidersHorizontal } from "lucide-react"
import { ListingCard } from "@/components/listings/ListingCard"
import { Button } from "@/components/ui/button"
import MapLibreMap, { Marker } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

interface SearchResultsProps {
  initialListings: any[]
}

export function SearchResults({ initialListings }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

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
          
          <div className="space-y-8">
            {/* Prix */}
            <div>
              <h3 className="text-sm font-medium text-ink mb-4">Prix par nuit</h3>
              <div className="text-sm text-gray-500 italic">Slider à venir</div>
            </div>
            
            {/* Dates */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-ink mb-4">Dates</h3>
              <div className="text-sm text-gray-500 italic">Date picker à venir</div>
            </div>
            
            {/* Voyageurs */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-ink mb-4">Nombre de voyageurs</h3>
              <div className="flex items-center gap-4">
                <input type="number" min="1" className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ex: 8" />
              </div>
            </div>

            {/* Type */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-ink mb-4">Type de logement</h3>
              <div className="space-y-3">
                {['Maison', 'Villa', 'Appartement', 'Autre'].map(type => (
                  <label key={type} className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-coral focus:ring-coral" />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <Button variant="outline" className="w-full">
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header mobile (Filters + Toggle) */}
        <div className="md:hidden border-b border-border bg-white p-4 flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-2">
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

        {/* Results Header (Desktop) */}
        <div className="bg-white border-b border-border p-4 md:px-6 hidden md:flex items-center justify-between">
          <p className="text-sm text-gray-700 font-medium">
            {initialListings.length} logements trouvés
          </p>
          
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
            
            <select className="border border-border rounded-lg text-sm px-3 py-1.5 text-gray-700 bg-white outline-none focus:ring-2 focus:ring-coral/20">
              <option>Pertinence</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Plus récents</option>
            </select>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto relative">
          {viewMode === "list" ? (
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialListings.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-xl font-medium text-ink mb-2">Aucun logement trouvé</h3>
                  <p className="text-gray-500 mb-6">Essayez d'élargir vos critères ou de changer de ville.</p>
                  <Button variant="outline">Réinitialiser les filtres</Button>
                </div>
              ) : (
                initialListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-200">
              {typeof window !== 'undefined' && (
                <div style={{ width: '100%', height: '100%' }}>
                  <MapLibreMap
                    initialViewState={{
                      longitude: 2.3522, // Center on France approx (Paris)
                      latitude: 48.8566,
                      zoom: 5
                    }}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                  >
                    {initialListings.map(listing => (
                      <Marker
                        key={listing.id}
                        longitude={listing.longitude}
                        latitude={listing.latitude}
                        anchor="bottom"
                        onClick={e => {
                          e.originalEvent.stopPropagation();
                          // In a real app we'd open a popup or highlight the listing
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
