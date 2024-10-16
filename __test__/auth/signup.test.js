import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { useRouter } from "next/navigation"
import SignupForm from "@/components/forms/SignupForm"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the fetch function
global.fetch = jest.fn()

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

describe("SignupForm", () => {
  const mockRouter = {
    replace: jest.fn(),
  }

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter)
    mockRouter.replace.mockClear()
  })

  it("renders the form correctly", () => {
    render(<SignupForm />)

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText("I agree with Terms and Condition")
    ).toBeInTheDocument()
    expect(screen.getByText("Already have an account?")).toBeInTheDocument()
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("toggles password visibility", () => {
    render(<SignupForm />)

    const passwordInput = screen.getByPlaceholderText("Password")
    const toggleButton = screen.getByRole("button", { name: "Show Password" })

    expect(passwordInput).toHaveAttribute("type", "password")
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("submits the form with valid data", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    })

    render(<SignupForm />)

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    })
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByText("I agree with Terms and Condition"))

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "testuser",
          email: "test@example.com",
          password: "password123",
          terms: true,
        }),
      })
      expect(mockRouter.replace).toHaveBeenCalledWith("/login")
    })
  })

  it("handles server error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already taken" }),
    })

    render(<SignupForm />)

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    })
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByText("I agree with Terms and Condition"))

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }))

    await waitFor(() => {
      const errorMessages = screen.getAllByText("Email already taken")
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })

  // it("handles network error", async () => {
  //   global.fetch.mockRejectedValueOnce(new Error("Network error"))

  //   render(<SignupForm />)

  //   fireEvent.change(screen.getByPlaceholderText("Username"), {
  //     target: { value: "testuser" },
  //   })
  //   fireEvent.change(screen.getByPlaceholderText("Email"), {
  //     target: { value: "test@example.com" },
  //   })
  //   fireEvent.change(screen.getByPlaceholderText("Password"), {
  //     target: { value: "password123" },
  //   })
  //   fireEvent.click(screen.getByText("I agree with Terms and Condition"))

  //   fireEvent.click(screen.getByRole("button", { name: /Create Account/i }))

  //   await waitFor(() => {
  //     expect(screen.getByText("Email already taken")).toBeInTheDocument()
  //   })
  // })
})
