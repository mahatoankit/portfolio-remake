import React from "react";
import Navbar from "../../../components/NavBar";
import Footer from "../../../components/Footer";

export default function Page() {
  return (
    <div className="bg-black text-white">
      <Navbar />

      {/* About Section - Dark Theme */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Apple-style gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Profile / Visual side */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src="images/profile.jpg" // replace with your image
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              About Me
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 font-light">
              I’m a{" "}
              <span className="font-medium text-white">
                Fullstack Developer
              </span>{" "}
              and{" "}
              <span className="font-medium text-white">AI/ML Engineer</span>{" "}
              passionate about creating intelligent systems and elegant digital
              experiences. With a strong foundation in{" "}
              <span className="font-medium text-white">
                Deep Learning research
              </span>
              , I bring together technical expertise and creativity to solve
              real-world problems.
            </p>

            <ul className="space-y-3 text-gray-400 mb-8">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 rounded-full bg-gray-500"></span>
                <span>
                  Hackathon recognition – award-winning AI/ML projects including{" "}
                  <span className="text-white">
                    medical imaging and smart systems
                  </span>
                  .
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 rounded-full bg-gray-500"></span>
                <span>
                  Community contributor – involved in{" "}
                  <span className="text-white">PIE & AI Kathmandu</span> and
                  university tech initiatives.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 rounded-full bg-gray-500"></span>
                <span>
                  Experienced with{" "}
                  <span className="text-white">
                    Next.js, TypeScript, PyTorch, TensorFlow
                  </span>
                  , and modern web + AI workflows.
                </span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="bg-white text-black px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-200 hover:scale-105"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="border border-gray-600 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105"
              >
                Contact Me
              </a>
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

      <Footer />
    </div>
  );
}
