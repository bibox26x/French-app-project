"use client"

import MapLibreMap, { Marker } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

export function MapLocation({ latitude, longitude, city }: { latitude: number; longitude: number; city: string }) {
  return (
    <div>
      <div className="h-64 rounded-xl overflow-hidden">
        {typeof window !== "undefined" && (
          <MapLibreMap
            initialViewState={{
              longitude,
              latitude,
              zoom: 13,
            }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            style={{ width: "100%", height: "100%" }}
          >
            <Marker longitude={longitude} latitude={latitude} anchor="bottom">
              <div className="bg-coral text-white px-2 py-1 rounded-full font-bold shadow-md cursor-pointer text-xs">
                €
              </div>
            </Marker>
          </MapLibreMap>
        )}
      </div>
      <p className="text-gray-500 mt-2 text-sm">Quartier de {city}</p>
    </div>
  )
}
