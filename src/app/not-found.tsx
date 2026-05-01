import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 mb-6">404</p>
        <h1 className="text-2xl font-semibold text-ink mb-3">Page introuvable</h1>
        <p className="text-gray-500 mb-8">Cette page n'existe pas — ou plus.</p>
        <Button className="bg-coral hover:bg-[#E63946] text-white" asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  )
}
