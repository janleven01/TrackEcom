import Inventory from "@/lib/models/inventory"
import { AddEditProductValidation } from "@/lib/validation"
import { connectToDB } from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { username: string; selectedProduct: string }
  }
) => {
  try {
    // Check if username is provided
    if (!params.username) {
      return NextResponse.json({ message: "Missing username" }, { status: 400 })
    }

    await connectToDB()

    // Find user's inventory
    const userInventory = await Inventory.findOne({
      username: params.username,
    }).select("inventory")

    // If selectedProduct is provided, find the specific product
    if (params.selectedProduct) {
      const product = userInventory?.inventory.find(
        (item: any) => item.productName === params.selectedProduct
      )

      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(product)
    }

    // Return entire inventory if no productName is provided
    const inventory = userInventory?.inventory || []

    return NextResponse.json({ inventory })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { message: "Failed to retrieve product data" },
      { status: 500 }
    )
  }
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { username: string; selectedProduct?: string } }
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

    // Update the product fields
    await Inventory.findOneAndUpdate(
      {
        username: params.username,
        "inventory.productName": params.selectedProduct,
      },
      {
        $set: {
          "inventory.$.productName": productName,
          "inventory.$.status": status,
          "inventory.$.price": productPrice,
          "inventory.$.stock": stock,
          "inventory.$.updatedAt": new Date(), // Track update timestamp
        },
      },
      { new: true } // Return the updated document
    )

    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 201 }
    )
  } catch (error) {
    return new Response("Failed to update product", { status: 500 })
  }
}
