import Link from "next/link";
import { CityData } from "@/lib/types";
import { calculateCostIndex, calculateRentIndex } from "@/lib/data";

interface IndexSectionProps {
  sortedCities: CityData[];
  cities: CityData[];
}

function IndexBar({ city, index, color }: { city: CityData; index: number; color: "orange" | "blue" }) {
  const gradientFrom = color === "orange" ? "from-orange-400 to-orange-500" : "from-blue-400 to-blue-500";
  const hoverColor = color === "orange" ? "group-hover:text-orange-600" : "group-hover:text-blue-600";

  return (
    <Link href={`/cost-of-living/${city.slug}/prices`} className="flex items-center gap-2 group">
      <span className={`text-xs font-medium text-gray-700 w-20 shrink-0 ${hoverColor} transition-colors truncate`}>{city.name}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradientFrom} rounded-full`} style={{ width: `${Math.max(index, 10)}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{index}</span>
    </Link>
  );
}

export default function IndexSection({ sortedCities, cities }: IndexSectionProps) {
  const rentSorted = [...cities].sort((a, b) => calculateRentIndex(b) - calculateRentIndex(a));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost of Living Index */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Cost of Living Index</h2>
          <p className="text-xs text-gray-500 mb-4">Mumbai = 100. Score of 75 means ~25% cheaper than Mumbai.</p>
          <div className="space-y-2">
            {sortedCities.slice(0, 10).map((city) => (
              <IndexBar key={city.slug} city={city} index={calculateCostIndex(city)} color="orange" />
            ))}
          </div>
          <details className="mt-3">
            <summary className="text-xs text-orange-600 font-medium cursor-pointer hover:text-orange-700">
              Show all {sortedCities.length} cities
            </summary>
            <div className="space-y-2 mt-3">
              {sortedCities.slice(10).map((city) => (
                <IndexBar key={city.slug} city={city} index={calculateCostIndex(city)} color="orange" />
              ))}
            </div>
          </details>
        </div>

        {/* Rent Index */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Rent Index</h2>
          <p className="text-xs text-gray-500 mb-4">Rent & PG prices relative to Mumbai = 100</p>
          <div className="space-y-2">
            {rentSorted.slice(0, 10).map((city) => (
              <IndexBar key={city.slug} city={city} index={calculateRentIndex(city)} color="blue" />
            ))}
          </div>
          <details className="mt-3">
            <summary className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">
              Show all {cities.length} cities
            </summary>
            <div className="space-y-2 mt-3">
              {rentSorted.slice(10).map((city) => (
                <IndexBar key={city.slug} city={city} index={calculateRentIndex(city)} color="blue" />
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
