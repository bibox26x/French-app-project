import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { encode } from "next-auth/jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Email et mot de passe requis." } },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Identifiants incorrects." } },
        { status: 401 }
      )
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Identifiants incorrects." } },
        { status: 401 }
      )
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerifiedStudent: user.isVerifiedStudent
    }

    // Default NextAuth JWT max age is 30 days
    const maxAge = 30 * 24 * 60 * 60
    
    const token = await encode({
      token: tokenPayload,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "default_secret",
      salt: "authjs.session-token",
      maxAge
    })

    const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString()

    return NextResponse.json({
      token,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerifiedStudent: user.isVerifiedStudent
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Une erreur est survenue." } },
      { status: 500 }
    )
  }
}
