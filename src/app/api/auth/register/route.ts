import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Tous les champs sont requis." } },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: { code: "INVALID_EMAIL", message: "Adresse email invalide." } },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: { code: "PASSWORD_TOO_SHORT", message: "Le mot de passe doit contenir au moins 8 caractères." } },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: { code: "EMAIL_TAKEN", message: "Un compte existe déjà avec cette adresse." } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: "guest",
        isVerifiedStudent: false,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerifiedStudent: user.isVerifiedStudent,
          createdAt: user.createdAt.toISOString(),
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
