import { useRouter } from "next/router";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "~/lib/utils";

export function MobileNav() {
  const router = useRouter()
  const path = router.pathname
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Icons.menu className="w-6 h-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link
            aria-label="Home"
            href="/"
            className="flex items-center"
            onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            <Link
              href="/leaderboard"
              className={cn(
                "text-foreground/70 transition-colors hover:text-foreground",
                path === "/leaderboard" && "text-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
