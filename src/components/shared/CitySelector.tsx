"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cities } from "@/lib/data";

interface CitySelectorProps {
  city1Slug?: string;
  city2Slug?: string;
}

export default function CitySelector({ city1Slug, city2Slug }: CitySelectorProps) {
  const router = useRouter();
  const [c1, setC1] = useState(city1Slug || "mumbai");
  const [c2, setC2] = useState(city2Slug || "bangalore");

  const handleCompare = () => {
    if (c1 && c2 && c1 !== c2) {
      router.push(`/compare/${c1}-vs-${c2}`);
    }
  };

  return (
    <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Compare Two Cities</h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">City 1</label>
          <select
            value={c1}
            onChange={(e) => setC1(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white"
          >
            <option value="">Select a city...</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug} disabled={city.slug === c2}>
                {city.name}, {city.state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center sm:pb-2">
          <span className="text-gray-400 font-bold text-lg">vs</span>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">City 2</label>
          <select
            value={c2}
            onChange={(e) => setC2(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white"
          >
            <option value="">Select a city...</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug} disabled={city.slug === c1}>
                {city.name}, {city.state}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompare}
          disabled={!c1 || !c2 || c1 === c2}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
