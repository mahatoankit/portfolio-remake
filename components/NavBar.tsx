"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/research", label: "Publications" },
    { href: "/experience", label: "Experience" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 h-[64px]">
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
        {/* Left Circle (Logo) - Now Clickable */}
        <Link href="/" className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-black shrink-0 cursor-pointer hover:bg-neutral-800 transition-colors">
          <Image
            src="/images/1.svg"
            alt="Logo"
            width={28}
            height={28}
            className="object-contain invert"
          />
        </Link>

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
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-gray-300">
                  {link.label}
                </a>
              ))}
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

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <nav className="bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-black">
              <Image
                src="/images/1.svg"
                alt="Logo"
                width={24}
                height={24}
                className="object-contain invert"
              />
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-neutral-800"
              >
                <div className="px-6 py-4 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-lg font-medium text-white hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Scroll Progress Bar */}
                <div className="px-6 pb-6">
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    {Math.round(progress)}% scrolled
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </>
  );
}
