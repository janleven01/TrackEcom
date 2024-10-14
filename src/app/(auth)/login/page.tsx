import LoginForm from "@/components/forms/LoginForm"
import LoginMethods from "@/components/LoginMethods"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect(`/inventory/${session.user.name}`)

  return (
    <main className="w-full sm:px-10 px-6 h-screen flex items-center justify-center">
      <section className="flex max-w-[70rem] w-[70rem] max-h-[35rem] h-full border shadow-lg rounded-xl overflow-hidden">
        <div className="md:basis-1/2 w-full m-auto flex items-center justify-center p-4">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Login to your Account
            </h1>
            <p className="text-sm text-slate-500 pt-2">
              Welcome back! Continue with:
            </p>

            <LoginMethods />

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300" />
              <span className="text-sm mx-4 text-gray-500">
                or continue with email
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <LoginForm />
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center basis-1/2 bg-blue-500">
          <Image
            src="/login_img.png"
            alt="Login Image"
            width={400}
            height={400}
            className="size-[380px] object-contain basis-4/6"
          />
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold text-center">
              Key Performance Metrics Overview
            </p>
            <p className="text-xs tracking-tight text-center text-white/80">
              Insights into Account Growth, Orders, and Average Contracts
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
