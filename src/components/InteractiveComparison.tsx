"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CityData, CATEGORIES, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice, getPercentageDifference, getPricesByCategory, cities } from "@/lib/data";

interface InteractiveComparisonProps {
  initialCity1: CityData;
  initialCity2: CityData;
}

// Accommodation options for the selector
const ACCOMMODATION_OPTIONS = [
  { key: "1 BHK in City Centre", label: "1 BHK (City Centre)" },
  { key: "1 BHK Outside City Centre", label: "1 BHK (Outskirts)" },
  { key: "2 BHK in City Centre", label: "2 BHK (City Centre)" },
  { key: "2 BHK Outside City Centre", label: "2 BHK (Outskirts)" },
  { key: "3 BHK in City Centre", label: "3 BHK (City Centre)" },
  { key: "3 BHK Outside City Centre", label: "3 BHK (Outskirts)" },
  { key: "PG - Private Room (with meals)", label: "PG Private Room (with meals)" },
  { key: "PG - Private Room (without meals)", label: "PG Private Room (without meals)" },
  { key: "PG - Double Sharing (with meals)", label: "PG Double Sharing (with meals)" },
  { key: "PG - Double Sharing (without meals)", label: "PG Double Sharing (without meals)" },
  { key: "PG - Triple Sharing (with meals)", label: "PG Triple Sharing (with meals)" },
  { key: "PG - Triple Sharing (without meals)", label: "PG Triple Sharing (without meals)" },
] as const;

// Items to include in monthly budget calculation (with multipliers for daily items)
const MONTHLY_BUDGET_ITEMS: Record<string, { items: string[]; multiplier?: number; pickOne?: boolean }> = {
  "Restaurants & Dining": {
    items: ["Veg Thali (local restaurant)", "Chai (regular cup)", "Coffee (Cappuccino)"],
    multiplier: 30, // daily items * 30 days
  },
  "Groceries": {
    items: [
      "Rice (Basmati)", "Wheat Flour (Atta)", "Toor Dal", "Milk (Full Cream)",
      "Eggs", "Cooking Oil (Sunflower)", "Onions", "Tomatoes", "Potatoes",
    ],
  },
  "Transportation": {
    items: ["Metro / Local Train (monthly pass)", "Petrol"],
    pickOne: true,
  },
  "Utilities (Monthly)": {
    items: [
      "Electricity (2BHK, avg usage)", "Water Bill", "Cooking Gas (LPG Cylinder)",
      "Broadband Internet (100 Mbps)", "Mobile Plan (Jio/Airtel, 2GB/day)",
    ],
  },
  "Lifestyle & Entertainment": {
    items: ["Gym Membership", "Netflix (Standard Plan)", "Spotify Premium"],
  },
};

function EditablePrice({
  value,
  onChange,
  isEdited,
}: {
  value: number;
  onChange: (val: number) => void;
  isEdited: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleClick = () => {
    setInputVal(String(value));
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (inputVal === "" || inputVal === "0") {
      if (value !== 0) onChange(0);
      return;
    }
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed) && parsed >= 0 && parsed !== value) {
      onChange(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        type="text"
        inputMode="decimal"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-24 text-right text-sm font-semibold border border-orange-400 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-orange-50"
      />
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`text-sm font-semibold cursor-pointer group relative transition-colors ${
        isEdited ? "text-orange-600" : "text-gray-900"
      } hover:text-orange-500`}
      title="Click to edit price"
    >
      {formatPrice(value)}
      {isEdited && (
        <span className="ml-1 text-[10px] text-orange-500 font-normal">(edited)</span>
      )}
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Click to edit
      </span>
    </button>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-xs text-gray-400">same</span>;
  const isPositive = diff > 0;
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
        isPositive ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
      }`}
    >
      {isPositive ? "+" : ""}
      {diff}%
    </span>
  );
}


export default function InteractiveComparison({
  initialCity1,
  initialCity2,
}: InteractiveComparisonProps) {
  const router = useRouter();

  // City selection
  const [city1Slug, setCity1Slug] = useState(initialCity1.slug);
  const [city2Slug, setCity2Slug] = useState(initialCity2.slug);

  const city1Data = useMemo(() => cities.find((c) => c.slug === city1Slug) || initialCity1, [city1Slug, initialCity1]);
  const city2Data = useMemo(() => cities.find((c) => c.slug === city2Slug) || initialCity2, [city2Slug, initialCity2]);

  // Category visibility toggles
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(CATEGORIES)
  );

  // Custom price overrides: { "citySlug:itemName": price }
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});

  // Accommodation selection
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    "1 BHK Outside City Centre"
  );

  // Budget items selection (which items to include in monthly budget)
  const [budgetItems, setBudgetItems] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    Object.values(MONTHLY_BUDGET_ITEMS).forEach(({ items }) => {
      items.forEach((item) => initial.add(item));
    });
    initial.add("1 BHK Outside City Centre");
    return initial;
  });

  const toggleCategory = (cat: string) => {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const getPrice = useCallback(
    (citySlug: string, itemName: string, originalPrice: number) => {
      const key = `${citySlug}:${itemName}`;
      return customPrices[key] ?? originalPrice;
    },
    [customPrices]
  );

  const setPrice = (citySlug: string, itemName: string, price: number) => {
    setCustomPrices((prev) => ({
      ...prev,
      [`${citySlug}:${itemName}`]: price,
    }));
  };

  const isEdited = (citySlug: string, itemName: string) => {
    return `${citySlug}:${itemName}` in customPrices;
  };

  const resetAllPrices = () => {
    setCustomPrices({});
  };

  const editCount = Object.keys(customPrices).length;

  // Navigate when cities change
  const handleCityChange = (which: "city1" | "city2", slug: string) => {
    if (which === "city1") {
      setCity1Slug(slug);
      if (slug !== city2Slug) {
        router.push(`/compare/${slug}-vs-${city2Slug}`, { scroll: false });
      }
    } else {
      setCity2Slug(slug);
      if (city1Slug !== slug) {
        router.push(`/compare/${city1Slug}-vs-${slug}`, { scroll: false });
      }
    }
    setCustomPrices({});
  };

  // Calculate monthly budget
  const calculateMonthlyBudget = useCallback(
    (cityData: CityData) => {
      let total = 0;

      // Accommodation
      const accPrice = cityData.prices.find((p) => p.item === selectedAccommodation);
      if (accPrice) {
        total += getPrice(cityData.slug, accPrice.item, accPrice.price);
      }

      // Other budget items
      budgetItems.forEach((itemName) => {
        const priceItem = cityData.prices.find((p) => p.item === itemName);
        if (!priceItem) return;
        const price = getPrice(cityData.slug, priceItem.item, priceItem.price);

        // Check if this is a daily item (dining)
        const category = priceItem.category;
        const budgetConfig = MONTHLY_BUDGET_ITEMS[category];
        if (budgetConfig?.multiplier && budgetConfig.items.includes(itemName)) {
          total += price * budgetConfig.multiplier;
        } else {
          total += price;
        }
      });

      return total;
    },
    [selectedAccommodation, budgetItems, getPrice]
  );

  const toggleBudgetItem = (item: string) => {
    setBudgetItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const grouped1 = getPricesByCategory(city1Data.prices);
  const grouped2 = getPricesByCategory(city2Data.prices);

  const budget1 = calculateMonthlyBudget(city1Data);
  const budget2 = calculateMonthlyBudget(city2Data);
  const budgetDiff = getPercentageDifference(budget1, budget2);

  return (
    <div className="space-y-8">
      {/* City Selectors */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Select Cities to Compare</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">City 1</label>
            <select
              value={city1Slug}
              onChange={(e) => handleCityChange("city1", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug} disabled={city.slug === city2Slug}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center sm:pb-2">
            <button
              onClick={() => {
                const temp = city1Slug;
                handleCityChange("city1", city2Slug);
                setTimeout(() => handleCityChange("city2", temp), 0);
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Swap cities"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">City 2</label>
            <select
              value={city2Slug}
              onChange={(e) => handleCityChange("city2", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug} disabled={city.slug === city1Slug}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Checkboxes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Filter Categories</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setVisibleCategories(new Set(CATEGORIES))}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setVisibleCategories(new Set())}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Deselect All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                visibleCategories.has(cat)
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-200 bg-gray-50 opacity-60"
              } hover:border-orange-400`}
            >
              <input
                type="checkbox"
                checked={visibleCategories.has(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
              />
              <span className="text-lg">{CATEGORY_ICONS[cat as Category]}</span>
              <span className="text-sm font-medium text-gray-700">{cat.split(" (")[0]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Accommodation Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Your Accommodation Type</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select your preferred accommodation for the monthly budget calculation
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ACCOMMODATION_OPTIONS.map((opt) => {
            const isSelected = selectedAccommodation === opt.key;
            const price1 = city1Data.prices.find((p) => p.item === opt.key);
            const price2 = city2Data.prices.find((p) => p.item === opt.key);

            return (
              <label
                key={opt.key}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accommodation"
                    checked={isSelected}
                    onChange={() => setSelectedAccommodation(opt.key)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 accent-orange-500"
                  />
                  <span className={`text-sm font-medium ${isSelected ? "text-orange-700" : "text-gray-700"}`}>
                    {opt.label}
                  </span>
                </div>
                <div className="text-right">
                  {price1 && (
                    <span className="text-xs text-gray-500 block">
                      {formatPrice(getPrice(city1Data.slug, opt.key, price1.price))}
                    </span>
                  )}
                  {price2 && (
                    <span className="text-xs text-gray-400 block">
                      {formatPrice(getPrice(city2Data.slug, opt.key, price2.price))}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Monthly Budget Calculator */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">Estimated Monthly Budget</h2>
            <p className="text-sm text-orange-100">
              Based on your accommodation choice + selected items below
            </p>
          </div>
          {editCount > 0 && (
            <button
              onClick={resetAllPrices}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-colors"
            >
              Reset {editCount} custom price{editCount > 1 ? "s" : ""}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
            <div className="text-sm text-orange-100">{city1Data.name}</div>
            <div className="text-3xl font-bold">{formatPrice(budget1)}</div>
            <div className="text-xs text-orange-200">per month</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
            <div className="text-sm text-orange-100">{city2Data.name}</div>
            <div className="text-3xl font-bold">{formatPrice(budget2)}</div>
            <div className="text-xs text-orange-200">per month</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
            <div className="text-sm text-orange-100">Difference</div>
            <div className="text-3xl font-bold">{Math.abs(budgetDiff)}%</div>
            <div className="text-xs text-orange-200">
              {budgetDiff > 0 ? city2Data.name : city1Data.name} is costlier
            </div>
          </div>
        </div>

        {/* Budget Item Toggles */}
        <details className="group">
          <summary className="text-sm font-medium text-orange-100 cursor-pointer hover:text-white flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Customize budget items ({budgetItems.size} selected)
          </summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(MONTHLY_BUDGET_ITEMS).map(([category, config]) => (
              <div key={category} className="bg-white/10 rounded-lg p-3">
                <div className="text-xs font-semibold text-orange-200 mb-2 uppercase tracking-wide">
                  {category.split(" (")[0]}
                  {config.multiplier && (
                    <span className="font-normal normal-case ml-1">(×{config.multiplier} days)</span>
                  )}
                </div>
                {config.items.map((item) => (
                  <label key={item} className="flex items-center gap-2 py-0.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={budgetItems.has(item)}
                      onChange={() => toggleBudgetItem(item)}
                      className="w-3.5 h-3.5 rounded border-white/30 text-orange-300 focus:ring-orange-300 accent-orange-300"
                    />
                    <span className="text-xs text-orange-100">{item}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Interactive Comparison Tables */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Detailed Price Comparison</h2>
          <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            Click any price to edit it
          </p>
        </div>

        <div className="space-y-8">
          {CATEGORIES.map((category) => {
            if (!visibleCategories.has(category)) return null;

            const items1 = grouped1[category];
            const items2 = grouped2[category];
            if (!items1 || !items2) return null;

            return (
              <section key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{CATEGORY_ICONS[category as Category]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                    <p className="text-sm text-gray-500">
                      {CATEGORY_DESCRIPTIONS[category as Category]}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
                              Item
                            </th>
                            <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-orange-600">
                              {city1Data.name}
                            </th>
                            <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-blue-600">
                              {city2Data.name}
                            </th>
                            <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
                              Difference
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items1.map((item1, idx) => {
                            const item2 = items2.find((i) => i.item === item1.item);
                            if (!item2) return null;

                            const p1 = getPrice(city1Data.slug, item1.item, item1.price);
                            const p2 = getPrice(city2Data.slug, item2.item, item2.price);
                            const diff = getPercentageDifference(p1, p2);

                            return (
                              <tr
                                key={item1.item}
                                className={`${
                                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                } hover:bg-orange-50/30 transition-colors`}
                              >
                                <td className="px-4 sm:px-6 py-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item1.item}
                                  </div>
                                  <div className="text-xs text-gray-400">{item1.unit}</div>
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-right">
                                  <EditablePrice
                                    value={p1}
                                    onChange={(val) => setPrice(city1Data.slug, item1.item, val)}
                                    isEdited={isEdited(city1Data.slug, item1.item)}
                                  />
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-right">
                                  <EditablePrice
                                    value={p2}
                                    onChange={(val) => setPrice(city2Data.slug, item2.item, val)}
                                    isEdited={isEdited(city2Data.slug, item2.item)}
                                  />
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-right">
                                  <DiffBadge diff={diff} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* No categories selected */}
      {visibleCategories.size === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No categories selected</p>
          <p className="text-sm mt-1">Use the checkboxes above to show price categories</p>
        </div>
      )}
    </div>
  );
}
