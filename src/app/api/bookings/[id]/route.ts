import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import prisma from "@/lib/db"

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
    const { status } = body

    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Réservation introuvable." } },
        { status: 404 }
      )
    }

    // Guest can only cancel their own bookings
    const isGuest = booking.guestId === user.id
    const isHost = user.role === "host" || user.role === "admin"

    if (!isGuest && !isHost) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Accès non autorisé." } },
        { status: 403 }
      )
    }

    // Only allow valid status transitions
    const allowedTransitions: Record<string, string[]> = {
      pending: ["confirmed", "declined", "cancelled"],
      confirmed: ["cancelled", "completed"],
    }

    if (!allowedTransitions[booking.status]?.includes(status)) {
      return NextResponse.json(
        { error: { code: "INVALID_TRANSITION", message: "Cette transition de statut n'est pas autorisée." } },
        { status: 400 }
      )
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      booking: {
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
