export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readTime: number;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string | null;
}
