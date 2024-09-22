import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"

import Provider from "@/components/Provider"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrackEcom",
  description: "Track Your Growth in Accounts and Orders Effectively",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession() // Fetch the session on the server side

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
