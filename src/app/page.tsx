import Link from "next/link"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/db"
import { ListingCard } from "@/components/listings/ListingCard"
import { Search, Map, Calendar, Users, ShieldCheck, CreditCard, Sparkles, UserCheck } from "lucide-react"

export default async function HomePage() {
  const featuredListings = await prisma.listing.findMany({
    where: { status: "published" },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-coral-50 pt-16 pb-24 px-4 md:px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-sm font-medium text-blue-600 shadow-sm mb-6 border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
            Réservé aux étudiants vérifiés
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-ink tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Louez la maison parfaite pour vos événements entre amis
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Des hôtes qui acceptent les groupes étudiants. Sans règles absurdes, sans frais cachés.
          </p>
          
          {/* FAKE SEARCH BAR FOR HERO */}
          <div className="bg-white rounded-2xl shadow-lg p-2 max-w-3xl mx-auto border border-gray-200 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <Map className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Ville</p>
                <input type="text" placeholder="Où allez-vous ?" className="w-full bg-transparent text-sm outline-none text-ink placeholder:text-gray-500" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <Calendar className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Dates</p>
                <input type="text" placeholder="Quand ?" className="w-full bg-transparent text-sm outline-none text-ink placeholder:text-gray-500" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center w-full px-4 py-2">
              <Users className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Voyageurs</p>
                <input type="number" placeholder="Combien ?" min="1" className="w-full bg-transparent text-sm outline-none text-ink placeholder:text-gray-500" />
              </div>
            </div>
            
            <Button size="lg" className="w-full md:w-auto h-14 px-8 rounded-xl bg-coral hover:bg-peach text-white text-base" asChild>
              <Link href="/recherche">
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* POURQUOI FÊTE, EN FAIT */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold text-ink text-center mb-16">
            Pensé pour les étudiants, par des étudiants.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-coral-50 rounded-2xl flex items-center justify-center mb-6 text-coral">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-ink mb-3">Hôtes qui vous acceptent</h3>
              <p className="text-gray-700 leading-relaxed">
                Nos hôtes savent que vous venez en groupe pour faire la fête. Ils ont choisi cette plateforme pour ça.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-coral-50 rounded-2xl flex items-center justify-center mb-6 text-coral">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-ink mb-3">Prix transparents</h3>
              <p className="text-gray-700 leading-relaxed">
                Le prix affiché est le prix payé. Pas de frais de ménage cachés, pas de surprises au moment de payer.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-coral-50 rounded-2xl flex items-center justify-center mb-6 text-coral">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-ink mb-3">Vérifié étudiant</h3>
              <p className="text-gray-700 leading-relaxed">
                Tous les voyageurs sont des étudiants vérifiés. Vous savez avec qui vous traitez, et les hôtes aussi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <h2 className="text-3xl font-semibold text-ink">
              Des maisons faites pour vos weekends
            </h2>
            <Button variant="outline" asChild>
              <Link href="/recherche">Voir toutes les annonces</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold text-ink text-center mb-16">
            Comment ça marche
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10"></div>
            
            <div className="flex flex-col items-center text-center bg-white">
              <div className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center text-xl font-bold mb-6 ring-8 ring-white">
                1
              </div>
              <h3 className="text-xl font-medium text-ink mb-2">Cherchez</h3>
              <p className="text-gray-700">Trouvez une maison qui correspond à votre groupe et vos dates.</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white">
              <div className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center text-xl font-bold mb-6 ring-8 ring-white">
                2
              </div>
              <h3 className="text-xl font-medium text-ink mb-2">Réservez</h3>
              <p className="text-gray-700">Paiement sécurisé, confirmation immédiate.</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white">
              <div className="w-16 h-16 rounded-full bg-coral text-white flex items-center justify-center text-xl font-bold mb-6 ring-8 ring-white shadow-lg shadow-coral/20">
                3
              </div>
              <h3 className="text-xl font-medium text-ink mb-2">Profitez</h3>
              <p className="text-gray-700">Récupérez les clés et passez un super weekend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOST CTA */}
      <section className="py-24 px-4 md:px-6 bg-ink text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Vous avez une maison à louer ?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Rejoignez nos hôtes et louez votre bien à des étudiants qui en prendront soin.
          </p>
          <Button size="lg" className="bg-coral hover:bg-peach text-white h-14 px-8 text-lg" asChild>
            <Link href="/connexion">Devenir hôte</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
