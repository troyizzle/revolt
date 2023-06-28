import { useSession } from "next-auth/react";
import Navbar from "../Navbar";
import clsx from "clsx";
import { useRouter } from "next/router";

type AdminContainerProps = {
  children: React.ReactNode;
}

export default function AdminContainer({ children }: AdminContainerProps) {
  const { pathname } = useRouter()
  const { data: session } = useSession()

  const links = [
    { name: 'Events', href: '/admin/events' },
    { name: 'Players', href: '/admin/players' },
    { name: 'Races', href: '/admin/races' },
    { name: 'Teams', href: '/admin/teams' },
  ]

  function isActiveLink(href: string) {
    return pathname === href
  }

  return (
    <>
      <Navbar session={session} renderDrawer={true} />
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            {links.map((link) => (
              <li key={link.name}>
                <a
                className={clsx("", {
                  "bg-base-200": isActiveLink(link.href)
                })}
                href={link.href}>{link.name}</a>

              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
