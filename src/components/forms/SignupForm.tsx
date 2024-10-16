"use client"

import { SignupFormValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "../ui/button"
import {
  EyeIcon,
  EyeOffIcon,
  LoaderCircle,
  Lock,
  Mail,
  User,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CustomFormField from "../CustomForm"
import { FormFieldType } from "@/types"

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPassword ? "text" : "password"

  const router = useRouter()

  const form = useForm<z.infer<typeof SignupFormValidation>>({
    resolver: zodResolver(SignupFormValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof SignupFormValidation>) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const result = await res.json()

      if (res.ok) {
        // Redirect to login after successful signup
        router.replace("/login")
      } else {
        form.setError("email", { message: result.message })
        form.setFocus("email")
      }
    } catch (error) {
      form.setError("email", { message: "Email already taken" })
      form.setFocus("email")
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-2 sm:py-4"
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="Username"
            error={form.formState.errors.name?.message}
            Icon={<User size={25} className="ml-2 text-slate-500" />}
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            placeholder="Email"
            error={form.formState.errors.email?.message}
            Icon={<Mail size={25} className="ml-2 text-slate-500" />}
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            placeholder="Password"
            inputType={inputType}
            error={form.formState.errors.password?.message}
            Icon={<Lock size={25} className="ml-2 text-slate-500" />}
            autoComplete="off"
            renderOthers={
              <button
                type="button"
                aria-label="Show Password"
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
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="terms"
            description="I agree with Terms and Condition"
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            variant={"default"}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <div className="flex gap-1">
                <LoaderCircle size={20} className="animate-spin" />
                <p>Creating Account...</p>
              </div>
            ) : (
              <div>Create Account</div>
            )}
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-1 text-xs sm:text-sm">
        <p className="text-slate-500 ">Already have an account?</p>
        <Link href="/login" className="text-primary ">
          Login
        </Link>
      </div>
    </div>
  )
}

export default SignupForm
