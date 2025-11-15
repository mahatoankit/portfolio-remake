export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  logo?: string;
  year: string;
  startDate: string;
  endDate?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
