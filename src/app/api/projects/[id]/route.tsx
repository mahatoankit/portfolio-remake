import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });
  
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // If marking as spotlight, remove spotlight from all other projects
    if (body.isSpotlight) {
      await prisma.project.updateMany({
        where: {
          id: { not: Number(id) },
          isSpotlight: true,
        },
        data: {
          isSpotlight: false,
        },
      });
    }
    
    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        technologies: body.technologies || [],
        githubLink: body.githubLink,
        liveUrl: body.liveUrl,
        featured: body.featured,
        category: body.category,
        status: body.status,
        isSpotlight: body.isSpotlight,
        slug: body.slug,
        content: body.content,
      },
    });
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: body,
    });
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.project.delete({
      where: { id: Number(id) },
    });
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
}
