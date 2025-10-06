import Footer from "../../../components/Footer";
import { HeroParallax } from "../../../components/HeroParallax";
import Navbar from "../../../components/NavBar";
import { Project } from "@/types/project";
import { CheckCircle2, Clock, CalendarClock, Star, Trophy } from "lucide-react";

async function getProjects():Promise<Project[]>{
  const res = await fetch("http://localhost:3000/api/projects", {
    cache: "no-store" //always get fresh data
      });
      if (!res.ok){
        throw new Error('Failed to fetch projects')
      }
      return res.json();
}

const projects = [
  {
    title: "Project One",
    link: "/projects/project-one",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Two",
    link: "/projects/project-two",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Three",
    link: "/projects/project-three",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Four",
    link: "/projects/project-four",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Five",
    link: "/projects/project-five",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Six",
    link: "/projects/project-six",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Seven",
    link: "/projects/project-seven",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Eight",
    link: "/projects/project-eight",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Nine",
    link: "/projects/project-nine",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Ten",
    link: "/projects/project-ten",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Eleven",
    link: "/projects/project-eleven",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Twelve",
    link: "/projects/project-twelve",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Thirteen",
    link: "/projects/project-thirteen",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Fourteen",
    link: "/projects/project-fourteen",
    thumbnail: "/images/profile.jpg",
  },
  {
    title: "Project Fifteen",
    link: "/projects/project-fifteen",
    thumbnail: "/images/profile.jpg",
  },
];

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  // Filter featured projects for HeroParallax
  const featuredProjects = projects
    .filter(project => project.featured)
    .map(project => ({
      title: project.title,
      link: `/projects/${project.slug}`,
      thumbnail: project.thumbnail,
    }));

  // Get the spotlight project (only if explicitly marked as isSpotlight=true)
  const spotlightProject = projects.find(p => p.isSpotlight);

  return (
    <>
      <Navbar />
      
      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <HeroParallax products={featuredProjects} />
      )}

      {/* Spotlight Project Section */}
      {spotlightProject && (
        <section className="bg-neutral-950 px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-12 h-12 text-yellow-500" />
                <h2 className="text-5xl font-extrabold tracking-tight text-white font-geist">
                  Most Valuable Project
                </h2>
              </div>
              <p className="text-xl text-neutral-400 font-geist">
                Handpicked showcase of exceptional work
              </p>
            </div>

            <a
              href={`/projects/${spotlightProject.slug}`}
              className="group relative block bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Image Section */}
              <div className="relative h-[500px] overflow-hidden">
                <img
                  src={spotlightProject.thumbnail}
                  alt={spotlightProject.title}
                  className="w-full h-full object-cover scale-110 blur-[3px] opacity-80 group-hover:scale-[1.15] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
                
                {/* Badges */}
                <div className="absolute top-8 right-8 flex gap-3 z-10">
                  {/* Status Badge */}
                  {spotlightProject.status === 'completed' && (
                    <div className="bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold font-geist flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                  {spotlightProject.status === 'in-progress' && (
                    <div className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold font-geist flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      In Progress
                    </div>
                  )}
                  {spotlightProject.status === 'planned' && (
                    <div className="bg-purple-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold font-geist flex items-center gap-2">
                      <CalendarClock className="w-4 h-4" />
                      Planned
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {spotlightProject.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full text-sm font-bold font-geist flex items-center gap-2 shadow-lg shadow-yellow-500/50">
                      <Star className="w-4 h-4 fill-black" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
                  <h3 className="text-5xl font-extrabold text-white mb-4 font-geist group-hover:text-neutral-200 transition-colors drop-shadow-2xl">
                    {spotlightProject.title}
                  </h3>
                  <p className="text-xl text-neutral-200 mb-6 max-w-3xl font-geist drop-shadow-lg">
                    {spotlightProject.description}
                  </p>

                  {/* Technologies */}
                  {spotlightProject.technologies && spotlightProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {spotlightProject.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold font-geist"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="inline-flex items-center gap-2 text-white font-bold text-lg font-geist group-hover:gap-4 transition-all">
                    View Project
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="bg-neutral-900/50 backdrop-blur-sm border-t border-neutral-800 px-12 py-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-neutral-500 text-sm font-semibold mb-1 font-geist">
                      CATEGORY
                    </div>
                    <div className="text-white font-bold capitalize font-geist">
                      {spotlightProject.category}
                    </div>
                  </div>
                  
                  {spotlightProject.githubLink && (
                    <div>
                      <div className="text-neutral-500 text-sm font-semibold mb-1 font-geist">
                        SOURCE
                      </div>
                      <div className="text-blue-400 font-bold font-geist">
                        GitHub
                      </div>
                    </div>
                  )}
                  
                  {spotlightProject.liveUrl && (
                    <div>
                      <div className="text-neutral-500 text-sm font-semibold mb-1 font-geist">
                        STATUS
                      </div>
                      <div className="text-green-400 font-bold font-geist">
                        Live
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-neutral-400 font-geist">
                  Click to explore →
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section className="min-h-screen bg-neutral-950 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-extrabold tracking-tight mb-4 text-white text-center font-geist">
            All Projects
          </h2>
          <p className="text-xl text-neutral-400 mb-12 text-center font-geist">
            Explore my complete portfolio of work
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <a
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group relative bg-neutral-900/80 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {/* Status Badge */}
                    {project.status === 'completed' && (
                      <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </div>
                    )}
                    {project.status === 'in-progress' && (
                      <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </div>
                    )}
                    {project.status === 'planned' && (
                      <div className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <CalendarClock className="w-3 h-3" />
                        Planned
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-yellow-500/50">
                        <Star className="w-3 h-3 fill-black" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neutral-300 transition-colors font-geist">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-neutral-400 text-sm line-clamp-2 font-geist">
                      {project.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
