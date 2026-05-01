import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        host: { select: { firstName: true, lastName: true } },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Annonce introuvable." } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      listing: {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request as any)
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vous devez être connecté." } },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const listing = await prisma.listing.findUnique({ where: { id } })
    if (!listing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Annonce introuvable." } },
        { status: 404 }
      )
    }

    const isHost = user.role === "host" && listing.hostId === user.id
    const isAdmin = user.role === "admin"

    if (!isHost && !isAdmin) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Accès non autorisé." } },
        { status: 403 }
      )
    }

    let dataToUpdate: any = {}

    if (isAdmin && body.status) {
      dataToUpdate.status = body.status
    }

    if (isHost) {
      if (body.title) dataToUpdate.title = body.title
      if (body.description) dataToUpdate.description = body.description
      if (body.propertyType) dataToUpdate.propertyType = body.propertyType
      if (body.addressLine !== undefined) dataToUpdate.addressLine = body.addressLine
      if (body.city) dataToUpdate.city = body.city
      if (body.latitude !== undefined) dataToUpdate.latitude = body.latitude
      if (body.longitude !== undefined) dataToUpdate.longitude = body.longitude
      if (body.maxGuests !== undefined) dataToUpdate.maxGuests = body.maxGuests
      if (body.bedrooms !== undefined) dataToUpdate.bedrooms = body.bedrooms
      if (body.amenities) dataToUpdate.amenities = JSON.stringify(body.amenities)
      if (body.houseRules !== undefined) dataToUpdate.houseRules = body.houseRules
      if (body.photos) dataToUpdate.photos = JSON.stringify(body.photos)
      if (body.pricePerNight !== undefined) dataToUpdate.pricePerNight = body.pricePerNight
      if (body.weekendPrice !== undefined) dataToUpdate.weekendPrice = body.weekendPrice
      if (body.depositAmount !== undefined) dataToUpdate.depositAmount = body.depositAmount
      if (body.status) dataToUpdate.status = body.status // Host can toggle published/draft
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: dataToUpdate,
    })

    return NextResponse.json({
      listing: {
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}
