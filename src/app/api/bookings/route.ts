import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request as any)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vous devez être connecté." } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { listingId, startDate, endDate, guestCount } = body

    if (!listingId || !startDate || !endDate || !guestCount) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Tous les champs sont requis." } },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } })
    if (!listing || listing.status !== "published") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Annonce introuvable." } },
        { status: 404 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    const totalPrice = listing.pricePerNight * nights

    const booking = await prisma.booking.create({
      data: {
        listingId,
        guestId: user.id,
        startDate: start,
        endDate: end,
        guestCount: parseInt(String(guestCount)),
        totalPrice,
        depositAmount: listing.depositAmount,
        status: "pending",
      },
    })

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt.toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request as any)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vous devez être connecté." } },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { guestId: user.id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        status: b.status,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        guestCount: b.guestCount,
        totalPrice: b.totalPrice,
        createdAt: b.createdAt.toISOString(),
        listing: b.listing,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}
