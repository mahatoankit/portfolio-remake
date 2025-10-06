export interface Project {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    technologies: string[];
    githubLink?: string;
    liveUrl?: string;
    featured: boolean;
    category: 'web' | 'mobile' | 'AI/ML' | 'data-science' | 'other';
    status: 'completed' | 'in-progress' | 'planned';
    isSpotlight: boolean;
    createdAt: string;
    updatedAt?: string;
    slug: string;
    content?: string; // Markdown content for project details
}


export interface CreateProjectRequest{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    technologies: string;
    githubLink?: string;
    liveUrl?: string;
    featured: boolean;
    category: 'web' | 'mobile' | 'AI/ML' | 'data-science' | 'other';
    createdAt: string;
    updatedAt?: string;
    slug: string;
    content?: string; // Markdown content
}
