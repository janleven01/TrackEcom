import { NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/database"
import User from "@/lib/models/user"
import { SignupFormValidation } from "@/lib/validation"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, terms } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    // Validate the data against the schema
    SignupFormValidation.parse({
      name,
      email,
      password: hashedPassword,
      terms,
    })

    await connectToDB()

    // Check if the user already exists
    const userExist = await User.findOne({ email })
    if (userExist) {
      return NextResponse.json(
        { message: "Email already taken" },
        { status: 400 }
      )
    }

    // Create a new user
    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      terms,
    })

    await newUser.save()
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    )
  }
}
