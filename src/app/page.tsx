import { cities, calculateCostIndex, calculateRentIndex } from "@/lib/data";
import CityExplorer from "@/components/CityExplorer";
import CitySelector from "@/components/CitySelector";
import IndiaMap from "@/components/IndiaMap";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function HomePage() {
  // Sort cities by cost index (most expensive first)
  const sortedCities = [...cities].sort(
    (a, b) => calculateCostIndex(b) - calculateCostIndex(a)
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Cost of Living in India
            </h1>
            <p className="text-base sm:text-xl text-orange-100 mb-6 sm:mb-8 leading-relaxed">
              Compare prices across {cities.length} major Indian cities. From PG
              double sharing to 3BHK rent, chai to biryani — find out what life really costs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#cities"
                className="bg-white text-orange-600 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm sm:text-base"
              >
                Explore Cities
              </Link>
              <Link
                href="/compare"
                className="bg-orange-700/50 backdrop-blur-sm text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-orange-700/70 transition-colors border border-orange-400/30 text-sm sm:text-base"
              >
                Compare Two Cities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{cities.length}</div>
              <div className="text-[11px] sm:text-sm text-gray-500">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">56+</div>
              <div className="text-[11px] sm:text-sm text-gray-500">Prices</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">7</div>
              <div className="text-[11px] sm:text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">2026</div>
              <div className="text-[11px] sm:text-sm text-gray-500">Updated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CitySelector />
      </section>

      {/* India Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-gray-200 dark:border-[var(--card-border)] p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Cities We Cover</h2>
          <p className="text-xs text-gray-500 mb-4">Hover over a city to see quick stats. Click to explore.</p>
          <IndiaMap cities={cities} />
        </div>
      </section>

      {/* COL Index + Rent Index */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost of Living Index */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Cost of Living Index</h2>
            <p className="text-xs text-gray-500 mb-4">All items relative to Mumbai = 100</p>
            <div className="space-y-2">
              {sortedCities.slice(0, 10).map((city) => {
                const index = calculateCostIndex(city);
                return (
                  <Link key={city.slug} href={`/cost-of-living/${city.slug}`} className="flex items-center gap-3 group">
                    <span className="text-sm font-medium text-gray-700 w-24 shrink-0 group-hover:text-orange-600 transition-colors truncate">{city.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-end px-2" style={{ width: `${Math.max(index, 10)}%` }}>
                        <span className="text-[11px] font-bold text-white">{index}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <details className="mt-3">
              <summary className="text-xs text-orange-600 font-medium cursor-pointer hover:text-orange-700">
                Show all {sortedCities.length} cities
              </summary>
              <div className="space-y-2 mt-3">
                {sortedCities.slice(10).map((city) => {
                  const index = calculateCostIndex(city);
                  return (
                    <Link key={city.slug} href={`/cost-of-living/${city.slug}`} className="flex items-center gap-3 group">
                      <span className="text-sm font-medium text-gray-700 w-24 shrink-0 group-hover:text-orange-600 transition-colors truncate">{city.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-end px-2" style={{ width: `${Math.max(index, 10)}%` }}>
                          <span className="text-[11px] font-bold text-white">{index}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>

          {/* Rent Index */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Rent Index</h2>
            <p className="text-xs text-gray-500 mb-4">Rent & PG prices relative to Mumbai = 100</p>
            <div className="space-y-2">
              {[...cities].sort((a, b) => calculateRentIndex(b) - calculateRentIndex(a)).slice(0, 10).map((city) => {
                const index = calculateRentIndex(city);
                return (
                  <Link key={city.slug} href={`/cost-of-living/${city.slug}`} className="flex items-center gap-3 group">
                    <span className="text-sm font-medium text-gray-700 w-24 shrink-0 group-hover:text-blue-600 transition-colors truncate">{city.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-end px-2" style={{ width: `${Math.max(index, 10)}%` }}>
                        <span className="text-[11px] font-bold text-white">{index}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <details className="mt-3">
              <summary className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                Show all {cities.length} cities
              </summary>
              <div className="space-y-2 mt-3">
                {[...cities].sort((a, b) => calculateRentIndex(b) - calculateRentIndex(a)).slice(10).map((city) => {
                  const index = calculateRentIndex(city);
                  return (
                    <Link key={city.slug} href={`/cost-of-living/${city.slug}`} className="flex items-center gap-3 group">
                      <span className="text-sm font-medium text-gray-700 w-24 shrink-0 group-hover:text-blue-600 transition-colors truncate">{city.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-end px-2" style={{ width: `${Math.max(index, 10)}%` }}>
                          <span className="text-[11px] font-bold text-white">{index}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner adFormat="horizontal" className="my-4" />
      </div>

      {/* City Cards */}
      <section id="cities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore Cities
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Search or filter by state to find your city.
          </p>
        </div>

        <CityExplorer cities={cities} />
      </section>

      {/* SEO Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Cost of Living in India
          </h2>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
            <p>
              India&apos;s cost of living varies dramatically across cities. Mumbai, the
              financial capital, consistently tops the list as the most expensive city,
              with 1BHK rents in the city centre exceeding ₹35,000 per month. In contrast,
              cities like Lucknow and Jaipur offer a much more affordable lifestyle, with
              similar apartments available for ₹10,000-12,000.
            </p>
            <p>
              For young professionals and students, <strong>PG (Paying Guest) accommodation</strong> is
              a popular and affordable option unique to India. Double sharing PGs with meals
              range from ₹5,500 in Lucknow to ₹12,000 in Mumbai. Triple sharing rooms are
              even more budget-friendly, starting at ₹3,000 per month in tier-2 cities.
            </p>
            <p>
              Food costs also vary significantly. A simple veg thali can cost as little as
              ₹80 in Jaipur or Lucknow, while the same meal in Mumbai costs around ₹150.
              Street food remains remarkably affordable across all cities, with samosas and
              vada pav available for ₹10-20.
            </p>
            <p>
              Our data covers {cities.length} major Indian cities across 7 categories
              including restaurants, groceries, transportation, utilities, apartment rent,
              PG accommodation, and lifestyle expenses. All prices are in Indian Rupees (₹)
              and updated regularly.
            </p>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner adFormat="horizontal" className="mb-6" />
      </div>

      {/* Popular Comparisons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Comparisons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["mumbai", "delhi"],
            ["mumbai", "bangalore"],
            ["delhi", "bangalore"],
            ["hyderabad", "pune"],
            ["chennai", "kolkata"],
            ["bangalore", "hyderabad"],
            ["delhi", "jaipur"],
            ["pune", "mumbai"],
            ["kolkata", "lucknow"],
          ].map(([c1, c2]) => {
            const city1 = cities.find((c) => c.slug === c1)!;
            const city2 = cities.find((c) => c.slug === c2)!;
            return (
              <Link
                key={`${c1}-${c2}`}
                href={`/compare/${c1}-vs-${c2}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium text-gray-800">
                  {city1.name} vs {city2.name}
                </span>
                <span className="text-orange-500 text-sm">→</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
