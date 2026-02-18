"use client";

import { useState, useMemo } from "react";
import { CityData } from "@/lib/types";
import { calculateCostIndex } from "@/lib/data";
import CityCard from "./CityCard";

const STATES = [
  "All States",
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export default function CityExplorer({ cities }: { cities: CityData[] }) {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All States");
  const [sortBy, setSortBy] = useState("default");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let result = cities.filter((city) => {
      const matchesSearch =
        search === "" ||
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.state.toLowerCase().includes(search.toLowerCase());
      const matchesState = state === "All States" || city.state === state;
      return matchesSearch && matchesState;
    });

    if (sortBy === "cheapest") result = [...result].sort((a, b) => calculateCostIndex(a) - calculateCostIndex(b));
    else if (sortBy === "expensive") result = [...result].sort((a, b) => calculateCostIndex(b) - calculateCostIndex(a));
    else if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [cities, search, state, sortBy]);

  const isFiltering = search !== "" || state !== "All States";

  // States that actually have cities in our data
  const availableStates = useMemo(() => {
    const stateSet = new Set(cities.map((c) => c.state));
    return STATES.filter((s) => s === "All States" || stateSet.has(s));
  }, [cities]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* State filter */}
        <select value={state} onChange={(e) => setState(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white sm:w-44">
          {availableStates.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white sm:w-40">
          <option value="default">Default order</option>
          <option value="cheapest">Cheapest first</option>
          <option value="expensive">Most expensive</option>
          <option value="name">A → Z</option>
        </select>
      </div>

      {/* Results count */}
      {isFiltering && (
        <p className="text-xs text-gray-500 mb-4">
          {filtered.length} {filtered.length === 1 ? "city" : "cities"} found
          {state !== "All States" && ` in ${state}`}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* City grid */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(isFiltering || showAll ? filtered : filtered.slice(0, 12)).map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
          {!isFiltering && !showAll && filtered.length > 12 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 py-2.5 px-6 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-300 hover:shadow-sm transition-all"
              >
                Show all {filtered.length} cities
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No cities found</p>
          <p className="text-sm mt-1">Try a different search or state</p>
          <button
            onClick={() => { setSearch(""); setState("All States"); }}
            className="mt-3 text-sm text-orange-600 font-medium hover:text-orange-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
