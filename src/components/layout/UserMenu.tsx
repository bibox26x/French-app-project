"use client"

import { LogOut, User as UserIcon, LayoutDashboard, CalendarDays } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserMenuProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
    isVerifiedStudent: boolean
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.email?.substring(0, 2).toUpperCase() || "U"
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8 border border-border hover:ring-2 hover:ring-coral/20 transition-all">
            <AvatarFallback className="bg-coral-50 text-coral-700 text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-ink">{user.email}</p>
            {user.isVerifiedStudent && (
              <p className="text-xs leading-none text-blue-600 font-medium mt-1">Étudiant vérifié</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profil" className="cursor-pointer flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/reservations" className="cursor-pointer flex w-full items-center">
              <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
              <span>Mes réservations</span>
            </Link>
          </DropdownMenuItem>
          
          {user.role === "host" && (
            <DropdownMenuItem asChild>
              <Link href="/hote" className="cursor-pointer flex w-full items-center">
                <LayoutDashboard className="mr-2 h-4 w-4 text-coral" />
                <span className="text-coral font-medium">Espace Hôte</span>
              </Link>
            </DropdownMenuItem>
          )}

          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer flex w-full items-center">
                <LayoutDashboard className="mr-2 h-4 w-4 text-gray-700" />
                <span>Administration</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
