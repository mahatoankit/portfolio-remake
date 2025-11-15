import React from "react";
import { Timeline } from "../../../components/ui/timeline";
import Navbar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Briefcase, Calendar } from "lucide-react";

interface ExperienceCardProps {
  duration: string;
  company: string;
  role: string;
  description: string;
  logo?: string;
}

const ExperienceCard = ({ duration, company, role, description, logo }: ExperienceCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 transition-all duration-500 hover:border-neutral-600 hover:shadow-2xl hover:shadow-blue-500/10">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {logo ? (
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img src={logo} alt={company} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white font-geist group-hover:text-blue-400 transition-colors">
                {company}
              </h3>
              <p className="text-sm text-neutral-400 font-geist">{role}</p>
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-2 backdrop-blur-sm">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold text-neutral-300 font-geist">
            {duration}
          </span>
        </div>

        {/* Description */}
        <div className="text-neutral-400 font-geist leading-relaxed">
          <p className="text-sm md:text-base">{description}</p>
        </div>
      </div>

      {/* Animated border glow on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-20" />
    </div>
  );
};

async function getExperiences() {
  try {
    const res = await fetch("http://localhost:3000/api/experiences", {
      cache: "no-store",
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  // Group experiences by year
  const groupedByYear = experiences.reduce((acc: any, exp: any) => {
    if (!acc[exp.year]) {
      acc[exp.year] = [];
    }
    acc[exp.year].push(exp);
    return acc;
  }, {});

  // Convert to timeline format
  const experienceData = Object.keys(groupedByYear)
    .sort()
    .reverse()
    .map((year) => ({
      title: year,
      content: (
        <div className="space-y-6">
          {groupedByYear[year].map((exp: any) => (
            <ExperienceCard
              key={exp.id}
              duration={exp.duration}
              company={exp.company}
              role={exp.role}
              description={exp.description}
              logo={exp.logo}
            />
          ))}
        </div>
      ),
    }));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-950">
        <Timeline data={experienceData} />
      </div>
      <Footer />
    </>
  );
}
