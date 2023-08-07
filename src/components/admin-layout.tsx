import SidebarNav from "./sidebar-nav"

const sidebarNavItems = [
  {
    href: "/admin/users",
    title: "Users"
  },
  {
    href: "/admin/events",
    title: "Events"
  },
  {
    href: "/admin/leagues",
    title: "Leagues"
  },
  {
    href: "/admin/players",
    title: "Players"
  },
  {
    href: "/admin/seasons",
    title: "Seasons"
  }
]

type AdminLayoutProps = {
  title: string
  children: React.ReactNode
  createForm?: React.ReactNode
}

export default function AdminLayout({ title, createForm, children }: AdminLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/12">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            {createForm && createForm}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
