import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Blog from "@/models/Blog";

// GET: Fetch all blogs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get userId directly from request headers
    const userId = request.headers.get("userId");
    const { searchParams } = new URL(request.url);
    const onlyUser = searchParams.get("onlyUser") === "true";

    const filter = onlyUser && userId ? { creator: userId } : {};
    const blogs = await Blog.find(filter).populate("creator", "fullname");

    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch blogs: ${error.message}` }, { status: 500 });
  }
}

// POST: Create a new blog
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get userId directly from request headers
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, content, image, tags } = await request.json();

    const newBlog = await Blog.create({
      title,
      description,
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

// PATCH: Update a blog
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    // Get userId directly from request headers
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const { title, description, content, image, tags } = await request.json();

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, creator: userId },
      { title, description, content, image, tags, updatedAt: new Date() },
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

// DELETE: Remove a blog
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // Get userId directly from request headers
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const deletedBlog = await Blog.findOneAndDelete({ _id: blogId, creator: userId });
    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete blog: ${error.message}` }, { status: 500 });
  }
}
