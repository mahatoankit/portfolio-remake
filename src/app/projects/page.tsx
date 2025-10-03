import Footer from "../../../components/Footer";
import { HeroParallax } from "../../../components/HeroParallax";
import Navbar from "../../../components/NavBar";
import { Project } from "@/types/project";

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

  return (
    <>
      <Navbar />
      
      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <HeroParallax products={featuredProjects} />
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
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
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
