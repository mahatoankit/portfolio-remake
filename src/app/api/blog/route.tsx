import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// GET all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const blog = await prisma.blog.create({
      data: {
        ...body,
        publishedAt: body.published ? new Date() : null,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
