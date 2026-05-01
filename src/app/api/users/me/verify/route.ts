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
    const { university, studentId } = body

    if (!university || !studentId) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Veuillez fournir un établissement et un numéro étudiant." } },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerifiedStudent: true,
        university: university,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        isVerifiedStudent: updatedUser.isVerifiedStudent,
        university: updatedUser.university,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}
