import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/database/mongodb";
import Blog from "@/models/Blog";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extract user ID from JWT
const getUserIdFromToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
};

// GET /api/blogs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    const { searchParams } = new URL(request.url);
    const onlyUser = searchParams.get("onlyUser") === "true";

    const filter = onlyUser && userId ? { creator: userId } : {};
    const blogs = await Blog.find(filter).populate("creator", "fullname");

    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch blogs: ${error.message}` }, { status: 500 });
  }
}

// POST /api/blogs
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, image, tags } = await request.json();

    const newBlog = await Blog.create({
      title,
      content,
      image,
      tags,
      creator: userId,
      creatorRole: "user",
      createdAt: new Date(),
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to create blog: ${error.message}` }, { status: 500 });
  }
}

// PATCH /api/blogs/:id
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const { title, content, image, tags } = await request.json();

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, creator: userId },
      { title, content, image, tags, updatedAt: new Date() },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to update blog: ${error.message}` }, { status: 500 });
  }
}
