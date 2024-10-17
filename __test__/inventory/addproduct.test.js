import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import AddProduct from "@/components/inventory/AddProduct"
import { useAuth } from "../../src/context/AuthContext"
import { useToast } from "../../src/hooks/use-toast"
import { useRouter } from "next/navigation"
import userEvent from "@testing-library/user-event"

jest.mock("../../src/context/AuthContext", () => ({
  useAuth: jest.fn(),
}))

jest.mock("../../src/hooks/use-toast", () => ({
  useToast: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

function createMockPointerEvent(type, props = {}) {
  const event = new Event(type, props)
  Object.assign(event, {
    button: props.button ?? 0,
    ctrlKey: props.ctrlKey ?? false,
    pointerType: props.pointerType ?? "mouse",
  })
  return event
}

// Assign the mock function to the global window object
window.PointerEvent = createMockPointerEvent

// Mock HTMLElement methods
Object.assign(window.HTMLElement.prototype, {
  scrollIntoView: jest.fn(),
  releasePointerCapture: jest.fn(),
  hasPointerCapture: jest.fn(),
})

describe("AddProduct", () => {
  const mockSession = { user: { name: "testUser" } }
  const mockToast = jest.fn()
  const mockRouterRefresh = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    useAuth.mockReturnValue({ session: mockSession })
    useToast.mockReturnValue({ toast: mockToast })
    useRouter.mockReturnValue({ refresh: mockRouterRefresh })
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const openDialog = async () => {
    render(<AddProduct />)

    await user.click(screen.getByRole("button", { title: "Add Product" }))

    // Wait for the dialog to open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })
  }

  it("should display required error when value is invalid", async () => {
    await openDialog()

    fireEvent.submit(screen.getByText("Save"))

    expect(await screen.findAllByRole("alert")).toHaveLength(3)
  })

  it("displays an error when the product name already exists", async () => {
    // Mock the fetch response for an existing product name
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          message: "Product already exists in your inventory",
        }),
    })

    await openDialog()

    await user.type(
      screen.getByPlaceholderText("Product Name"),
      "Existing Product"
    )
    await user.type(screen.getByPlaceholderText("Price"), "10.99")
    await user.type(screen.getByPlaceholderText("Stock"), "100")

    // Submit the form
    fireEvent.submit(screen.getByText("Save"))

    // Check for the error alert
    const alertElement = await screen.findAllByText(
      "Product already exists in your inventory"
    )
    expect(alertElement[0]).toHaveAttribute("role", "alert")
  })

  it("submits the form with valid data", async () => {
    await openDialog()

    await user.type(screen.getByPlaceholderText("Product Name"), "Test Product")
    await user.type(screen.getByPlaceholderText("Price"), "10.99")
    await user.type(screen.getByPlaceholderText("Stock"), "100")

    // Find the select trigger
    const selectTrigger = screen.getByRole("combobox")
    expect(selectTrigger).toBeInTheDocument()

    // Check the current value of the status field
    expect(selectTrigger).toHaveTextContent("Active")

    // Open the select dropdown
    await user.click(selectTrigger)

    expect(screen.getByRole("option", { name: "Active" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Draft" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Archived" })).toBeInTheDocument()

    // Find the "Draft" option by its role
    const draftOption = screen.getByRole("option", { name: "Draft" })
    await user.click(draftOption)

    expect(selectTrigger).toHaveTextContent("Draft")

    // Submit the form
    fireEvent.submit(screen.getByText("Save"))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/inventory/${mockSession.user.name}`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.any(String),
        })
      )

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.anything(),
        })
      )

      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })
})
