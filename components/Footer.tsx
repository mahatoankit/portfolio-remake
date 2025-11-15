"use client";

import { Github, Mail } from "lucide-react"; // using lucide-react icons

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full px-6 py-12 bg-gradient-to-b from-black via-neutral-950 to-neutral-900 border-t border-neutral-800 mt-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="text-xl font-light text-neutral-300 tracking-tight">
            Let’s build something{" "}
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent font-normal">
              extraordinary
            </span>
          </h3>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mahatoankit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors px-4 py-2 rounded-full border border-neutral-700 hover:border-neutral-500"
            >
              <Github size={18} />
              <span className="text-sm font-medium">GitHub</span>
            </a>
            <a
              href="mailto:disezankit@gmail.com"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors px-4 py-2 rounded-full border border-neutral-700 hover:border-neutral-500"
            >
              <Mail size={18} />
              <span className="text-sm font-medium">Email</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-neutral-800" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span className="text-sm text-neutral-500 tracking-tight">
            © {year} Ankit Mahato. All rights reserved.
          </span>
          <span className="text-xs text-neutral-600 font-light">
            Built with <span className="text-neutral-400">Next.js</span>,{" "}
            <span className="text-neutral-400">Tailwind CSS</span> &{" "}
            <span className="text-neutral-400">Framer Motion</span>.
          </span>
        </div>
      </div>
    </footer>
  );
}
