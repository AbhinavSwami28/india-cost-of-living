"use client";

import Link from "next/link";
import { useState } from "react";
import { CityData } from "@/lib/types";
import { calculateCostIndex, formatPrice } from "@/lib/data";

// Group cities by region for visual display
const REGIONS: { name: string; states: string[] }[] = [
  { name: "North", states: ["Delhi", "Haryana", "Punjab", "Uttar Pradesh", "Uttarakhand", "Rajasthan", "Chandigarh"] },
  { name: "West", states: ["Maharashtra", "Gujarat", "Goa", "Madhya Pradesh"] },
  { name: "South", states: ["Karnataka", "Tamil Nadu", "Kerala", "Telangana", "Andhra Pradesh"] },
  { name: "East", states: ["West Bengal", "Bihar", "Jharkhand", "Odisha", "Assam", "Chhattisgarh"] },
];

const REGION_COLORS: Record<string, string> = {
  North: "bg-orange-500", West: "bg-blue-500", South: "bg-emerald-500", East: "bg-purple-500",
};
const REGION_LIGHT: Record<string, string> = {
  North: "bg-orange-50 border-orange-200 hover:border-orange-400",
  West: "bg-blue-50 border-blue-200 hover:border-blue-400",
  South: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
  East: "bg-purple-50 border-purple-200 hover:border-purple-400",
};

export default function IndiaMap({ cities }: { cities: CityData[] }) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {REGIONS.map((region) => {
        const regionCities = cities.filter((c) => region.states.includes(c.state));
        if (regionCities.length === 0) return null;

        return (
          <div key={region.name}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${REGION_COLORS[region.name]}`} />
              <h3 className="text-sm font-bold text-gray-900">{region.name} India</h3>
              <span className="text-xs text-gray-400">{regionCities.length} cities</span>
            </div>
            <div className="space-y-1">
              {regionCities.map((city) => {
                const index = calculateCostIndex(city);
                const rent = city.prices.find((p) => p.item === "1 BHK in City Centre");
                const isHovered = hoveredCity === city.slug;

                return (
                  <Link
                    key={city.slug}
                    href={`/cost-of-living/${city.slug}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm ${
                      isHovered ? REGION_LIGHT[region.name] : "border-transparent hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHoveredCity(city.slug)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-gray-900 truncate">{city.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">{city.state}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-xs text-gray-500">COL {index}</span>
                      {rent && <span className="text-xs font-medium text-gray-700">{formatPrice(rent.price)}</span>}
                      <span className="text-orange-400 text-xs">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
