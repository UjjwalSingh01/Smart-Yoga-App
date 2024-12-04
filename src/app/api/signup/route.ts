import { NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { fullname, email, password } = await request.json();

    if (!fullname || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      orders: [],
      cart: [],
      blogs: [],
    });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
