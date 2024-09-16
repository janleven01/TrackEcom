"use client"

import { BuiltInProviderType } from "next-auth/providers/index"
import {
  useSession,
  getProviders,
  ClientSafeProvider,
  LiteralUnion,
} from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"

export type ProvidersProps = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null

// Define the AuthContext type
interface AuthContextProps {
  session: ReturnType<typeof useSession>["data"]
  providers: ProvidersProps
  loadingProvider: boolean
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined)

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const [loadingProvider, setLoadingProvider] = useState(true)
  const [providers, setProviders] = useState<ProvidersProps>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders()
        setProviders(res)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingProvider(false)
      }
    }
    fetchProviders()
  }, [])

  return (
    <AuthContext.Provider value={{ session, providers, loadingProvider }}>
      {children}
    </AuthContext.Provider>
  )
}

//Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
