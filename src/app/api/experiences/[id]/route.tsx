import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// GET single experience
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({
    where: { id: Number(id) },
  });
  
  if (!experience) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }
  
  return NextResponse.json(experience);
}

// PUT - Update experience
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Helper functions from route.tsx
    const extractYear = (dateString: string): string => {
      const yearMatch = dateString.match(/\b(20\d{2})\b/);
      return yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
    };
    
    const calculateDuration = (startDate: string, endDate: string | null): string => {
      const end = endDate && endDate.toLowerCase() !== 'present' ? endDate : 'Present';
      return `${startDate} - ${end}`;
    };
    
    // Auto-calculate year and duration
    const year = extractYear(body.startDate);
    const duration = calculateDuration(body.startDate, body.endDate);
    
    const updatedExperience = await prisma.experience.update({
      where: { id: Number(id) },
      data: {
        company: body.company,
        role: body.role,
        duration,
        description: body.description,
        logo: body.logo,
        year,
        startDate: body.startDate,
        endDate: body.endDate || 'Present',
        order: 0,
      },
    });
    
    return NextResponse.json(updatedExperience);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE experience
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.experience.delete({
      where: { id: Number(id) },
    });
    
    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
