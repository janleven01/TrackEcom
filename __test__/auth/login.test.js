import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import LoginForm from "@/components/forms/LoginForm"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the next-auth/react module
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}))

describe("LoginForm", () => {
  const mockRouter = {
    replace: jest.fn(),
  }

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter)
    signIn.mockClear()
    getSession.mockClear()
    mockRouter.replace.mockClear()
  })

  it("renders the form correctly", () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument()
    expect(screen.getByText("Create an account")).toBeInTheDocument()
  })

  it("toggles password visibility", () => {
    render(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText("Password")
    const toggleButton = screen.getByRole("button", { name: "Show Password" })

    expect(passwordInput).toHaveAttribute("type", "password")
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("submits the form with valid data", async () => {
    signIn.mockResolvedValue({ ok: true })
    getSession.mockResolvedValue({ user: { name: "testuser" } })

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
      })
      expect(getSession).toHaveBeenCalled()
      expect(mockRouter.replace).toHaveBeenCalledWith("/inventory/testuser")
    })
  })

  it("submits the form with valid data", async () => {
    signIn.mockResolvedValue({ ok: true })
    getSession.mockResolvedValue({ user: { name: "username2" } })

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "username2@gmail.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "username2" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "username2@gmail.com",
        password: "username2",
      })
      expect(getSession).toHaveBeenCalled()
      expect(mockRouter.replace).toHaveBeenCalledWith("/inventory/username2")
    })
  })

  it("handles sign-in failure", async () => {
    signIn.mockResolvedValue({ ok: false, error: "User not found" })

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    })
    fireEvent.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() => {
      expect(
        screen.getByText("User not found", {
          selector: "p.text-sm.font-medium.text-destructive",
        })
      ).toBeInTheDocument()

      expect(
        screen.getByText("User not found", {
          selector: 'span.hidden[role="alert"]',
        })
      ).toBeInTheDocument()
    })
  })
})
