"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="text-center">
          <p className="text-8xl font-bold text-gray-200 mb-6">500</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Quelque chose a cassé</h1>
          <p className="text-gray-500 mb-8">On regarde ça. Réessayez dans quelques instants.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset} className="bg-coral hover:bg-[#E63946] text-white">
              Réessayer
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
