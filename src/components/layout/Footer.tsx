import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/logo-small.png" 
                alt="Fête, en fait" 
                width={120} 
                height={40} 
                className="h-auto w-[120px]"
              />
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              La plateforme de location pour vos événements entre étudiants.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-ink mb-3">Explorer</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/recherche" className="hover:text-coral transition-colors">Toutes les annonces</Link></li>
              <li><Link href="/a-propos" className="hover:text-coral transition-colors">Comment ça marche</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-ink mb-3">Hôtes</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/hote" className="hover:text-coral transition-colors">Mon espace hôte</Link></li>
              <li><Link href="/connexion" className="hover:text-coral transition-colors">Devenir hôte</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-ink mb-3">Légal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="cursor-not-allowed">Mentions légales</span></li>
              <li><span className="cursor-not-allowed">CGU</span></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Fête, en fait. Projet étudiant.</p>
        </div>
      </div>
    </footer>
  )
}
