import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      include: {
        host: { select: { firstName: true, lastName: true } },
      },
    })

    return NextResponse.json({
      listings: listings.map((l) => ({
        id: l.id,
        title: l.title,
        city: l.city,
        pricePerNight: l.pricePerNight,
        maxGuests: l.maxGuests,
        bedrooms: l.bedrooms,
        propertyType: l.propertyType,
        photos: l.photos,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
        host: l.host,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request as any)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vous devez être connecté." } },
        { status: 401 }
      )
    }

    if (user.role !== "host" && user.role !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Seuls les hôtes peuvent créer des annonces." } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title, description, propertyType, addressLine, city,
      latitude, longitude, maxGuests, bedrooms, amenities,
      houseRules, photos, pricePerNight, weekendPrice, depositAmount
    } = body

    if (!title || !description || !city || !pricePerNight) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Les champs obligatoires sont manquants." } },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.create({
      data: {
        hostId: user.id,
        title,
        description,
        propertyType: propertyType?.toLowerCase() || "maison",
        addressLine: addressLine || "",
        city,
        latitude: latitude || 0,
        longitude: longitude || 0,
        maxGuests: maxGuests || 10,
        bedrooms: bedrooms || 1,
        amenities: JSON.stringify(amenities || []),
        houseRules: houseRules || "",
        photos: JSON.stringify(photos || []),
        pricePerNight: pricePerNight,
        weekendPrice: weekendPrice || null,
        depositAmount: depositAmount || 0,
        status: "published",
      },
    })

    return NextResponse.json(
      {
        listing: {
          id: listing.id,
          title: listing.title,
          status: listing.status,
          createdAt: listing.createdAt.toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}
