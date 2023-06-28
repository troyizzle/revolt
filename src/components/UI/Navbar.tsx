"use client"
import { signIn, signOut } from "next-auth/react";
import Avatar from "./Avatar";
import { AVAILABLE_THEMES, Theme, useTheme } from "~/context/ThemeContext";
import { Session } from "next-auth";

function UserMenu({ user }: { user?: Session["user"] }) {
  return (
    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
      {user && user.isAdmin && (
        <li>
          <a href="/admin">Admin</a>
        </li>
      )}
      <li>
        <a onClick={() => void signOut()}>Logout</a>
      </li>
    </ul>
  )
}

function ThemeMenu() {
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <select
      className="select select-bordered  w-32"
      onChange={(e) => setTheme(e.target.value as Theme)}
      value={currentTheme}
    >
      {AVAILABLE_THEMES.map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  )
}

type NavbarProps = {
  session: Session | null;
  renderDrawer?: boolean
}

export default function Navbar({ session, renderDrawer }: NavbarProps) {

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <a href="/">Revolt</a>
      </div>
      {renderDrawer && <label htmlFor="my-drawer-3" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>}
      <div className="navbar-end">
        {session && session.user ? (
          <>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <Avatar src={session?.user?.image ?? ""} />
              </label>
              <UserMenu user={session.user} />
            </div>
          </>
        ) :
          <button className="btn btn-primary" onClick={() => void signIn()}>Sign in</button>
        }
      </div>
    </div >
  )
}
