import SidebarNav from "./sidebar-nav"

const sidebarNavItems = [
  {
    href: "/admin/users",
    title: "Users"
  },
  {
    href: "/admin/events",
    title: "Events"
  }
]

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/12">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
