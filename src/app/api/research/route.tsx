import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Helper function to extract year from date string
function extractYear(dateString: string): string {
  const yearMatch = dateString.match(/\b(20\d{2})\b/);
  return yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
}

// Helper to sort research by date (newest first)
function parseDateForSorting(dateStr: string): number {
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const parts = dateStr.toLowerCase().split(" ");
  
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const monthIndex = monthNames.findIndex(m => parts[1].startsWith(m));
    const year = parseInt(parts[2]);
    
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day).getTime();
    }
  }
  
  if (parts.length === 2) {
    const monthIndex = monthNames.findIndex(m => parts[0].startsWith(m));
    const year = parseInt(parts[1]);
    
    if (monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, 1).getTime();
    }
  }
  
  const yearMatch = dateStr.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 0, 1).getTime();
  }
  
  return 0;
}

// GET all research publications
export async function GET() {
  try {
    const research = await prisma.research.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Sort by date (newest first)
    const sortedResearch = research.sort((a, b) => {
      return parseDateForSorting(b.date) - parseDateForSorting(a.date);
    });

    return NextResponse.json(sortedResearch);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json(
      { error: "Failed to fetch research" },
      { status: 500 }
    );
  }
}

// POST new research publication
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, authors, journal, date, abstract, doi, pdfUrl, externalUrl, citations, tags, thumbnail, featured } = body;

    // Auto-generate year from date
    const year = extractYear(date);

    const research = await prisma.research.create({
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

    return NextResponse.json(research, { status: 201 });
  } catch (error) {
    console.error("Error creating research:", error);
    return NextResponse.json(
      { error: "Failed to create research" },
      { status: 500 }
    );
  }
}
