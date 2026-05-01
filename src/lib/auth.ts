import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { decode } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!passwordsMatch) return null

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerifiedStudent: user.isVerifiedStudent
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isVerifiedStudent = user.isVerifiedStudent
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isVerifiedStudent = token.isVerifiedStudent as boolean
        session.user.firstName = token.firstName as string | undefined
        session.user.lastName = token.lastName as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/connexion"
  },
  session: { strategy: "jwt" }
})

export async function getAuthenticatedUser(request: NextRequest) {
  // 1. Try session cookie
  const session = await auth()
  if (session?.user) {
    return session.user
  }

  // 2. Try Bearer token
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const tokenStr = authHeader.substring(7)
    try {
      const decoded = await decode({
        token: tokenStr,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "default_secret",
        salt: "authjs.session-token"
      })
      if (decoded && decoded.id) {
        return {
          id: decoded.id as string,
          email: decoded.email as string,
          role: decoded.role as string,
          isVerifiedStudent: decoded.isVerifiedStudent as boolean,
          firstName: decoded.firstName as string | undefined,
          lastName: decoded.lastName as string | undefined
        }
      }
    } catch (e) {
      return null
    }
  }

  return null
}
