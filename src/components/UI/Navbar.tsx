"use client"
import { signOut, useSession } from "next-auth/react";
import Avatar from "./Avatar";
import { AVAILABLE_THEMES, Theme, useTheme } from "~/context/ThemeContext";
import { Session } from "next-auth";

function UserMenu() {
  return (
    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
      <li>
        <a href="/admin">Admin</a>
      </li>
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
}

export default function Navbar({ session }: NavbarProps) {

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <a href="/">Revolt</a>
      </div>
      <div className="navbar-end">
        <ThemeMenu />
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Avatar url={session?.user?.image ?? ""} />
            </div>
          </label>
          {session && session.user ? <UserMenu /> : <>Log in</>}
        </div>
      </div>
    </div >
  )
}
