"use client";

import { CityData } from "@/lib/types";

export default function CityCompareDropdown({ currentSlug, cities }: { currentSlug: string; cities: CityData[] }) {
  return (
    <select
      defaultValue=""
      onChange={(e) => { if (e.target.value) window.location.href = `/compare/${currentSlug}-vs-${e.target.value}`; }}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white"
    >
      <option value="">Pick a city to compare...</option>
      {cities.map((c) => (
        <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
      ))}
    </select>
  );
}
