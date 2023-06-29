import { useTheme } from "next-themes";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Icons } from "./icons";
import { Avatar, AvatarImage } from "./ui/avatar";
import { type User } from "next-auth";

type UserDropdownMenuProps = {
  user: User
}

function UserDropdownMenu({ user }: UserDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? "some gravatar shit"} alt={user.name ?? ""} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Icons.user
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                />
                Admin
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild className="w-full">
          <Button className="" variant="ghost" onClick={() => void signOut()}>
            <Icons.logout
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function ThemeToggler() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icons.sun
        className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      <Icons.moon
        className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
    </Button>
  )
}

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="hidden gap-6 md:flex">
          <Link href="/">
            Revolt
          </Link>
          <Link href="/leaderboard">
            Leaderboard
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggler />
            {user ? (
              <UserDropdownMenu user={user} />
            ) : (
              <Button
                variant="default"
                onClick={() => void signIn()}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header >
  )
}
