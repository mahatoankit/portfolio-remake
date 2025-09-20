import Navbar from "../../components/NavBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section id="hero" className="h-screen flex items-center justify-center bg-black relative overflow-hidden">
          {/* Apple-style gradient mesh background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          {/* Content */}
          <div className="text-center px-4 relative z-10 max-w-5xl mx-auto">
            {/* Minimal intro text */}
            <div className="mb-8">
              <p className="text-sm md:text-base text-gray-400 font-medium tracking-wider uppercase mb-4">
                Developer Portfolio
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin text-white mb-6 tracking-tight leading-none">
                Hello, I'm{" "}
                <span className="font-light bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ankit
                </span>
              </h1>
            </div>
            
            {/* Apple-style description */}
            <div className="mb-12">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                Crafting exceptional digital experiences through 
                <span className="text-white font-normal"> innovative design</span> and 
                <span className="text-white font-normal"> cutting-edge technology</span>
              </p>
            </div>
            
            {/* Apple-style CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group bg-white text-black px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 min-w-[160px]">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  View My Work
                </span>
              </button>
              <button className="group border border-gray-600 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 min-w-[160px]">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  Download CV
                </span>
              </button>
            </div>
            
            {/* Minimal scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-gray-400"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">About Me</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              I'm a developer passionate about creating innovative solutions and beautiful user experiences. 
              With expertise in modern web technologies, I bring ideas to life through clean code and thoughtful design.
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">Projects</h2>
            <p className="text-lg text-gray-600">
              Here are some of my featured projects that showcase my skills and creativity.
            </p>
          </div>
        </section>

        {/* Research Section */}
        <section id="research" className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">Research</h2>
            <p className="text-lg text-gray-600">
              My research interests and academic contributions in technology and innovation.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">Experience</h2>
            <p className="text-lg text-gray-600">
              Professional experience and career journey in the tech industry.
            </p>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">Blog</h2>
            <p className="text-lg text-gray-600">
              Thoughts, tutorials, and insights about technology and development.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">Contact</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let's connect and discuss opportunities to work together.
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
              Get In Touch
            </button>
          </div>
        </section>
      </main>
    </>
  );
}