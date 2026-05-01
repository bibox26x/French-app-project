import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { Users, BedDouble, MapPin, Check, ShieldCheck, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ListingPage({ params }: { params: { id: string } }) {
  // Need to await params in Next.js 15 before using
  const resolvedParams = await params
  
  const listing = await prisma.listing.findUnique({
    where: { id: resolvedParams.id },
    include: {
      host: {
        select: {
          firstName: true,
          lastName: true,
          isVerifiedStudent: true
        }
      }
    }
  })

  if (!listing) return notFound()

  let photosArr: string[] = []
  let amenitiesArr: string[] = []
  try {
    photosArr = JSON.parse(listing.photos)
    amenitiesArr = JSON.parse(listing.amenities)
  } catch (e) {
    // fallback
  }

  const coverPhoto = photosArr[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  const secondaryPhotos = photosArr.slice(1, 3)

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Mobile back button */}
      <div className="md:hidden p-4 border-b border-border sticky top-16 bg-white z-40">
        <Link href="/recherche" className="flex items-center text-sm font-medium text-gray-700">
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour
        </Link>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-6xl">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-ink mb-2">
            {listing.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-4 h-4 text-coral" />
              {listing.city}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {listing.maxGuests} voyageurs
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              {listing.bedrooms} chambres
            </span>
            <span className="text-gray-300">•</span>
            <span className="capitalize">{listing.propertyType}</span>
          </div>
        </div>

        {/* PHOTOS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] mb-10 rounded-xl overflow-hidden">
          <div className="col-span-1 md:col-span-2 relative h-full">
            <Image src={coverPhoto} alt="Cover" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {secondaryPhotos.map((photo, i) => (
            <div key={i} className="hidden md:block col-span-1 relative h-full">
              <Image src={photo} alt={`Photo ${i+2}`} fill className="object-cover" sizes="25vw" />
            </div>
          ))}
          {secondaryPhotos.length === 0 && (
            <>
              <div className="hidden md:block col-span-1 relative h-full bg-gray-200"></div>
              <div className="hidden md:block col-span-1 relative h-full bg-gray-200"></div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            {/* Host info */}
            <div className="flex items-center gap-4 pb-10 border-b border-border">
              <div className="w-14 h-14 bg-coral-50 rounded-full flex items-center justify-center text-xl font-medium text-coral-700">
                {listing.host.firstName.charAt(0)}{listing.host.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-ink">
                  Votre hôte : {listing.host.firstName} {listing.host.lastName}
                </h3>
                {listing.host.isVerifiedStudent && (
                  <p className="text-sm text-blue-600 flex items-center gap-1 font-medium mt-0.5">
                    <ShieldCheck className="w-4 h-4" /> Étudiant vérifié
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-ink mb-4">À propos de ce logement</h2>
              <div className="prose prose-gray max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-10 border-t border-border">
              <h2 className="text-xl font-semibold text-ink mb-6">Ce que propose ce logement</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {amenitiesArr.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700 capitalize">
                    <Check className="w-5 h-5 text-gray-400" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="pt-10 border-t border-border">
              <h2 className="text-xl font-semibold text-ink mb-4">Règles de la maison</h2>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-700">
                <p className="whitespace-pre-wrap">{listing.houseRules || "L'hôte n'a pas défini de règles spécifiques."}</p>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="pt-10 border-t border-border">
              <h2 className="text-xl font-semibold text-ink mb-4">Localisation</h2>
              <p className="text-gray-500 mb-4">{listing.city}</p>
              <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Carte (MapLibre) en cours d'intégration</p>
              </div>
            </div>
          </div>

          {/* WIDGET */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-border rounded-2xl p-6 shadow-lg shadow-black/5 bg-white">
              <div className="mb-6">
                <span className="text-2xl font-semibold text-ink">{listing.pricePerNight} €</span>
                <span className="text-gray-500 text-sm"> par nuit</span>
                {listing.weekendPrice && (
                  <p className="text-sm text-gray-500 mt-1">
                    Ou <span className="font-medium text-ink">{listing.weekendPrice} €</span> le weekend complet
                  </p>
                )}
              </div>

              <div className="border border-border rounded-xl mb-6 overflow-hidden">
                <div className="flex border-b border-border">
                  <div className="flex-1 p-3 border-r border-border">
                    <label className="block text-[10px] uppercase font-bold text-ink mb-1">Arrivée</label>
                    <div className="text-sm text-gray-500">Ajouter dates</div>
                  </div>
                  <div className="flex-1 p-3">
                    <label className="block text-[10px] uppercase font-bold text-ink mb-1">Départ</label>
                    <div className="text-sm text-gray-500">Ajouter dates</div>
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] uppercase font-bold text-ink mb-1">Voyageurs</label>
                  <div className="text-sm text-ink font-medium">1 voyageur</div>
                </div>
              </div>

              <Button size="lg" className="w-full bg-coral hover:bg-peach text-white text-base py-6 mb-4">
                Réserver
              </Button>
              
              <p className="text-center text-sm text-gray-500 mb-6">
                Aucun montant ne vous sera débité pour le moment
              </p>

              {(listing.depositAmount ?? 0) > 0 && (
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600 underline decoration-dotted underline-offset-4">Caution</span>
                  <span className="text-ink">{listing.depositAmount} €</span>
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-between items-center font-semibold text-lg text-ink">
                <span>Total</span>
                <span>— €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
