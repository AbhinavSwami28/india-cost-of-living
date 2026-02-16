"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cities } from "@/lib/data";
import { useTheme } from "./ThemeProvider";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
      className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1.5 text-gray-600 dark:text-gray-400 focus:ring-1 focus:ring-orange-500 focus:outline-none cursor-pointer"
      title="Theme"
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="system">💻 System</option>
    </select>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🇮🇳</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              India Cost of Living
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/"
              className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
              Home
            </Link>

            {/* Cities Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                onBlur={() => setTimeout(() => setCityDropdownOpen(false), 200)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-1"
              >
                Cities
                <svg
                  className={`w-4 h-4 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#171717] rounded-lg shadow-lg border border-gray-200 dark:border-[#2a2a2a] py-2 max-h-80 overflow-y-auto">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/cost-of-living/${city.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      onClick={() => setCityDropdownOpen(false)}
                    >
                      {city.name}, {city.state}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/compare"
              className={`text-sm font-medium transition-colors ${isActive("/compare") ? "text-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
              Compare
            </Link>
            <Link href="/offer"
              className={`text-sm font-medium transition-colors ${isActive("/offer") ? "text-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
              Job Offer
            </Link>
            <Link href="/calculator"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              My Budget
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile: theme + menu */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link href="/compare" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMenuOpen(false)}>
              Compare Cities
            </Link>
            <Link href="/offer" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMenuOpen(false)}>
              Should I Take This Offer?
            </Link>
            <Link href="/calculator" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMenuOpen(false)}>
              My Budget Calculator
            </Link>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Cities</p>
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/cost-of-living/${city.slug}`}
                  className="block py-1.5 text-sm text-gray-600 hover:text-orange-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {city.name}, {city.state}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
