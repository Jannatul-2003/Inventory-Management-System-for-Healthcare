"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Define user type
export interface User {
  id: number
  name: string
  contact_info: string
  role: "admin" | "customer" | "supplier"
}

// Define auth context type
interface AuthContextType {
  user: User | null
  login: (userData: User, token: string) => void
  logout: () => void
  isLoading: boolean
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Define public routes that don't require authentication
const publicRoutes = ["/login"]

// Define role-based access control
const roleBasedRoutes: Record<string, string[]> = {
  admin: [
    "/",
    "/inventory",
    "/products",
    "/customers",
    "/orders",
    "/suppliers",
    "/shipments",
    "/analytics",
    "/payments",
  ],
  customer: ["/", "/orders", "/products"],
  supplier: ["/", "/orders", "/shipments", "/products"],
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser) as User
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setIsLoading(false)
  }, [])

  // // Check route access based on authentication and role
  // useEffect(() => {
  //   if (isLoading) return

  //   // Allow access to public routes
  //   if (publicRoutes.includes(pathname)) return

  //   // Redirect to login if not authenticated
  //   if (!user) {
  //     router.push("/login")
  //     return
  //   }

  //   // Check role-based access
  //   const allowedRoutes = roleBasedRoutes[user.role] || []
  //   const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

  //   if (!hasAccess) {
  //     // Redirect to dashboard if user doesn't have access to the current route
  //     router.push("/")
  //   }
  // }, [user, pathname, isLoading, router])
  useEffect(() => {
    if (isLoading) return;
  
    if (!user) {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
  
      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData);
          return; // Prevent immediate redirect
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
  
      // Redirect to login only if still unauthenticated
      if (!storedUser || !token) {
        router.push("/login");
      }
    } else {
      // Check role-based access
      const allowedRoutes = roleBasedRoutes[user.role] || [];
      const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));
  
      if (!hasAccess) {
        router.push("/");
      }
    }
  }, [user, pathname, isLoading, router]);
  

  // Login function
  // const login = (userData: User, token: string) => {
  //   setUser(userData)
  //   localStorage.setItem("user", JSON.stringify(userData))
  //   localStorage.setItem("token", token)
  // }
  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData); 
  
    // Wait for state to update before redirecting
    setTimeout(() => {
      router.push("/");
    }, 100);
  };
  

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

