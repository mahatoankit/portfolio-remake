import Footer from "../../components/Footer";
import Navbar from "../../components/NavBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          id="hero"
          className="h-screen flex items-center justify-center bg-black relative overflow-hidden"
        >
          {/* Apple-style gradient mesh background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Content */}
          <div className="text-center px-4 relative z-10 max-w-5xl mx-auto">
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

            <div className="mb-12">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                Crafting exceptional digital experiences through
                <span className="text-white font-normal"> innovative design</span> and
                <span className="text-white font-normal"> cutting-edge technology</span>
              </p>
            </div>

            {/* CTA buttons linking to other pages */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a
                href="/projects"
                className="group bg-white text-black px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 min-w-[160px]"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  View My Work
                </span>
              </a>
              <a
                href="/contact"
                className="group border border-gray-600 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 min-w-[160px]"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  Contact Me
                </span>
              </a>
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
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>
        </section>

        <Footer/>
      </main>
    </>
  );
}
