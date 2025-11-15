import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Helper function to extract year from date string
function extractYear(dateString: string): string {
  const yearMatch = dateString.match(/\b(20\d{2})\b/);
  return yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
}

// GET single research publication
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const research = await prisma.research.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!research) {
      return NextResponse.json(
        { error: "Research not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json(
      { error: "Failed to fetch research" },
      { status: 500 }
    );
  }
}

// PUT update research publication
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, authors, journal, date, abstract, doi, pdfUrl, externalUrl, citations, tags, thumbnail, featured } = body;

    // Auto-generate year from date
    const year = extractYear(date);

    const research = await prisma.research.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title,
        authors,
        journal,
        year,
        date,
        abstract,
        doi: doi || null,
        pdfUrl: pdfUrl || null,
        externalUrl: externalUrl || null,
        citations: citations || 0,
        tags: tags || [],
        thumbnail: thumbnail || null,
        featured: featured || false,
      },
    });

    return NextResponse.json(research);
  } catch (error) {
    console.error("Error updating research:", error);
    return NextResponse.json(
      { error: "Failed to update research" },
      { status: 500 }
    );
  }
}

// DELETE research publication
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.research.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: "Research deleted successfully" });
  } catch (error) {
    console.error("Error deleting research:", error);
    return NextResponse.json(
      { error: "Failed to delete research" },
      { status: 500 }
    );
  }
}
