"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercent = (scrollTop / docHeight) * 100;
      setProgress(scrolledPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // Expand behavior: collapsed at top (expands on hover), expanded after scroll
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (scrolled) {
      // After scrolling, always expanded (hover has no effect)
      setIsExpanded(true);
    } else if (hovered) {
      // At top, expand on hover
      setIsExpanded(true);
    } else {
      // At top without hover, collapse after delay
      timeout = setTimeout(() => setIsExpanded(false), 150);
    }
    return () => clearTimeout(timeout);
  }, [hovered, scrolled]);

  // Circle values
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 h-[64px]">
      <motion.nav
        layout
        className="flex items-center justify-between rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-white shadow-lg overflow-hidden h-[64px] px-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          width: isExpanded ? "720px" : "200px",
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
          mass: 0.8,
        }}
      >
        {/* Left Circle (Logo) */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-black shrink-0">
          <Image
            src="/images/1.svg"
            alt="Logo"
            width={28}
            height={28}
            className="object-contain invert"
          />
        </div>

        {/* Middle Links */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              layout
              className="flex-1 flex justify-center gap-8 text-sm font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
            >
              <a href="/about" className="hover:text-gray-300">
                About
              </a>
              <a href="/projects" className="hover:text-gray-300">
                Projects
              </a>
              <a href="#research" className="hover:text-gray-300">
                Research
              </a>
              <a href="#experience" className="hover:text-gray-300">
                Experience
              </a>
              <a href="#blog" className="hover:text-gray-300">
                Blog
              </a>
              <a href="#contact" className="hover:text-gray-300">
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Circle (Scroll Progress) */}
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#444"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Progress circle */}
            {mounted && (
              <circle
                cx="24"
                cy="24"
                r={radius}
                stroke="#fff"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.25s ease-out",
                }}
              />
            )}
          </svg>
        </div>
      </motion.nav>
    </div>
  );
}
