import { Routes, Route, Navigate } from "react-router-dom"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Contact } from "@/components/landing/Contact"
import { Navbar } from "@/components/layout/Navbar"
import { SignIn } from "@/pages/auth/SignIn"
import { SignUp } from "@/pages/auth/SignUp"
import { Dashboard } from "@/pages/Dashboard"
import { SlackIntegration } from "@/pages/integration/SlackIntegration"
import { GreytHRIntegration } from "@/pages/integration/GreytHRIntegration"
import { PrivacyPolicy } from "@/pages/legal/PrivacyPolicy"
import { TermsAndConditions } from "@/pages/legal/TermsAndConditions"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import { GreytHRSetupGuide } from "@/pages/guide/GreytHRSetupGuide"

function LandingPage() {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Redirect to dashboard if user is authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>
    </>
  )
}

export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/slack-integration" 
          element={
            <ProtectedRoute>
              <SlackIntegration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/greythr-integration" 
          element={
            <ProtectedRoute>
              <GreytHRIntegration />
            </ProtectedRoute>
          } 
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/greythr-setup-guide" element={<GreytHRSetupGuide />} />
      </Routes>
    </div>
  )
} 