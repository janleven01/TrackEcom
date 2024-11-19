import Inventory from "@/lib/models/inventory"
import { AddEditProductValidation } from "@/lib/validation"
import { connectToDB } from "@/lib/database"
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
        { status: 400 }
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
            createdAt: new Date(),
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
  req: Request,
  {
    params,
  }: {
    params: { username: string }
  }
) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const productsPerPage = 6
    const skip = (page - 1) * productsPerPage

    if (!params.username) {
      return NextResponse.json({ message: "Missing username" }, { status: 400 })
    }

    await connectToDB()

    const result = await Inventory.aggregate([
      { $match: { username: params.username } },
      {
        $facet: {
          metadata: [
            { $project: { count: { $size: "$inventory" } } },
            { $limit: 1 },
          ],
          data: [
            { $project: { inventory: 1 } },
            { $unwind: "$inventory" },
            { $skip: skip },
            { $limit: productsPerPage },
            {
              $group: {
                _id: null,
                inventory: { $push: "$inventory" },
              },
            },
          ],
        },
      },
      {
        $project: {
          count: { $arrayElemAt: ["$metadata.count", 0] },
          inventory: { $arrayElemAt: ["$data.inventory", 0] },
        },
      },
    ])

    const { count, inventory } = result[0]
    const totalPages = Math.ceil(count / productsPerPage)

    return NextResponse.json({
      inventory: inventory || [],
      currentPage: page,
      totalPages: totalPages,
      totalItems: count,
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

    // Parse the JSON body to get the product names
    const productNames = await req.json()

    if (!productNames || productNames.length === 0) {
      return NextResponse.json(
        { message: "Missing product names" },
        { status: 400 }
      )
    }

    const result = await Inventory.findOneAndUpdate(
      { username: params.username },
      {
        $pull: { inventory: { productName: { $in: productNames } } },
      },
      { new: true } // Return the updated document
    )

    if (!result) {
      return NextResponse.json(
        { message: "No products found to delete" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Products deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )
  }
}
