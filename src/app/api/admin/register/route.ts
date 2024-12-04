import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/database/mongodb";
import Admin from "@/models/Admin";

export async function POST(request: NextRequest) {
  try {
    await dbConnect(); 

    const { fullname, email, password, role } = await request.json();

    if (!fullname || !email || !password) {
      return NextResponse.json(
        { error: "Fullname, email, and password are required." },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      role: role || "editor", 
      isVerified: false,
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
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to register admin: ${error}` },
      { status: 500 }
    );
  }
}
