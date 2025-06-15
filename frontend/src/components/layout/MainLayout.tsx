import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">Slack MCP Bot</span>
            </a>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a href="/dashboard" className="transition-colors hover:text-foreground/80">Dashboard</a>
            <a href="/settings" className="transition-colors hover:text-foreground/80">Settings</a>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
} 