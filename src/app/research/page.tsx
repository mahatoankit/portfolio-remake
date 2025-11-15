import React from "react";
import { Research } from "@/types/research";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { BookOpen, ExternalLink, FileDown, Award, Calendar, Users } from "lucide-react";

async function getResearch() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/research`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

// Research card component
function ResearchCard({ publication }: { publication: Research }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8 transition-all duration-500 hover:bg-neutral-900/50 hover:border-neutral-700">
      <div className="relative z-10">
        <div className="flex items-start gap-6 mb-6">
          {publication.thumbnail && (
            <div className="hidden md:block w-32 h-32 rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700">
              <img
                src={publication.thumbnail}
                alt={publication.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-semibold text-white tracking-tight group-hover:text-white/90 transition-colors">
                    {publication.title}
                  </h3>
                  {publication.featured && (
                    <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                  <Users className="h-4 w-4" />
                  <p className="line-clamp-1">{publication.authors.join(", ")}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span className="font-medium">{publication.journal}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {publication.date}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-neutral-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {publication.abstract}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              {publication.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-neutral-800/50 text-xs text-neutral-300 border border-neutral-700/50"
                >
                  {tag}
                </span>
              ))}
              {publication.citations > 0 && (
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-xs text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                  <Award className="h-3 w-3" />
                  {publication.citations} citations
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800">
          {publication.pdfUrl && (
            <a
              href={publication.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm text-white hover:bg-white/10 transition-colors border border-neutral-700/50"
            >
              <FileDown className="h-4 w-4" />
              PDF
            </a>
          )}
          {publication.externalUrl && (
            <a
              href={publication.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm text-white hover:bg-white/10 transition-colors border border-neutral-700/50"
            >
              <ExternalLink className="h-4 w-4" />
              Publisher
            </a>
          )}
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm text-white hover:bg-white/10 transition-colors border border-neutral-700/50"
            >
              DOI: {publication.doi}
            </a>
          )}
        </div>
      </div>
      
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default async function ResearchPage() {
  const research: Research[] = await getResearch();

  // Group research by year
  const groupedResearch: { [year: string]: Research[] } = {};
  research.forEach((item) => {
    if (!groupedResearch[item.year]) {
      groupedResearch[item.year] = [];
    }
    groupedResearch[item.year].push(item);
  });

  const years = Object.keys(groupedResearch).sort((a, b) => parseInt(b) - parseInt(a));

  // Separate featured research
  const featuredResearch = research.filter((r) => r.featured);

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Publications
            </h1>
          </div>
          <p className="text-lg md:text-xl text-neutral-400 max-w-3xl">
            Scientific publications, research papers, and contributions to the academic community
          </p>
        </div>

        {/* Featured Research */}
        {featuredResearch.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Featured Publications
            </h2>
            <div className="space-y-6">
              {featuredResearch.map((publication) => (
                <ResearchCard key={publication.id} publication={publication} />
              ))}
            </div>
          </div>
        )}

        {/* All Research by Year */}
        {years.length > 0 ? (
          <div className="space-y-12">
            {years.map((year) => (
              <div key={year}>
                <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                  {year}
                </h2>
                <div className="space-y-6">
                  {groupedResearch[year].map((publication) => (
                    <ResearchCard key={publication.id} publication={publication} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-16 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-neutral-600 mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              No publications yet
            </h3>
            <p className="text-neutral-400">
              Research publications will appear here once they're added.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
