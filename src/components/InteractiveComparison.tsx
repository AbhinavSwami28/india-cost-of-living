"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CityData, CATEGORIES, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice, getPercentageDifference, getPricesByCategory, cities } from "@/lib/data";
import { decisionSummary, salaryEquivalent, affordabilityTier, TIER_CONFIG, calculateEMI, type AffordabilityTier as TierType } from "@/lib/decisions";

interface InteractiveComparisonProps {
  initialCity1: CityData;
  initialCity2: CityData;
}

const ACCOMMODATION_OPTIONS = [
  { key: "1 BHK in City Centre", label: "1 BHK (City Centre)" },
  { key: "1 BHK Outside City Centre", label: "1 BHK (Outskirts)" },
  { key: "2 BHK in City Centre", label: "2 BHK (City Centre)" },
  { key: "2 BHK Outside City Centre", label: "2 BHK (Outskirts)" },
  { key: "3 BHK in City Centre", label: "3 BHK (City Centre)" },
  { key: "3 BHK Outside City Centre", label: "3 BHK (Outskirts)" },
  { key: "PG - Private Room (with meals)", label: "PG Private (with meals)" },
  { key: "PG - Private Room (without meals)", label: "PG Private (no meals)" },
  { key: "PG - Double Sharing (with meals)", label: "PG Double (with meals)" },
  { key: "PG - Double Sharing (without meals)", label: "PG Double (no meals)" },
  { key: "PG - Triple Sharing (with meals)", label: "PG Triple (with meals)" },
  { key: "PG - Triple Sharing (without meals)", label: "PG Triple (no meals)" },
] as const;

const MONTHLY_BUDGET_ITEMS: Record<string, { items: string[]; multiplier?: number; pickOne?: boolean }> = {
  "Restaurants & Dining": {
    items: ["Veg Thali (local restaurant)", "Chai (regular cup)", "Coffee (Cappuccino)"],
    multiplier: 30,
  },
  "Groceries": {
    items: [
      "Rice (Basmati)", "Wheat Flour (Atta)", "Toor Dal", "Milk (Full Cream)",
      "Eggs", "Cooking Oil (Sunflower)", "Onions", "Tomatoes", "Potatoes",
    ],
  },
  "Transportation": { items: ["Metro / Local Train (monthly pass)", "Petrol"], pickOne: true },
  "Utilities (Monthly)": {
    items: [
      "Electricity", "Water Bill", "Cooking Gas (LPG Cylinder)",
      "Broadband Internet", "Mobile Plan (Jio/Airtel)",
    ],
  },
  "Household Help & Misc": {
    items: ["Cook (part-time, 2 meals/day)", "Maid / Cleaning Help", "Miscellaneous Monthly Spend"],
  },
  "Lifestyle & Entertainment": { items: ["Gym Membership", "Netflix (Standard Plan)", "Spotify Premium"] },
};

const DEFAULT_QUANTITIES: Record<string, number> = {
  "Rice (Basmati)": 5, "Wheat Flour (Atta)": 3, "Toor Dal": 2,
  "Milk (Full Cream)": 15, "Eggs": 3, "Chicken": 2, "Paneer": 1,
  "Onions": 3, "Tomatoes": 3, "Potatoes": 3,
  "Cooking Oil (Sunflower)": 2, "Sugar": 1, "Apples (Shimla)": 2,
  "Bananas": 2, "Bread (White, Sliced)": 4,
  "Auto Rickshaw (minimum fare)": 15, "Ola/Uber (avg ride)": 8,
  "Petrol": 20, "Diesel": 15,
  "Movie Ticket (Multiplex)": 2, "Haircut (Men, basic salon)": 1,
  "Domestic Beer (pint, restaurant)": 4, "Imported Beer (bottle, restaurant)": 2,
};

function EditablePrice({ value, onChange, isEdited }: {
  value: number; onChange: (val: number) => void; isEdited: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleClick = () => { setInputVal(String(value)); setEditing(true); };
  const handleBlur = () => {
    setEditing(false);
    if (inputVal === "" || inputVal === "0") { if (value !== 0) onChange(0); return; }
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed) && parsed >= 0 && parsed !== value) onChange(parsed);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
    if (e.key === "Escape") setEditing(false);
  };

  if (editing) {
    return (
      <input type="text" inputMode="decimal" value={inputVal}
        onChange={(e) => setInputVal(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus
        className="w-24 text-right text-sm font-semibold border border-orange-400 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-orange-50" />
    );
  }
  return (
    <button onClick={handleClick}
      className={`text-sm font-semibold cursor-pointer group relative transition-colors ${isEdited ? "text-orange-600" : "text-gray-900"} hover:text-orange-500`}
      title="Click to edit price">
      {formatPrice(value)}
      {isEdited ? (
        <span className="ml-1 text-[10px] text-orange-500 font-normal">(edited)</span>
      ) : (
        <svg className="inline-block w-3 h-3 ml-1 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )}
    </button>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-xs text-gray-400">same</span>;
  const isPositive = diff > 0;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
      {isPositive ? "+" : ""}{diff}%
    </span>
  );
}

export default function InteractiveComparison({ initialCity1, initialCity2 }: InteractiveComparisonProps) {
  const router = useRouter();

  const [city1Slug, setCity1Slug] = useState(initialCity1.slug);
  const [city2Slug, setCity2Slug] = useState(initialCity2.slug);
  const city1Data = useMemo(() => cities.find((c) => c.slug === city1Slug) || initialCity1, [city1Slug, initialCity1]);
  const city2Data = useMemo(() => cities.find((c) => c.slug === city2Slug) || initialCity2, [city2Slug, initialCity2]);

  const [activeTab, setActiveTab] = useState<"compare" | "calculator">("compare");
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const multiplier = viewMode === "yearly" ? 12 : 1;

  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set(CATEGORIES));
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [excludedItems, setExcludedItems] = useState<Set<string>>(new Set());
  const [vegMode, setVegMode] = useState(false);

  const NON_VEG_ITEMS = [
    "Non-Veg Thali (local restaurant)", "Biryani (chicken)", "Chicken", "Eggs",
  ];
  const [quantities, setQuantities] = useState<Record<string, number>>(() => ({ ...DEFAULT_QUANTITIES }));
  const [selectedAccommodation, setSelectedAccommodation] = useState("1 BHK Outside City Centre");
  const [budgetItems, setBudgetItems] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    Object.values(MONTHLY_BUDGET_ITEMS).forEach(({ items }) => items.forEach((item) => initial.add(item)));
    initial.add("1 BHK Outside City Centre");
    return initial;
  });
  const [salary1, setSalary1] = useState(0);
  const [salary2, setSalary2] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  // Home Loan EMI
  const [loanDownPct, setLoanDownPct] = useState(20);
  const [loanTenure, setLoanTenure] = useState(20);
  const [loanRate, setLoanRate] = useState(8.75);
  const avgProp1 = city1Data.prices.find((p) => p.item === "Home Loan EMI (2BHK avg)")?.price ?? 0;
  const avgProp2 = city2Data.prices.find((p) => p.item === "Home Loan EMI (2BHK avg)")?.price ?? 0;
  // Reverse EMI to get approx property price (EMI ≈ rent2c * 20, so property ≈ EMI * tenure * 12 / some factor)
  // Actually just use EMI * 240 / (rate factor) — simpler to store and show
  const propPrice1 = Math.round(avgProp1 * 240 / 1.8);
  const propPrice2 = Math.round(avgProp2 * 240 / 1.8);
  const emi1 = calculateEMI(propPrice1 * (1 - loanDownPct / 100), loanRate, loanTenure);
  const emi2 = calculateEMI(propPrice2 * (1 - loanDownPct / 100), loanRate, loanTenure);

  const toggleCategory = (cat: string) => {
    setVisibleCategories((prev) => { const next = new Set(prev); next.has(cat) ? next.delete(cat) : next.add(cat); return next; });
  };
  const toggleExcluded = (item: string) => {
    setExcludedItems((prev) => { const next = new Set(prev); next.has(item) ? next.delete(item) : next.add(item); return next; });
  };
  const toggleVegMode = () => {
    setVegMode((prev) => {
      const next = !prev;
      setExcludedItems((ex) => {
        const updated = new Set(ex);
        NON_VEG_ITEMS.forEach((item) => next ? updated.add(item) : updated.delete(item));
        return updated;
      });
      return next;
    });
  };
  const toggleBudgetItem = (item: string) => {
    setBudgetItems((prev) => { const next = new Set(prev); next.has(item) ? next.delete(item) : next.add(item); return next; });
  };

  const getQty = (item: string) => quantities[item] ?? 1;
  const setQty = (item: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [item]: Math.max(1, Math.min(99, qty)) }));
  };

  const getPrice = useCallback(
    (slug: string, item: string, original: number) => customPrices[`${slug}:${item}`] ?? original,
    [customPrices]
  );
  const setPrice = (slug: string, item: string, price: number) => {
    setCustomPrices((prev) => ({ ...prev, [`${slug}:${item}`]: price }));
  };
  const isEdited = (slug: string, item: string) => `${slug}:${item}` in customPrices;
  const resetAllPrices = () => setCustomPrices({});
  const editCount = Object.keys(customPrices).length;

  const handleCityChange = (which: "city1" | "city2", slug: string) => {
    if (which === "city1") { setCity1Slug(slug); if (slug !== city2Slug) router.push(`/compare/${slug}-vs-${city2Slug}`, { scroll: false }); }
    else { setCity2Slug(slug); if (city1Slug !== slug) router.push(`/compare/${city1Slug}-vs-${slug}`, { scroll: false }); }
    // Preserve edited prices — only clear prices for the city that changed
    // (items are keyed as "citySlug:itemName" so other city's edits are safe)
  };

  const calculateMonthlyBudget = useCallback(
    (cityData: CityData) => {
      let total = 0;
      if (!excludedItems.has(selectedAccommodation)) {
        const accPrice = cityData.prices.find((p) => p.item === selectedAccommodation);
        if (accPrice) total += getPrice(cityData.slug, accPrice.item, accPrice.price);
      }
      budgetItems.forEach((itemName) => {
        if (excludedItems.has(itemName)) return;
        const priceItem = cityData.prices.find((p) => p.item === itemName);
        if (!priceItem) return;
        const price = getPrice(cityData.slug, priceItem.item, priceItem.price) * (quantities[itemName] ?? 1);
        const budgetConfig = MONTHLY_BUDGET_ITEMS[priceItem.category];
        total += budgetConfig?.multiplier && budgetConfig.items.includes(itemName) ? price * budgetConfig.multiplier : price;
      });
      return total;
    },
    [selectedAccommodation, budgetItems, getPrice, excludedItems, quantities]
  );

  const applyProfile = (profile: "student" | "professional" | "family") => {
    const profiles = {
      student: { acc: "PG - Double Sharing (with meals)", ex: ["Meal for Two (high-end restaurant)", "Two Wheeler EMI (avg)", "Car EMI (avg)", "Diesel"] },
      professional: { acc: "1 BHK in City Centre", ex: ["Two Wheeler EMI (avg)", "Car EMI (avg)", "Diesel"] },
      family: { acc: "2 BHK in City Centre", ex: ["Two Wheeler EMI (avg)", "Car EMI (avg)", "PG - Private Room (with meals)", "PG - Private Room (without meals)", "PG - Double Sharing (with meals)", "PG - Double Sharing (without meals)", "PG - Triple Sharing (with meals)", "PG - Triple Sharing (without meals)"] },
    };
    const p = profiles[profile];
    setSelectedAccommodation(p.acc);
    setExcludedItems(new Set(p.ex));
    setQuantities({ ...DEFAULT_QUANTITIES });
    setCustomPrices({});
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    params.set("c1", city1Slug); params.set("c2", city2Slug);
    params.set("acc", selectedAccommodation); params.set("v", viewMode);
    if (salary1 > 0) params.set("s1", String(salary1));
    if (salary2 > 0) params.set("s2", String(salary2));
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`).then(() => {
      setShareCopied(true); setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const grouped1 = getPricesByCategory(city1Data.prices);
  const grouped2 = getPricesByCategory(city2Data.prices);
  const budget1 = calculateMonthlyBudget(city1Data);
  const budget2 = calculateMonthlyBudget(city2Data);
  const budgetDiff = getPercentageDifference(budget1, budget2);
  const savings1 = salary1 - budget1;
  const savings2 = salary2 - budget2;

  const qtyChanges = Object.entries(quantities).filter(([k, v]) => v !== (DEFAULT_QUANTITIES[k] ?? 1)).length;

  return (
    <div className="space-y-8">
      {/* City Selectors */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Select Cities to Compare</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">City 1</label>
            <select value={city1Slug} onChange={(e) => handleCityChange("city1", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
              {cities.map((city) => <option key={city.slug} value={city.slug} disabled={city.slug === city2Slug}>{city.name}, {city.state}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-center sm:pb-2">
            <button onClick={() => { const t = city1Slug; handleCityChange("city1", city2Slug); setTimeout(() => handleCityChange("city2", t), 0); }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Swap cities">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </button>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">City 2</label>
            <select value={city2Slug} onChange={(e) => handleCityChange("city2", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
              {cities.map((city) => <option key={city.slug} value={city.slug} disabled={city.slug === city1Slug}>{city.name}, {city.state}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["compare", "calculator"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold transition-colors relative ${activeTab === tab ? "text-orange-600" : "text-gray-500 hover:text-gray-700"}`}>
            {tab === "compare" ? "Compare Prices" : "Budget Calculator"}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Decision Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
        <p className="text-lg font-bold text-gray-900">{decisionSummary(city1Data, city2Data)}</p>
        {salary1 > 0 && salary2 > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Salary equivalence: {formatPrice(salary1)} in {city1Data.name} ≈ <strong className="text-emerald-700">{formatPrice(salaryEquivalent(salary1, city1Data, city2Data))}</strong> in {city2Data.name}
          </p>
        )}
      </div>

      {/* ====== COMPARE TAB ====== */}
      {activeTab === "compare" && <>
        {/* Veg Mode + Category Filters */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVegMode}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              vegMode
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
            }`}
          >
            🌱 Veg Mode {vegMode ? "ON" : "OFF"}
          </button>
          {vegMode && <span className="text-xs text-green-600">Non-veg items excluded from comparison & budget</span>}
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Filter Categories</h2>
            <div className="flex gap-2">
              <button onClick={() => setVisibleCategories(new Set(CATEGORIES))} className="text-xs text-orange-600 hover:text-orange-700 font-medium">Select All</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setVisibleCategories(new Set())} className="text-xs text-gray-500 hover:text-gray-700 font-medium">Deselect All</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <label key={cat} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${visibleCategories.has(cat) ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-gray-50 opacity-60"} hover:border-orange-400`}>
                <input type="checkbox" checked={visibleCategories.has(cat)} onChange={() => toggleCategory(cat)} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                <span className="text-lg">{CATEGORY_ICONS[cat as Category]}</span>
                <span className="text-sm font-medium text-gray-700">{cat.split(" (")[0]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Tables */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Detailed Price Comparison</h2>
              {(excludedItems.size > 0 || qtyChanges > 0) && (
                <button onClick={() => { setExcludedItems(new Set()); setQuantities({ ...DEFAULT_QUANTITIES }); }}
                  className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full font-medium transition-colors">
                  {[excludedItems.size > 0 ? `${excludedItems.size} excluded` : "", qtyChanges > 0 ? `${qtyChanges} qty changed` : ""].filter(Boolean).join(", ")} · Reset
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hidden sm:block">Uncheck to exclude from budget</p>
          </div>

          <div className="space-y-8">
            {CATEGORIES.map((category) => {
              if (!visibleCategories.has(category)) return null;
              const items1 = grouped1[category];
              const items2 = grouped2[category];
              if (!items1 || !items2) return null;

              return (
                <section key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{CATEGORY_ICONS[category as Category]}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-500">{CATEGORY_DESCRIPTIONS[category as Category]}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="w-10 px-2 sm:px-3 py-3"><span className="sr-only">Include</span></th>
                            <th className="text-left px-2 sm:px-4 py-3 text-sm font-semibold text-gray-600">Item</th>
                            <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-orange-600">{city1Data.name}</th>
                            <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-blue-600">{city2Data.name}</th>
                            <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items1.map((item1, idx) => {
                            const item2 = items2.find((i) => i.item === item1.item);
                            if (!item2) return null;
                            const qty = getQty(item1.item);
                            const p1 = getPrice(city1Data.slug, item1.item, item1.price) * qty;
                            const p2 = getPrice(city2Data.slug, item2.item, item2.price) * qty;
                            const diff = getPercentageDifference(p1, p2);
                            const excluded = excludedItems.has(item1.item);
                            return (
                              <tr key={item1.item} className={`${excluded ? "opacity-40" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-orange-50/30 transition-all`}>
                                <td className="px-2 sm:px-3 py-3 text-center">
                                  <input type="checkbox" checked={!excluded} onChange={() => toggleExcluded(item1.item)}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer" />
                                </td>
                                <td className="px-2 sm:px-4 py-3">
                                  <div className={`text-sm font-medium ${excluded ? "line-through text-gray-400" : "text-gray-900"}`}>{item1.item}</div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs text-gray-400">{item1.unit}</span>
                                    <div className="inline-flex items-center gap-0.5 ml-1">
                                      <button onClick={() => setQty(item1.item, qty - 1)} disabled={qty <= 1}
                                        className="w-7 h-7 sm:w-5 sm:h-5 flex items-center justify-center rounded text-xs sm:text-[10px] font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">−</button>
                                      <span className={`text-xs sm:text-[11px] font-semibold min-w-[20px] text-center ${qty !== (DEFAULT_QUANTITIES[item1.item] ?? 1) ? "text-orange-600" : "text-gray-500"}`}>×{qty}</span>
                                      <button onClick={() => setQty(item1.item, qty + 1)}
                                        className="w-7 h-7 sm:w-5 sm:h-5 flex items-center justify-center rounded text-xs sm:text-[10px] font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">+</button>
                                    </div>
                                  </div>
                                </td>
                                <td className={`px-4 sm:px-6 py-3 text-right ${excluded ? "line-through" : ""}`}>
                                  <EditablePrice value={p1} onChange={(val) => setPrice(city1Data.slug, item1.item, val / qty)} isEdited={isEdited(city1Data.slug, item1.item)} />
                                </td>
                                <td className={`px-4 sm:px-6 py-3 text-right ${excluded ? "line-through" : ""}`}>
                                  <EditablePrice value={p2} onChange={(val) => setPrice(city2Data.slug, item2.item, val / qty)} isEdited={isEdited(city2Data.slug, item2.item)} />
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-right">
                                  {excluded ? <span className="text-xs text-gray-300">—</span> : <DiffBadge diff={diff} />}
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
        {visibleCategories.size === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No categories selected</p>
            <p className="text-sm mt-1">Use the checkboxes above to show price categories</p>
          </div>
        )}
      </>}

      {/* ====== CALCULATOR TAB ====== */}
      {activeTab === "calculator" && <>
        {/* Lifestyle Profiles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Quick Profiles</h2>
          <p className="text-sm text-gray-500 mb-4">Auto-set accommodation, quantities, and exclusions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { key: "student" as const, icon: "🎓", label: "Student", desc: "PG double sharing, basic groceries, public transport" },
              { key: "professional" as const, icon: "💼", label: "Young Professional", desc: "1BHK centre, full groceries, car + gym" },
              { key: "family" as const, icon: "👨‍👩‍👧", label: "Family of 3-4", desc: "2BHK centre, higher quantities, no PG" },
            ]).map((p) => (
              <button key={p.key} onClick={() => applyProfile(p.key)}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50/50 text-left transition-all group">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="text-sm font-bold text-gray-900 group-hover:text-orange-700">{p.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Your Accommodation Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ACCOMMODATION_OPTIONS.map((opt) => {
              const sel = selectedAccommodation === opt.key;
              const p1 = city1Data.prices.find((p) => p.item === opt.key);
              const p2 = city2Data.prices.find((p) => p.item === opt.key);
              return (
                <label key={opt.key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${sel ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500" : "border-gray-200 hover:border-orange-300"}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="accommodation" checked={sel} onChange={() => setSelectedAccommodation(opt.key)} className="w-4 h-4 text-orange-500 accent-orange-500" />
                    <span className={`text-sm font-medium ${sel ? "text-orange-700" : "text-gray-700"}`}>{opt.label}</span>
                  </div>
                  <div className="text-right">
                    {p1 && <span className="text-xs text-gray-500 block">{formatPrice(getPrice(city1Data.slug, opt.key, p1.price) * multiplier)}</span>}
                    {p2 && <span className="text-xs text-gray-400 block">{formatPrice(getPrice(city2Data.slug, opt.key, p2.price) * multiplier)}</span>}
                    <span className="text-[10px] text-gray-400">/{viewMode === "yearly" ? "yr" : "mo"}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Budget Calculator */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">Estimated {viewMode === "yearly" ? "Yearly" : "Monthly"} Budget</h2>
              <p className="text-sm text-orange-100">Based on your accommodation + selected items</p>
            </div>
            <div className="flex items-center gap-3">
              {editCount > 0 && (
                <button onClick={resetAllPrices} className="text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-colors">
                  Reset {editCount} edit{editCount > 1 ? "s" : ""}
                </button>
              )}
              <div className="flex bg-white/15 rounded-lg p-0.5">
                <button onClick={() => setViewMode("monthly")} className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all ${viewMode === "monthly" ? "bg-white text-orange-600 shadow-sm" : "text-orange-100 hover:text-white"}`}>Monthly</button>
                <button onClick={() => setViewMode("yearly")} className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all ${viewMode === "yearly" ? "bg-white text-orange-600 shadow-sm" : "text-orange-100 hover:text-white"}`}>Yearly</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
              <div className="text-sm text-orange-100">{city1Data.name}</div>
              <div className="text-3xl font-bold">{formatPrice(budget1 * multiplier)}</div>
              <div className="text-xs text-orange-200">per {viewMode === "yearly" ? "year" : "month"}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
              <div className="text-sm text-orange-100">{city2Data.name}</div>
              <div className="text-3xl font-bold">{formatPrice(budget2 * multiplier)}</div>
              <div className="text-xs text-orange-200">per {viewMode === "yearly" ? "year" : "month"}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
              <div className="text-sm text-orange-100">Difference</div>
              <div className="text-3xl font-bold">{Math.abs(budgetDiff)}%</div>
              <div className="text-xs text-orange-200">{budgetDiff > 0 ? city2Data.name : city1Data.name} is costlier</div>
            </div>
          </div>
          <details className="group">
            <summary className="text-sm font-medium text-orange-100 cursor-pointer hover:text-white flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              Customize budget items ({budgetItems.size} selected)
            </summary>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(MONTHLY_BUDGET_ITEMS).map(([category, config]) => (
                <div key={category} className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs font-semibold text-orange-200 mb-2 uppercase tracking-wide">
                    {category.split(" (")[0]}{config.multiplier && <span className="font-normal normal-case ml-1">(×{config.multiplier} days)</span>}
                  </div>
                  {config.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 py-0.5 cursor-pointer">
                      <input type="checkbox" checked={budgetItems.has(item)} onChange={() => toggleBudgetItem(item)} className="w-3.5 h-3.5 rounded border-white/30 text-orange-300 focus:ring-orange-300 accent-orange-300" />
                      <span className="text-xs text-orange-100">{item}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Savings Calculator */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Savings Calculator</h2>
          <p className="text-sm text-gray-500 mb-5">Enter salary in each city to see disposable income</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Salary in {city1Data.name}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="text" inputMode="numeric" value={salary1 || ""} onChange={(e) => setSalary1(Number(e.target.value.replace(/[^0-9]/g, "")))}
                  placeholder="e.g. 50000" className="w-full pl-7 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/month</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Salary in {city2Data.name}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="text" inputMode="numeric" value={salary2 || ""} onChange={(e) => setSalary2(Number(e.target.value.replace(/[^0-9]/g, "")))}
                  placeholder="e.g. 60000" className="w-full pl-7 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/month</span>
              </div>
            </div>
          </div>
          {(salary1 > 0 || salary2 > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`rounded-xl px-5 py-4 text-center border ${savings1 >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-sm text-gray-500">{city1Data.name}</div>
                <div className="text-xs text-gray-400 mt-1">{formatPrice(salary1)} − {formatPrice(budget1)}</div>
                <div className={`text-2xl font-bold mt-1 ${savings1 >= 0 ? "text-green-600" : "text-red-600"}`}>{savings1 >= 0 ? "" : "−"}{formatPrice(Math.abs(savings1))}</div>
                <div className="text-xs text-gray-400">savings/month · {formatPrice(Math.abs(savings1) * 12)}/yr</div>
              </div>
              <div className={`rounded-xl px-5 py-4 text-center border ${savings2 >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-sm text-gray-500">{city2Data.name}</div>
                <div className="text-xs text-gray-400 mt-1">{formatPrice(salary2)} − {formatPrice(budget2)}</div>
                <div className={`text-2xl font-bold mt-1 ${savings2 >= 0 ? "text-green-600" : "text-red-600"}`}>{savings2 >= 0 ? "" : "−"}{formatPrice(Math.abs(savings2))}</div>
                <div className="text-xs text-gray-400">savings/month · {formatPrice(Math.abs(savings2) * 12)}/yr</div>
              </div>
              <div className="rounded-xl px-5 py-4 text-center bg-gray-50 border border-gray-200">
                <div className="text-sm text-gray-500">Better Savings</div>
                <div className="text-2xl font-bold mt-2 text-gray-900">{savings1 > savings2 ? city1Data.name : savings2 > savings1 ? city2Data.name : "Equal"}</div>
                {savings1 !== savings2 && <div className="text-xs text-gray-400 mt-1">by {formatPrice(Math.abs(savings1 - savings2))}/mo</div>}
              </div>
            </div>
          )}
        </div>

        {/* Salary Equivalence + Affordability Tiers */}
        {(salary1 > 0 || salary2 > 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Salary Equivalence</h2>
            <p className="text-sm text-gray-500 mb-4">What salary in one city equals the same lifestyle in another?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {salary1 > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500">{formatPrice(salary1)} in {city1Data.name} =</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{formatPrice(salaryEquivalent(salary1, city1Data, city2Data))}</div>
                  <div className="text-xs text-gray-500">in {city2Data.name}</div>
                </div>
              )}
              {salary2 > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500">{formatPrice(salary2)} in {city2Data.name} =</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{formatPrice(salaryEquivalent(salary2, city2Data, city1Data))}</div>
                  <div className="text-xs text-gray-500">in {city1Data.name}</div>
                </div>
              )}
            </div>

            <h3 className="text-sm font-bold text-gray-900 mb-3">Affordability Tier</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { salary: salary1, city: city1Data },
                { salary: salary2, city: city2Data },
              ].filter(({ salary }) => salary > 0).map(({ salary, city }) => {
                const tier = affordabilityTier(salary, city);
                const info = TIER_CONFIG[tier];
                return (
                  <div key={city.slug} className={`rounded-xl border p-4 ${info.bgColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${info.color}`}>{info.label}</span>
                      <span className="text-xs text-gray-500">{city.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{info.description}</p>
                    {/* Tier gauge */}
                    <div className="flex gap-1 mt-3">
                      {(["cannot_afford", "survival", "comfortable", "saving_well", "luxury"] as TierType[]).map((t) => (
                        <div key={t} className={`h-2 flex-1 rounded-full ${t === tier ? "opacity-100" : "opacity-20"} ${
                          t === "cannot_afford" ? "bg-red-400" : t === "survival" ? "bg-orange-400" : t === "comfortable" ? "bg-green-400" : t === "saving_well" ? "bg-emerald-400" : "bg-blue-400"
                        }`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Home Loan EMI Calculator */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Home Loan EMI (2BHK)</h2>
          <p className="text-sm text-gray-500 mb-4">Based on average 2BHK apartment prices in each city</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Down Payment %</label>
              <input type="number" value={loanDownPct} onChange={(e) => setLoanDownPct(Number(e.target.value))} min={0} max={90}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tenure (years)</label>
              <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} min={1} max={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Interest Rate %</label>
              <input type="number" value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value))} min={1} max={20} step={0.25}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { city: city1Data, price: propPrice1, emi: emi1 },
              { city: city2Data, price: propPrice2, emi: emi2 },
            ].map(({ city, price, emi }) => (
              <div key={city.slug} className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-bold text-gray-900 mb-2">{city.name}</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Avg 2BHK Price</span><span className="font-semibold">{formatPrice(price)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Down Payment ({loanDownPct}%)</span><span className="font-semibold">{formatPrice(Math.round(price * loanDownPct / 100))}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Loan Amount</span><span className="font-semibold">{formatPrice(Math.round(price * (1 - loanDownPct / 100)))}</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-1.5"><span className="text-gray-700 font-medium">Monthly EMI</span><span className="font-bold text-orange-600 text-sm">{formatPrice(emi.emi)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Interest</span><span className="font-semibold text-red-500">{formatPrice(emi.totalInterest)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="flex justify-center">
          <button onClick={generateShareUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            {shareCopied ? "Link Copied!" : "Share This Comparison"}
          </button>
        </div>
      </>}
    </div>
  );
}
