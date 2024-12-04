import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Social from "@/models/Social";

// GET /api/social - Fetch all social media posts
export async function GET() {
  try {
    await dbConnect();
    const socialPosts = await Social.find().sort({ datePosted: -1 });
    return NextResponse.json(socialPosts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch social posts: ${error.message}` }, { status: 500 });
  }
}

// POST /api/social - Add a new social media post
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();

    const newSocialPost = await Social.create(data);
    return NextResponse.json(newSocialPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to create social post: ${error.message}` }, { status: 500 });
  }
}
