import Link from "next/link";
import { cities } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇮🇳</span>
              <span className="font-bold text-white text-lg">India Cost of Living</span>
            </div>
            <p className="text-sm text-gray-400">
              Compare the cost of living across major Indian cities. Accurate, up-to-date prices for rent, groceries, transport, PG accommodation, and more.
            </p>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">Top Cities</h3>
            <ul className="space-y-2">
              {cities.slice(0, 10).map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/cost-of-living/${city.slug}`}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">More Cities</h3>
            <ul className="space-y-2">
              {cities.slice(10, 20).map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/cost-of-living/${city.slug}`}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
              {cities.length > 20 && (
                <li>
                  <Link
                    href="/#cities"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
                  >
                    +{cities.length - 20} more →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Tools & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/compare" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  Compare Cities
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link href="/compare/mumbai-vs-bangalore" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  Mumbai vs Bangalore
                </Link>
              </li>
              <li>
                <Link href="/compare/delhi-vs-bangalore" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  Delhi vs Bangalore
                </Link>
              </li>
              <li>
                <Link href="/compare/hyderabad-vs-pune" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  Hyderabad vs Pune
                </Link>
              </li>
            </ul>

            <h3 className="text-white font-semibold mt-6 mb-3">Info</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} India Cost of Living. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Prices are community-sourced averages and may vary. Last updated February 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
