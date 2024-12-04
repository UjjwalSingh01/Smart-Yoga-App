import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Social from "@/models/Social";

export async function GET() {
  try {
    await dbConnect();
    const socialPosts = await Social.find().sort({ datePosted: -1 });
    return NextResponse.json(socialPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch social posts: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();

    const newSocialPost = await Social.create({
        platform: data.platform,
        postLink: data.postLink,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        description: data.description,
        tags: data.tags,
        datePosted: new Date() 
    });

    return NextResponse.json(newSocialPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create social post: ${error}` }, { status: 500 });
  }
}
