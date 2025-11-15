export interface Research {
  id: number;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  date: string;
  abstract: string;
  doi?: string;
  pdfUrl?: string;
  externalUrl?: string;
  citations: number;
  tags: string[];
  thumbnail?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
