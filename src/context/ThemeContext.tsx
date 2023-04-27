import { createContext, useContext, useEffect } from "react"
import { useLocalStorage } from "~/hooks/useLocalStorage"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext({} as ThemeContextType)

export function useTheme() {
  return useContext(ThemeContext)
}

type ThemeProviderProps = {
  children: React.ReactNode
}

export const AVAILABLE_THEMES = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"] as const;
export type Theme = typeof AVAILABLE_THEMES[number]


export function ThemeProvider({ children }: ThemeProviderProps) {
  const DEFAULT_THEME: Theme = "dark"
  const [theme, setTheme] = useLocalStorage<Theme>("theme", DEFAULT_THEME)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
