import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { UserMenu } from './UserMenu'
import { Button } from '@/components/ui/button'

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon-mark.svg" alt="Fête, en fait logo" width={32} height={32} />
            <span className="hidden font-medium text-ink sm:inline-block">Fête, en fait</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex text-gray-700">
            <Link href="/recherche" className="hover:text-ink transition-colors">Rechercher</Link>
            <Link href="/a-propos" className="hover:text-ink transition-colors">À propos</Link>
          </nav>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link href="/inscription">Inscription</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
