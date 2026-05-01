import Image from "next/image"
import Link from "next/link"
import { Users, BedDouble, MapPin } from "lucide-react"

export interface ListingCardProps {
  listing: {
    id: string
    title: string
    city: string
    maxGuests: number
    bedrooms: number
    pricePerNight: number
    weekendPrice: number | null
    photos: string
    propertyType: string
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  let photosArr: string[] = []
  try {
    photosArr = JSON.parse(listing.photos)
  } catch (e) {
    // fallback if parsing fails
  }

  const coverPhoto = photosArr[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"

  return (
    <Link href={`/annonce/${listing.id}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200 mb-3">
        <Image 
          src={coverPhoto} 
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-ink shadow-sm">
          {listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1)}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-ink line-clamp-1 group-hover:text-coral transition-colors">
            {listing.title}
          </h3>
        </div>
        
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {listing.city}
        </p>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {listing.maxGuests} voy.
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" />
            {listing.bedrooms} ch.
          </span>
        </div>
        
        <div className="pt-2">
          <p className="text-ink">
            <span className="font-semibold">{listing.pricePerNight} €</span> <span className="text-gray-500 text-sm">/ nuit</span>
          </p>
          {listing.weekendPrice && (
            <p className="text-xs text-gray-500 mt-0.5">
              Ou {listing.weekendPrice} € le weekend
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
