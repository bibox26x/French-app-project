import Image from "next/image"

export default function AProposPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-coral-50 py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <Image
            src="/logo-full.png"
            alt="Fête, en fait"
            width={200}
            height={60}
            className="mx-auto mb-10 h-auto"
          />
          <h1 className="text-4xl md:text-5xl font-semibold text-ink mb-6">Le concept</h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            <strong>Fête, en fait</strong> est née d'un constat simple : trouver un logement pour un weekend entre potes, c'est devenu impossible. Les plateformes classiques interdisent les groupes, les fêtes, les anniversaires — autrement dit, à peu près tout ce qui rend un weekend mémorable.
          </p>
        </div>
      </section>

      {/* LE PROBLÈME */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-6">Le problème</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p className="font-medium text-red-700">"Pas de fête." "Pas plus de 6 personnes." "Pas après 22h."</p>
              <p>
                Les hôtes des grandes plateformes ont peur des groupes étudiants — souvent à juste titre, parfois à tort. Résultat : des centaines de propriétaires bannis, des étudiants privés de logement pour leurs événements.
              </p>
            </div>
          </div>

          {/* NOTRE SOLUTION */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-6">Notre solution</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              On a recruté des hôtes qui <em>veulent</em> louer à des groupes étudiants. Des maisons hors des centres-ville, équipées pour recevoir, avec des règles claires des deux côtés. Vous savez à quoi vous attendre. Eux aussi.
            </p>
          </div>

          {/* POUR QUI */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-8">Pour qui ?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { emoji: "🎂", label: "Anniversaires" },
                { emoji: "🎓", label: "Weekends d'intégration" },
                { emoji: "🏠", label: "Crémaillères" },
                { emoji: "📚", label: "Fêtes de fin de partiels" },
                { emoji: "💍", label: "EVJF / EVG" },
                { emoji: "👥", label: "Retrouvailles entre promos" },
              ].map(({ emoji, label }) => (
                <div
                  key={label}
                  className="bg-gray-50 border border-border rounded-xl p-5 text-center hover:border-coral/30 hover:bg-coral-50/50 transition-colors"
                >
                  <div className="text-3xl mb-3">{emoji}</div>
                  <p className="text-sm font-medium text-ink">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NOTE LÉGALE */}
          <div className="bg-gray-50 border border-border rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-ink mb-3">Note légale</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Cette plateforme est un projet pédagogique réalisé dans le cadre d'un cours de français à EPITA. Elle n'est pas un service commercial réel et aucune transaction réelle n'est traitée.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
