import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService, UserResponse } from './api'

interface AuthContextType {
  user: UserResponse | null
  loading: boolean
  login: (userData: UserResponse) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const login = (userData: UserResponse) => {
    setUser(userData)
  }

  const logout = async () => {
    setUser(null)
    // Call logout API to clear cookies
    try {
      await apiService.logout()
    } catch (error) {
      console.error("Logout API call failed:", error)
      // Still clear the user state even if API call fails
    }
  }

  const checkAuth = async () => {
    try {
      console.log("Debug: Checking authentication...")
      const response = await apiService.getCurrentUser()
      console.log("Debug: Auth response:", response)
      if (response.data) {
        console.log("Debug: User authenticated:", response.data.email)
        setUser(response.data)
      } else {
        console.log("Debug: No user data in response")
        setUser(null)
      }
    } catch (error) {
      console.log("Debug: Auth check failed:", error)
      // User is not authenticated
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 