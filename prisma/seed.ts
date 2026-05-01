import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

// Need to match src/lib/db.ts logic for Prisma 7
const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Hash passwords
  const adminHash = await bcrypt.hash('admin123', 10)
  const julieHash = await bcrypt.hash('julie123', 10)
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

  const julie = await prisma.user.upsert({
    where: { email: 'julie.martin@etu.univ-paris.fr' },
    update: {},
    create: {
      email: 'julie.martin@etu.univ-paris.fr',
      passwordHash: julieHash,
      firstName: 'Julie',
      lastName: 'Martin',
      role: 'host',
      isVerifiedStudent: true,
      university: 'Sorbonne Université',
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

  // Clean existing listings and bookings to avoid duplicates during re-seeding
  await prisma.booking.deleteMany({})
  await prisma.listing.deleteMany({})

  // Listings
  // 8 listings across France: Paris, Lyon, Marseille, Bordeaux, Lille, Nice, Toulouse, Nantes
  const listingsData = [
    {
      hostId: julie.id,
      title: 'Villa avec piscine pour vos weekends entre amis',
      description: 'Superbe villa pouvant accueillir jusqu\'à 15 personnes. Parfaite pour fêter des anniversaires ou se retrouver le temps d\'un weekend. Grande piscine, jardin spacieux et aucune restriction sur le bruit avant 2h du matin.',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
      title: 'Grande maison de campagne — événements bienvenus',
      description: 'Idéale pour les séminaires étudiants ou les week-ends d\'intégration (petits groupes). Située au calme, avec un grand espace de vie et une salle de jeux.',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
      title: 'Appartement spacieux pour soirées parisiennes',
      description: 'Grand appartement de 120m2 dans le centre. Isolation refaite à neuf, idéal pour de petits rassemblements sans déranger les voisins. Proche de toutes commodités.',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
      title: 'Domaine avec grand parc pour fêtes',
      description: 'Domaine entier à votre disposition, sans voisinage direct. Salle de réception de 80m2 et dortoirs. Le lieu par excellence pour un WEI ou un grand anniversaire.',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
      title: 'Loft industriel parfait pour événements',
      description: 'Ancienne usine réaménagée en loft de 200m2. Espace ouvert impressionnant, idéal pour soirées dansantes ou réceptions.',
      propertyType: 'appartement',
      addressLine: '14 Rue de l\'Usine',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
      title: 'Villa contemporaine avec rooftop',
      description: 'Profitez d\'un immense toit-terrasse équipé pour vos soirées. La villa est moderne et conçue pour recevoir du monde.',
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    },
    {
      hostId: julie.id,
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
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ]),
      status: 'published'
    }
  ]

  // Insert listings
  const createdListings = []
  for (const l of listingsData) {
    const listing = await prisma.listing.create({ data: l })
    createdListings.push(listing)
  }

  // Bookings
  // one pending, one confirmed, one completed
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
      status: 'pending'
    }
  })

  // Confirmed booking: in the future
  const confirmedStartDate = new Date(now)
  confirmedStartDate.setDate(now.getDate() + 30)
  const confirmedEndDate = new Date(now)
  confirmedEndDate.setDate(now.getDate() + 32)

  await prisma.booking.create({
    data: {
      listingId: createdListings[1].id,
      guestId: lucas.id,
      startDate: confirmedStartDate,
      endDate: confirmedEndDate,
      guestCount: 15,
      totalPrice: createdListings[1].weekendPrice || 1200,
      depositAmount: createdListings[1].depositAmount,
      status: 'confirmed'
    }
  })

  // Completed booking: in the past
  const completedStartDate = new Date(now)
  completedStartDate.setDate(now.getDate() - 20)
  const completedEndDate = new Date(now)
  completedEndDate.setDate(now.getDate() - 18)

  await prisma.booking.create({
    data: {
      listingId: createdListings[2].id,
      guestId: lucas.id,
      startDate: completedStartDate,
      endDate: completedEndDate,
      guestCount: 8,
      totalPrice: createdListings[2].pricePerNight * 2,
      depositAmount: createdListings[2].depositAmount,
      status: 'completed'
    }
  })

  console.log('Seed executed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
