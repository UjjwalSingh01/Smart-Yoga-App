import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/database/mongodb";
import Blog from "@/models/Blog";

// GET /api/blogs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const onlyUser = searchParams.get("onlyUser") === "true";

    const filter = onlyUser && session?.user ? { creator: session.user.id } : {};
    const blogs = await Blog.find(filter);

    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch blogs: ${error.message}` }, { status: 500 });
  }
}

// POST /api/blogs
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, image, tags } = await request.json();

    const newBlog = await Blog.create({
      title,
      content,
      image,
      tags,
      creator: session.user.id,
      creatorRole: session.user.role, // Ensure `role` is included in session
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

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const { title, content, image, tags } = await request.json();

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, creator: session.user.id },
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
