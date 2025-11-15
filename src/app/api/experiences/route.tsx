import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// Helper function to extract year from date string
function extractYear(dateString: string): string {
  // Try to extract year from formats like "Jan 2024", "2024", "January 2024", etc.
  const yearMatch = dateString.match(/\b(20\d{2})\b/);
  return yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
}

// Helper function to calculate duration
function calculateDuration(startDate: string, endDate: string | null): string {
  const end = endDate && endDate.toLowerCase() !== 'present' ? endDate : 'Present';
  return `${startDate} - ${end}`;
}

// Helper function to parse date for sorting (returns timestamp)
function parseDateForSorting(dateString: string): number {
  if (dateString.toLowerCase() === 'present') {
    return Date.now(); // Current date for "Present"
  }
  
  // Try to parse common formats like "Jan 2024", "January 2024", etc.
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }
  
  // Fallback: try to extract year and month
  const months: Record<string, number> = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11
  };
  
  const parts = dateString.toLowerCase().split(/[\s,]+/);
  const year = parts.find(p => /^20\d{2}$/.test(p));
  const monthStr = parts.find(p => months[p] !== undefined);
  
  if (year) {
    const month = monthStr ? months[monthStr] : 0;
    return new Date(parseInt(year), month).getTime();
  }
  
  return 0;
}

// GET all experiences (sorted by most recent first)
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany();
    
    // Sort by start date (most recent first)
    const sorted = experiences.sort((a, b) => {
      const dateA = parseDateForSorting(a.startDate);
      const dateB = parseDateForSorting(b.startDate);
      return dateB - dateA; // Descending order
    });
    
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

// POST - Create new experience
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Auto-calculate year and duration
    const year = extractYear(body.startDate);
    const duration = calculateDuration(body.startDate, body.endDate);
    
    const experience = await prisma.experience.create({
      data: {
        company: body.company,
        role: body.role,
        duration,
        description: body.description,
        logo: body.logo || null,
        year,
        startDate: body.startDate,
        endDate: body.endDate || 'Present',
        order: 0, // Not used anymore, but keep for compatibility
      },
    });
    
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
