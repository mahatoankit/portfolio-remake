import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET(){
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request){
    try{
        const body = await request.json();

        const newProject = await prisma.project.create({
            data: {
                title: body.title,
                description: body.description,
                thumbnail: body.thumbnail,
                technologies: body.technologies || [],
                githubLink: body.githubLink,
                liveUrl: body.liveUrl,
                featured: body.featured || false,
                category: body.category,
                slug: body.slug,
                content: body.content || "",
            },
        });

        return NextResponse.json(newProject, {status:201});
    } catch (error){
        console.error('Error creating project:', error);
        return NextResponse.json({error: 'Invalid Request'}, {status: 400});
    }
}
