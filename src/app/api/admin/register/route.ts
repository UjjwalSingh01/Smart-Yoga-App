import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/database/mongodb";
import Admin from "@/models/Admin";

// POST: Register a new admin
export async function POST(request: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    const { fullname, email, password, role } = await request.json();

    // Validate input
    if (!fullname || !email || !password) {
      return NextResponse.json(
        { error: "Fullname, email, and password are required." },
        { status: 400 }
      );
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      role: role || "editor", // Default role is "editor"
      isVerified: true, // Default to not verified
    });

    return NextResponse.json(
      {
        message: "Admin registered successfully. Verification pending.",
        admin: {
          id: newAdmin._id,
          fullname: newAdmin.fullname,
          email: newAdmin.email,
          role: newAdmin.role,
          isVerified: newAdmin.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to register admin: ${error.message}` },
      { status: 500 }
    );
  }
}
