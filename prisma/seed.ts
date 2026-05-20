import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

// Need to match src/lib/db.ts logic for Prisma 7
const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

// Photo pool — stable Unsplash URLs cycled across listings so we don't
// have to hand-pick photos for every entry. Each listing gets a small
// rotation. Keep this list short so it's easy to swap if any URL breaks.
const PHOTO_POOL = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
]

// Helper: pick `n` photos starting at offset `i`, cycling through the pool.
function pickPhotos(i: number, n: number): string {
  const out: string[] = []
  for (let k = 0; k < n; k++) {
    out.push(PHOTO_POOL[(i + k) % PHOTO_POOL.length])
  }
  return JSON.stringify(out)
}

async function main() {
  // Hash passwords
  const adminHash = await bcrypt.hash('admin123', 10)
  const walidPereHash = await bcrypt.hash('walid123', 10)
  const lucasHash = await bcrypt.hash('lucas123', 10)

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@feteenfait.fr' },
    update: {},
    create: {
      email: 'admin@feteenfait.fr',
      passwordHash: adminHash,
      firstName: 'Admin',
      lastName: 'Fête',
      role: 'admin',
      isVerifiedStudent: true,
    },
  })

  // Clean existing listings and bookings before removing any legacy users.
  // SQLite enforces foreign keys strictly, so users referenced by rows in
  // Booking or Listing must be removed only after those dependents are gone.
  await prisma.booking.deleteMany({})
  await prisma.listing.deleteMany({})

  // HOST: Père de Walid — the unbothered father with a real estate portfolio.
  // Renamed from Julie. Email kept gmail-style since he's not a student.
  // Old Julie record (if it exists from a prior seed) is removed first so the
  // email change doesn't leave a ghost user with no listings.
  await prisma.user.deleteMany({ where: { email: 'julie.martin@etu.univ-paris.fr' } })

  const walidPere = await prisma.user.upsert({
    where: { email: 'pere.walid@gmail.com' },
    update: {},
    create: {
      email: 'pere.walid@gmail.com',
      passwordHash: walidPereHash,
      firstName: 'Père de',
      lastName: 'Walid',
      role: 'host',
      isVerifiedStudent: false,
      university: null,
      phone: '0612345678',
    },
  })

  const lucas = await prisma.user.upsert({
    where: { email: 'lucas.dubois@etu.epita.fr' },
    update: {},
    create: {
      email: 'lucas.dubois@etu.epita.fr',
      passwordHash: lucasHash,
      firstName: 'Lucas',
      lastName: 'Dubois',
      role: 'guest',
      isVerifiedStudent: true,
      university: 'EPITA',
      phone: '0698765432',
    },
  })

  // 22 listings across 12 French cities, all owned by Père de Walid.
  // Cities: Paris, Lyon, Marseille, Bordeaux, Lille, Nice, Toulouse,
  //         Nantes, Strasbourg, Montpellier, Rennes, Aix-en-Provence
  const listingsData = [
    // ─── Marseille (2) ────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Villa avec piscine pour vos weekends entre amis',
      description: "Superbe villa pouvant accueillir jusqu'à 15 personnes. Parfaite pour fêter des anniversaires ou se retrouver le temps d'un weekend. Grande piscine, jardin spacieux et aucune restriction sur le bruit avant 2h du matin.",
      propertyType: 'villa',
      addressLine: '12 Chemin des Oliviers',
      city: 'Marseille',
      latitude: 43.2965,
      longitude: 5.3698,
      maxGuests: 15,
      bedrooms: 5,
      pricePerNight: 450,
      weekendPrice: 900,
      depositAmount: 1000,
      houseRules: 'Respect des lieux. Pas de verre dans la piscine. La musique doit baisser après 2h du matin.',
      amenities: JSON.stringify(['piscine', 'parking', 'jardin', 'sono', 'barbecue', 'wifi']),
      photos: pickPhotos(0, 3),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Cabanon provençal avec vue mer',
      description: "Petit cabanon traditionnel marseillais entièrement rénové. Vue imprenable sur les calanques. Idéal pour un weekend en petit comité.",
      propertyType: 'maison',
      addressLine: '3 Traverse des Goudes',
      city: 'Marseille',
      latitude: 43.2148,
      longitude: 5.3506,
      maxGuests: 8,
      bedrooms: 3,
      pricePerNight: 280,
      weekendPrice: 600,
      depositAmount: 500,
      houseRules: 'Pas de musique amplifiée après 22h.',
      amenities: JSON.stringify(['jardin', 'barbecue', 'wifi']),
      photos: pickPhotos(3, 2),
      status: 'published',
    },

    // ─── Lyon (2) ────────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Grande maison de campagne — événements bienvenus',
      description: "Idéale pour les séminaires étudiants ou les week-ends d'intégration. Située au calme, avec un grand espace de vie et une salle de jeux.",
      propertyType: 'maison',
      addressLine: 'Lieu-dit Le Pré Vert',
      city: 'Lyon',
      latitude: 45.7640,
      longitude: 4.8357,
      maxGuests: 20,
      bedrooms: 7,
      pricePerNight: 550,
      weekendPrice: 1200,
      depositAmount: 1500,
      houseRules: 'Ménage à faire avant le départ.',
      amenities: JSON.stringify(['parking', 'jardin', 'sono', 'barbecue', 'lave-vaisselle', 'wifi']),
      photos: pickPhotos(3, 3),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Loft canut à la Croix-Rousse',
      description: 'Ancien atelier de soie reconverti. Hauteurs sous plafond, charme lyonnais authentique. Idéal pour soirées thématiques.',
      propertyType: 'appartement',
      addressLine: '24 Rue du Mail',
      city: 'Lyon',
      latitude: 45.7797,
      longitude: 4.8295,
      maxGuests: 12,
      bedrooms: 2,
      pricePerNight: 320,
      weekendPrice: 700,
      depositAmount: 600,
      houseRules: 'Voisins en dessous, musique baissée après minuit.',
      amenities: JSON.stringify(['sono', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(6, 2),
      status: 'published',
    },

    // ─── Paris (3) ───────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Appartement spacieux pour soirées parisiennes',
      description: "Grand appartement de 120m2 dans le centre. Isolation refaite à neuf, idéal pour de petits rassemblements sans déranger les voisins. Proche de toutes commodités.",
      propertyType: 'appartement',
      addressLine: '45 Rue de la Soif',
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      maxGuests: 10,
      bedrooms: 3,
      pricePerNight: 300,
      weekendPrice: null,
      depositAmount: 800,
      houseRules: 'Fumeurs autorisés sur le balcon uniquement.',
      amenities: JSON.stringify(['sono', 'lave-vaisselle', 'wifi', 'machine à laver']),
      photos: pickPhotos(6, 2),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Penthouse avec terrasse — Paris 11e',
      description: 'Vue sur les toits de Paris, terrasse de 30m2. Idéal pour anniversaires et soirées privées en petit comité.',
      propertyType: 'appartement',
      addressLine: '78 Boulevard Voltaire',
      city: 'Paris',
      latitude: 48.8580,
      longitude: 2.3811,
      maxGuests: 12,
      bedrooms: 3,
      pricePerNight: 380,
      weekendPrice: 850,
      depositAmount: 900,
      houseRules: "Pas de musique amplifiée sur la terrasse après 23h.",
      amenities: JSON.stringify(['sono', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(8, 3),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Maison de ville avec jardin — Paris 14e',
      description: "Maison atypique avec petit jardin clos. Discrète et bien isolée, idéale pour fêtes d'anniversaire sans gêner le voisinage.",
      propertyType: 'maison',
      addressLine: '15 Villa d\'Alésia',
      city: 'Paris',
      latitude: 48.8270,
      longitude: 2.3270,
      maxGuests: 15,
      bedrooms: 4,
      pricePerNight: 420,
      weekendPrice: 950,
      depositAmount: 1000,
      houseRules: 'Jardin accessible jusqu\'à minuit.',
      amenities: JSON.stringify(['jardin', 'sono', 'wifi', 'lave-vaisselle', 'barbecue']),
      photos: pickPhotos(11, 2),
      status: 'published',
    },

    // ─── Bordeaux (2) ────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Domaine avec grand parc pour fêtes',
      description: "Domaine entier à votre disposition, sans voisinage direct. Salle de réception de 80m2 et dortoirs. Le lieu par excellence pour un WEI ou un grand anniversaire.",
      propertyType: 'autre',
      addressLine: 'Chemin du Grand Bois',
      city: 'Bordeaux',
      latitude: 44.8378,
      longitude: -0.5792,
      maxGuests: 30,
      bedrooms: 10,
      pricePerNight: 800,
      weekendPrice: 1800,
      depositAmount: 2000,
      houseRules: 'Tentes autorisées dans le parc. Feux de camp interdits.',
      amenities: JSON.stringify(['parking', 'jardin', 'sono', 'barbecue', 'lave-vaisselle', 'wifi']),
      photos: pickPhotos(8, 3),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Échoppe bordelaise rénovée',
      description: 'Maison de plain-pied typique du quartier des Chartrons. Cour intérieure agréable, parfait pour un weekend entre amis.',
      propertyType: 'maison',
      addressLine: '52 Rue Notre-Dame',
      city: 'Bordeaux',
      latitude: 44.8520,
      longitude: -0.5740,
      maxGuests: 10,
      bedrooms: 4,
      pricePerNight: 290,
      weekendPrice: 650,
      depositAmount: 600,
      houseRules: 'Musique baissée après minuit (voisins).',
      amenities: JSON.stringify(['jardin', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(13, 2),
      status: 'published',
    },

    // ─── Nice (2) ────────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Chalet festif à la montagne',
      description: 'Situé près de Nice, ce chalet peut accueillir votre groupe pour des soirées inoubliables. Vue imprenable et ambiance chaleureuse garantie.',
      propertyType: 'maison',
      addressLine: 'Route des Crêtes',
      city: 'Nice',
      latitude: 43.7102,
      longitude: 7.2620,
      maxGuests: 12,
      bedrooms: 4,
      pricePerNight: 350,
      weekendPrice: 800,
      depositAmount: 500,
      houseRules: 'Animaux acceptés.',
      amenities: JSON.stringify(['parking', 'jardin', 'barbecue', 'wifi']),
      photos: pickPhotos(10, 2),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Mas niçois avec vue sur baie',
      description: "Belle bâtisse en pierre à flanc de colline. Vue sur la baie des Anges, terrasse panoramique. Idéal pour anniversaires d'été.",
      propertyType: 'villa',
      addressLine: '7 Chemin des Pins',
      city: 'Nice',
      latitude: 43.7259,
      longitude: 7.2620,
      maxGuests: 18,
      bedrooms: 6,
      pricePerNight: 520,
      weekendPrice: 1150,
      depositAmount: 1200,
      houseRules: 'Piscine surveillée par les locataires.',
      amenities: JSON.stringify(['piscine', 'parking', 'jardin', 'barbecue', 'wifi']),
      photos: pickPhotos(14, 3),
      status: 'published',
    },

    // ─── Lille (2) ───────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Loft industriel parfait pour événements',
      description: 'Ancienne usine réaménagée en loft de 200m2. Espace ouvert impressionnant, idéal pour soirées dansantes ou réceptions.',
      propertyType: 'appartement',
      addressLine: "14 Rue de l'Usine",
      city: 'Lille',
      latitude: 50.6292,
      longitude: 3.0573,
      maxGuests: 40,
      bedrooms: 2,
      pricePerNight: 400,
      weekendPrice: null,
      depositAmount: 1000,
      houseRules: 'Pas de confettis.',
      amenities: JSON.stringify(['sono', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(12, 2),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Maison flamande à Wazemmes',
      description: 'Maison de brique typique du Nord, entièrement rénovée. Grande cuisine conviviale, salon spacieux. Parfait pour étudiants lillois.',
      propertyType: 'maison',
      addressLine: '88 Rue Gambetta',
      city: 'Lille',
      latitude: 50.6280,
      longitude: 3.0500,
      maxGuests: 14,
      bedrooms: 5,
      pricePerNight: 260,
      weekendPrice: 580,
      depositAmount: 500,
      houseRules: 'Cuisine à rendre propre.',
      amenities: JSON.stringify(['jardin', 'wifi', 'lave-vaisselle', 'machine à laver']),
      photos: pickPhotos(0, 2),
      status: 'published',
    },

    // ─── Toulouse (2) ────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Villa contemporaine avec rooftop',
      description: "Profitez d'un immense toit-terrasse équipé pour vos soirées. La villa est moderne et conçue pour recevoir du monde.",
      propertyType: 'villa',
      addressLine: '8 Allée des Palmiers',
      city: 'Toulouse',
      latitude: 43.6047,
      longitude: 1.4442,
      maxGuests: 15,
      bedrooms: 4,
      pricePerNight: 500,
      weekendPrice: 1100,
      depositAmount: 1500,
      houseRules: 'Fermeture du rooftop à minuit par respect pour le voisinage.',
      amenities: JSON.stringify(['piscine', 'parking', 'sono', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(14, 2),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Maison toulousaine en brique rose',
      description: 'Maison de caractère dans le quartier Saint-Cyprien. Patio intérieur, charme du Sud-Ouest.',
      propertyType: 'maison',
      addressLine: '19 Rue de la Concorde',
      city: 'Toulouse',
      latitude: 43.5970,
      longitude: 1.4280,
      maxGuests: 12,
      bedrooms: 4,
      pricePerNight: 310,
      weekendPrice: 700,
      depositAmount: 600,
      houseRules: 'Pas de fête bruyante (voisinage proche).',
      amenities: JSON.stringify(['jardin', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(2, 2),
      status: 'published',
    },

    // ─── Nantes (2) ──────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Maison nantaise pour cousinades',
      description: 'Grande maison familiale très accueillante. Le grand jardin arboré permet de belles réunions en extérieur.',
      propertyType: 'maison',
      addressLine: '22 Rue des Érables',
      city: 'Nantes',
      latitude: 47.2184,
      longitude: -1.5536,
      maxGuests: 18,
      bedrooms: 6,
      pricePerNight: 320,
      weekendPrice: 750,
      depositAmount: 600,
      houseRules: 'Maison non-fumeur.',
      amenities: JSON.stringify(['parking', 'jardin', 'barbecue', 'wifi', 'machine à laver', 'lave-vaisselle']),
      photos: pickPhotos(16, 2),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Péniche aménagée sur l\'Erdre',
      description: "Bateau-logement entièrement équipé, amarré sur l'Erdre. Atypique et idéal pour anniversaires originaux.",
      propertyType: 'autre',
      addressLine: 'Quai de Versailles',
      city: 'Nantes',
      latitude: 47.2280,
      longitude: -1.5570,
      maxGuests: 10,
      bedrooms: 3,
      pricePerNight: 280,
      weekendPrice: 620,
      depositAmount: 700,
      houseRules: 'Capacité limitée à 15 personnes en simultané (pont).',
      amenities: JSON.stringify(['wifi', 'sono']),
      photos: pickPhotos(5, 2),
      status: 'published',
    },

    // ─── Strasbourg (1) ──────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: "Maison alsacienne à colombages",
      description: "Maison traditionnelle dans un village proche de Strasbourg. Authentique, calme, et grande salle commune avec poêle à bois.",
      propertyType: 'maison',
      addressLine: '4 Rue des Vignerons',
      city: 'Strasbourg',
      latitude: 48.5734,
      longitude: 7.7521,
      maxGuests: 14,
      bedrooms: 5,
      pricePerNight: 340,
      weekendPrice: 750,
      depositAmount: 700,
      houseRules: 'Respect du voisinage du village.',
      amenities: JSON.stringify(['jardin', 'parking', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(9, 2),
      status: 'published',
    },

    // ─── Montpellier (1) ─────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Mas languedocien avec piscine',
      description: "Grand mas en pierre dans la garrigue, à 20 minutes de Montpellier. Piscine privée et grand terrain, parfait pour l'été.",
      propertyType: 'villa',
      addressLine: 'Domaine de la Garrigue',
      city: 'Montpellier',
      latitude: 43.6109,
      longitude: 3.8772,
      maxGuests: 20,
      bedrooms: 6,
      pricePerNight: 480,
      weekendPrice: 1050,
      depositAmount: 1200,
      houseRules: "Pas de feu sur la garrigue (risque d'incendie).",
      amenities: JSON.stringify(['piscine', 'parking', 'jardin', 'sono', 'barbecue', 'wifi']),
      photos: pickPhotos(14, 3),
      status: 'published',
    },

    // ─── Rennes (1) ──────────────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Longère bretonne rénovée',
      description: "Belle longère en pierre, parfaitement isolée. Cheminée centrale, immense séjour. Idéale pour weekends d'hiver entre amis.",
      propertyType: 'maison',
      addressLine: 'Le Bourg',
      city: 'Rennes',
      latitude: 48.1173,
      longitude: -1.6778,
      maxGuests: 16,
      bedrooms: 5,
      pricePerNight: 360,
      weekendPrice: 800,
      depositAmount: 800,
      houseRules: 'Bois de cheminée fourni, mais à utiliser raisonnablement.',
      amenities: JSON.stringify(['parking', 'jardin', 'barbecue', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(4, 2),
      status: 'published',
    },

    // ─── Aix-en-Provence (2) ─────────────────────────────────────
    {
      hostId: walidPere.id,
      title: 'Bastide provençale avec oliviers',
      description: "Belle bastide du XVIIIe restaurée. Grand parc planté d'oliviers, piscine, vue sur la Sainte-Victoire. Pour grandes occasions.",
      propertyType: 'villa',
      addressLine: 'Chemin des Lauves',
      city: 'Aix-en-Provence',
      latitude: 43.5297,
      longitude: 5.4474,
      maxGuests: 25,
      bedrooms: 8,
      pricePerNight: 700,
      weekendPrice: 1500,
      depositAmount: 1800,
      houseRules: 'Bastide protégée — pas de décoration fixée aux murs.',
      amenities: JSON.stringify(['piscine', 'parking', 'jardin', 'barbecue', 'wifi', 'lave-vaisselle']),
      photos: pickPhotos(0, 3),
      status: 'published',
    },
    {
      hostId: walidPere.id,
      title: 'Maison de village à Aix',
      description: 'Maison de village rénovée, terrasse cachée et calme. Idéale pour petit groupe en weekend.',
      propertyType: 'maison',
      addressLine: '11 Rue Espariat',
      city: 'Aix-en-Provence',
      latitude: 43.5263,
      longitude: 5.4454,
      maxGuests: 8,
      bedrooms: 3,
      pricePerNight: 260,
      weekendPrice: 580,
      depositAmount: 500,
      houseRules: 'Voisins très proches : pas de musique amplifiée.',
      amenities: JSON.stringify(['wifi', 'lave-vaisselle']),
      photos: pickPhotos(7, 2),
      status: 'published',
    },
  ]

  // Insert listings
  const createdListings = []
  for (const l of listingsData) {
    const listing = await prisma.listing.create({ data: l })
    createdListings.push(listing)
  }

  // Bookings — same shape as before: one pending, one confirmed, one completed.
  const now = new Date()

  // Pending booking: in the future
  const pendingStartDate = new Date(now)
  pendingStartDate.setDate(now.getDate() + 14)
  const pendingEndDate = new Date(now)
  pendingEndDate.setDate(now.getDate() + 16)

  await prisma.booking.create({
    data: {
      listingId: createdListings[0].id,
      guestId: lucas.id,
      startDate: pendingStartDate,
      endDate: pendingEndDate,
      guestCount: 10,
      totalPrice: createdListings[0].weekendPrice || 900,
      depositAmount: createdListings[0].depositAmount,
      status: 'pending',
    },
  })

  // Confirmed booking: in the future
  const confirmedStartDate = new Date(now)
  confirmedStartDate.setDate(now.getDate() + 30)
  const confirmedEndDate = new Date(now)
  confirmedEndDate.setDate(now.getDate() + 32)

  await prisma.booking.create({
    data: {
      listingId: createdListings[2].id,
      guestId: lucas.id,
      startDate: confirmedStartDate,
      endDate: confirmedEndDate,
      guestCount: 15,
      totalPrice: createdListings[2].weekendPrice || 1200,
      depositAmount: createdListings[2].depositAmount,
      status: 'confirmed',
    },
  })

  // Completed booking: in the past
  const completedStartDate = new Date(now)
  completedStartDate.setDate(now.getDate() - 20)
  const completedEndDate = new Date(now)
  completedEndDate.setDate(now.getDate() - 18)

  await prisma.booking.create({
    data: {
      listingId: createdListings[4].id,
      guestId: lucas.id,
      startDate: completedStartDate,
      endDate: completedEndDate,
      guestCount: 8,
      totalPrice: createdListings[4].pricePerNight * 2,
      depositAmount: createdListings[4].depositAmount,
      status: 'completed',
    },
  })

  console.log(`Seed executed successfully! ${createdListings.length} listings across 12 cities.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })