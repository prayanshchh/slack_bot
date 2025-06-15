import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Logo } from "@/components/ui/logo"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/lib/auth-context"
import { UserProfile } from "@/components/ui/user-profile"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Setup Guide", href: "/greythr-setup-guide" },
  { name: "Contact", href: "#contact" },
]

interface NavbarProps {
  simplified?: boolean
}

export function Navbar({ simplified = false }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const { user, loading, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation - Only show if not simplified */}
          {!simplified && (
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-muted"
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Conditional Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <UserProfile />
                ) : (
                  !simplified && (
                    <div className="hidden md:flex items-center space-x-2">
                      <Link to="/signin">
                        <Button variant="ghost" className="hover:bg-muted">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button variant="glow">Sign Up</Button>
                      </Link>
                    </div>
                  )
                )}
              </>
            )}

            {/* Mobile menu button - Only show if not simplified */}
            {!simplified && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu - Only show if not simplified */}
        {!simplified && isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navigation.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            {user && (
              <Link 
                to="/dashboard" 
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="px-4 pt-4 space-y-2 border-t border-border/40">
              {user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/signin" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="glow" className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 