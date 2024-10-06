"use client"

import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

const LoginMethods = () => {
  const { session, providers, loadingProvider } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Auth Providers for Google, Facebook, etc.
  const handleSignIn = (providerId: string) => {
    setIsLoading(true)
    signIn(providerId)
    router.replace(`/inventory/${session?.user.name}`)
  }

  return (
    <div className="flex max-sm:flex-col gap-2 sm:gap-4 justify-between sm:py-6 py-4 w-full">
      {loadingProvider && (
        <button
          type="button"
          disabled
          className="cursor-not-allowed flex items-center justify-center gap-2 border w-full p-2 rounded-lg bg-slate-100"
        >
          <Image
            src="/icons/google.svg"
            alt="google icon"
            width={30}
            height={30}
            className="size-5"
          />
          <div className="font-semibold">Google</div>
        </button>
      )}
      {providers &&
        Object.values(providers).map((provider) => {
          if (provider.id === "google") {
            return (
              <button
                type="button"
                key={provider.name}
                onClick={() => handleSignIn(provider.id)}
                className="flex items-center justify-center gap-2 border w-full p-2 rounded-lg hover:border-black"
              >
                <Image
                  src="/icons/google.svg"
                  alt="google icon"
                  width={30}
                  height={30}
                  className="size-5"
                />
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Google</div>
                    <Loader2
                      width={20}
                      height={20}
                      className="size-4 animate-spin"
                    />
                  </div>
                ) : (
                  <div className="font-semibold">Google</div>
                )}
              </button>
            )
          }
        })}
      <button
        type="button"
        disabled={true}
        className="flex items-center justify-center gap-2 border w-full p-2 rounded-lg cursor-not-allowed bg-slate-100"
        aria-disabled={true}
      >
        <Image
          src="/icons/facebook.svg"
          alt="facebook icon"
          width={50}
          height={50}
          className="size-7"
        />
        <div className="font-semibold">Facebook</div>
      </button>
    </div>
  )
}

export default LoginMethods
