import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import AppRoutes from "./routes"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="hr-assistant-theme">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
