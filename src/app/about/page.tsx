"use client";

import React from "react";
import Navbar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";

export default function Page() {
  const stats = [
    { label: "Projects Completed", value: "50+" },
    { label: "Research Papers", value: "5+" },
    { label: "Hackathon Wins", value: "10+" },
    { label: "Years Experience", value: "3+" },
  ];

  const skills = [
    {
      category: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "PostgreSQL", "Prisma"],
    },
    {
      category: "AI/ML",
      items: ["PyTorch", "TensorFlow", "Computer Vision", "NLP"],
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "AWS", "Vercel"],
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Ambient Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative inline-block mb-8">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-2 ring-white/20 shadow-2xl mx-auto">
                <img
                  src="/images/profile.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Ankit Mahato
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-4">
              Fullstack Developer & AI/ML Engineer
            </p>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Crafting intelligent systems and elegant digital experiences
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <a
              href="/projects"
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              View Projects
            </a>
            <a
              href="/contact"
              className="border border-gray-700 text-white px-8 py-3 rounded-full font-medium hover:border-white transition-all duration-300 hover:scale-105"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
              About Me
            </h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                I'm a passionate{" "}
                <span className="text-white font-medium">
                  Fullstack Developer
                </span>{" "}
                and{" "}
                <span className="text-white font-medium">AI/ML Engineer</span>{" "}
                with a strong foundation in{" "}
                <span className="text-white font-medium">
                  Deep Learning research
                </span>
                . I specialize in building intelligent systems that bridge the
                gap between cutting-edge AI and practical, user-friendly
                applications.
              </p>
              <p>
                My journey in tech has been marked by hands-on experience across
                the full development stack—from crafting responsive,
                high-performance web applications with{" "}
                <span className="text-white font-medium">
                  Next.js and TypeScript
                </span>{" "}
                to training deep learning models with{" "}
                <span className="text-white font-medium">
                  PyTorch and TensorFlow
                </span>
                .
              </p>
              <p>
                Beyond code, I'm deeply involved in the tech community—actively
                contributing to{" "}
                <span className="text-white font-medium">
                  PIE & AI Kathmandu
                </span>{" "}
                and various university initiatives. I've earned recognition at
                multiple hackathons for projects ranging from medical imaging
                solutions to smart automation systems.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-neutral-900/30 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-black/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300 hover:scale-105"
                >
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {skill.category}
                  </h3>
                  <ul className="space-y-2">
                    {skill.items.map((item, idx) => (
                      <li key={idx} className="text-gray-400 text-sm flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              Highlights
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Award-Winning Projects",
                  description:
                    "Recognized at multiple hackathons for innovative AI/ML solutions including medical imaging diagnostics and smart automation systems.",
                },
                {
                  title: "Research Contributions",
                  description:
                    "Published research in deep learning, computer vision, and natural language processing, contributing to the advancement of AI technology.",
                },
                {
                  title: "Community Leadership",
                  description:
                    "Active contributor to PIE & AI Kathmandu and university tech communities, mentoring aspiring developers and organizing workshops.",
                },
                {
                  title: "Full-Stack Expertise",
                  description:
                    "Proficient in modern web technologies and AI frameworks, delivering end-to-end solutions from concept to deployment.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
