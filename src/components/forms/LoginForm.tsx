"use client"

import { LoginFormValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "../ui/button"
import { EyeIcon, EyeOffIcon, LoaderCircle, Lock, Mail } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CustomFormField from "../CustomForm"
import { getSession, signIn } from "next-auth/react"
import { FormFieldType } from "@/types"

const LoginForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPassword ? "text" : "password"

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  // Credentials Provider submit
  const onSubmit = async (values: z.infer<typeof LoginFormValidation>) => {
    const result = await signIn("credentials", {
      redirect: false, // prevent next-auth to redirect if signIn fails
      email: values.email,
      password: values.password,
    })
    if (result?.ok) {
      // Fetch the updated session
      const session = await getSession()

      router.replace(`/inventory/${session?.user.name}`)
    } else {
      // Handle errors
      if (result?.error === "Invalid password") {
        form.setError("password", {
          message: "Invalid password. Please try again.",
        })
      } else {
        form.setError("password", {
          message: result?.error || "Sign-in failed. Please try again.",
        })
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-2 sm:py-6"
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            placeholder="Email"
            Icon={<Mail size={25} className="ml-2 text-slate-500" />}
          />
          <div className="space-y-1">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              placeholder="Password"
              inputType={inputType}
              autoComplete="off"
              Icon={<Lock size={25} className="ml-2 text-slate-500" />}
              renderOthers={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} className="text-slate-500" />
                  ) : (
                    <EyeIcon size={20} className="text-slate-500" />
                  )}
                </button>
              }
            />
            <Link
              href="/forgot-password"
              className="flex w-full justify-end text-primary text-xs sm:text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            variant={"default"}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <div className="flex gap-1">
                <LoaderCircle width={20} height={20} className="animate-spin" />
                <p>Logging in...</p>
              </div>
            ) : (
              <div>Log in</div>
            )}
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-1 text-xs sm:text-sm">
        <p className="text-slate-500 ">Don&apos;t have an account?</p>
        <Link href="/create-account" className="text-primary ">
          Create an account
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
