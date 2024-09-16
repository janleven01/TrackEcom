import Inventory from "@/lib/models/inventory"
import { formatDate } from "@/lib/utils"
import { AddEditProductValidation } from "@/lib/validation"
import { connectToDB } from "@/utils/database"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  const { productName, status, productPrice, stock } = await req.json()

  // Validate the data against the schema
  AddEditProductValidation.parse({
    productName,
    status,
    productPrice,
    stock,
  })

  try {
    await connectToDB()

    const existingProduct = await Inventory.findOne({
      username: params.username,
      "inventory.productName": productName,
    })

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists in your inventory" },
        { status: 404 }
      )
    }

    // Add the new product to the user's inventory
    const newProduct = await Inventory.findOneAndUpdate(
      { username: params.username },
      {
        $push: {
          inventory: {
            productName,
            status,
            price: productPrice,
            stock,
            createdAt: formatDate(new Date()),
          },
        },
      },
      { new: true, upsert: true } // Create a new document if it doesn't exist
    )

    await newProduct.save()

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 })
  }
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    if (!params.username) {
      return NextResponse.json({ message: "Missing username" }, { status: 400 })
    }

    await connectToDB()

    const userInventory = await Inventory.findOne({
      username: params.username,
    }).select("inventory")

    const inventory = userInventory?.inventory || []

    return NextResponse.json({
      inventory,
    })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json(
      { message: "Failed to retrieve chart data" },
      { status: 500 }
    )
  }
}

export const DELETE = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { username: string }
  }
) => {
  try {
    if (!params.username) {
      return NextResponse.json({ message: "Missing username" }, { status: 400 })
    }

    await connectToDB()

    const { searchParams } = new URL(req.url)
    const productName = searchParams.get("productName") // Get the product name from query params

    if (!productName) {
      return NextResponse.json(
        { message: "Missing product name" },
        { status: 400 }
      )
    }

    const result = await Inventory.findOneAndUpdate(
      { username: params.username },
      { $pull: { inventory: { productName } } },
      { new: true }
    )

    if (!result) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )
  }
}
