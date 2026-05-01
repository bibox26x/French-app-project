"use client"

import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

export function HostListingCard({ listing }: { listing: any }) {
  const [menuOpen, setMenuOpen] = useState(false)

  let cover = ""
  try { cover = JSON.parse(listing.photos)[0] || "" } catch {}

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden group">
      <div className="relative h-40">
        {cover ? (
          <Image src={cover} alt={listing.title} fill className="object-cover" sizes="400px" />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${listing.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
            {listing.status === "published" ? "Publiée" : "Masquée"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white border border-border rounded-xl shadow-lg py-1 z-10 min-w-[160px]" onMouseLeave={() => setMenuOpen(false)}>
              <Link
                href={`/annonce/${listing.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" /> Voir l'annonce
              </Link>
              <Link
                href={`/hote/annonces/${listing.id}/modifier`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4" /> Modifier
              </Link>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-ink line-clamp-1 mb-1">{listing.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{listing.city}</p>
        <p className="text-xs text-gray-400">{listing._count.bookings} réservation{listing._count.bookings !== 1 ? "s" : ""}</p>
      </div>
    </div>
  )
}
