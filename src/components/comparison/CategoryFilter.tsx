"use client";

import { CATEGORIES, CATEGORY_ICONS, Category } from "@/lib/types";

interface CategoryFilterProps {
  visibleCategories: Set<string>;
  onToggle: (cat: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  vegMode: boolean;
  onToggleVeg: () => void;
  nonVegCount: number;
}

export default function CategoryFilter({
  visibleCategories, onToggle, onSelectAll, onDeselectAll,
  vegMode, onToggleVeg, nonVegCount,
}: CategoryFilterProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleVeg}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
            vegMode
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
          }`}
        >
          🌱 Veg Mode {vegMode ? "ON" : "OFF"}
        </button>
        {vegMode && <span className="text-xs text-green-600">{nonVegCount} non-veg items excluded</span>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Filter Categories</h2>
          <div className="flex gap-2">
            <button onClick={onSelectAll} className="text-xs text-orange-600 hover:text-orange-700 font-medium">Select All</button>
            <span className="text-gray-300">|</span>
            <button onClick={onDeselectAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium">Deselect All</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <label key={cat} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${visibleCategories.has(cat) ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-gray-50 opacity-60"} hover:border-orange-400`}>
              <input type="checkbox" checked={visibleCategories.has(cat)} onChange={() => onToggle(cat)} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
              <span className="text-lg">{CATEGORY_ICONS[cat as Category]}</span>
              <span className="text-sm font-medium text-gray-700">{cat.split(" (")[0]}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
