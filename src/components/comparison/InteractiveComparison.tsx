"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CityData, CATEGORIES, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice, getPercentageDifference, getPricesByCategory, cities } from "@/lib/data";
import { decisionSummary, salaryEquivalent, affordabilityTier, TIER_CONFIG, calculateEMI, type AffordabilityTier as TierType } from "@/lib/decisions";
import { DEFAULT_QUANTITIES, BUDGET_GROUPS, BUDGET_GROUP_ORDER, PROFILE_CONFIGS, getProfileExclusions, getProfileAccommodation, DEFAULT_BUDGET_ITEM_SET, type ProfileKey } from "@/lib/budgetConfig";
import { trackEvent } from "@/lib/analytics";
import EditablePrice from "@/components/ui/EditablePrice";
import DiffBadge from "@/components/ui/DiffBadge";
import ProfilePills from "@/components/ui/ProfilePills";
import CategoryFilter from "@/components/comparison/CategoryFilter";

const NON_VEG_ITEMS = ["Non-Veg Thali (local restaurant)", "Biryani (chicken)", "Chicken", "Eggs"];

const MAX_CITIES = 5;

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};
const gridCols = (n: number) => GRID_COLS[n] ?? GRID_COLS[5];

const CITY_COLORS = [
  { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-500", ring: "ring-orange-500" },
  { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-500", ring: "ring-blue-500" },
  { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-500", ring: "ring-emerald-500" },
  { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-500", ring: "ring-purple-500" },
  { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-500", ring: "ring-rose-500" },
];

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




export default function InteractiveComparison({ initialCity1, initialCity2 }: InteractiveComparisonProps) {
  const router = useRouter();

  const [citySlugs, setCitySlugs] = useState<string[]>([initialCity1.slug, initialCity2.slug]);
  const cityDataList = useMemo(
    () => citySlugs.map((slug) => cities.find((c) => c.slug === slug)!).filter(Boolean),
    [citySlugs]
  );

  const [activeTab, setActiveTab] = useState<"compare" | "calculator">("compare");
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const multiplier = viewMode === "yearly" ? 12 : 1;

  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set(CATEGORIES));
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [excludedItems, setExcludedItems] = useState<Set<string>>(new Set());
  const [vegMode, setVegMode] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(() => ({ ...DEFAULT_QUANTITIES }));
  const [cityAccommodations, setCityAccommodations] = useState<Record<string, string>>(() => {
    const acc: Record<string, string> = {};
    [initialCity1.slug, initialCity2.slug].forEach((s) => { acc[s] = "1 BHK Outside City Centre"; });
    return acc;
  });
  const getAccommodation = useCallback((slug: string) => cityAccommodations[slug] ?? "1 BHK Outside City Centre", [cityAccommodations]);
  const setAccommodation = useCallback((slug: string, acc: string) => setCityAccommodations((prev) => ({ ...prev, [slug]: acc })), []);
  const [budgetItems, setBudgetItems] = useState<Set<string>>(() => {
    const initial = new Set(DEFAULT_BUDGET_ITEM_SET);
    initial.add("1 BHK Outside City Centre");
    return initial;
  });
  const [salaries, setSalaries] = useState<Record<string, number>>({});
  const [activeProfile, setActiveProfile] = useState<ProfileKey>("professional");
  const [shareCopied, setShareCopied] = useState(false);
  const [showBudgetItems, setShowBudgetItems] = useState(false);
  const budgetPopoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!showBudgetItems) return;
    const handleClick = (e: MouseEvent) => {
      if (budgetPopoverRef.current && !budgetPopoverRef.current.contains(e.target as Node)) {
        setShowBudgetItems(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showBudgetItems]);

  const [loanDownPct, setLoanDownPct] = useState(20);
  const [loanTenure, setLoanTenure] = useState(20);
  const [loanRate, setLoanRate] = useState(8.75);

  const toggleCategory = useCallback((cat: string) => {
    setVisibleCategories((prev) => { const next = new Set(prev); next.has(cat) ? next.delete(cat) : next.add(cat); return next; });
  }, []);
  const toggleExcluded = useCallback((item: string) => {
    setExcludedItems((prev) => { const next = new Set(prev); next.has(item) ? next.delete(item) : next.add(item); return next; });
  }, []);
  // NON_VEG_ITEMS is a component-level constant, stable across renders
  const toggleVegMode = useCallback(() => {
    setVegMode((prev) => {
      const next = !prev;
      setExcludedItems((ex) => {
        const updated = new Set(ex);
        NON_VEG_ITEMS.forEach((item) => next ? updated.add(item) : updated.delete(item));
        return updated;
      });
      return next;
    });
  }, []);
  const toggleBudgetItem = useCallback((item: string) => {
    setBudgetItems((prev) => { const next = new Set(prev); next.has(item) ? next.delete(item) : next.add(item); return next; });
  }, []);

  const getQty = useCallback((item: string) => quantities[item] ?? 1, [quantities]);
  const setQty = useCallback((item: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [item]: Math.max(1, Math.min(99, qty)) }));
  }, []);

  const getPrice = useCallback(
    (slug: string, item: string, original: number) => customPrices[`${slug}:${item}`] ?? original,
    [customPrices]
  );
  const setPrice = useCallback((slug: string, item: string, price: number) => {
    setCustomPrices((prev) => ({ ...prev, [`${slug}:${item}`]: price }));
  }, []);
  const isEdited = useCallback((slug: string, item: string) => `${slug}:${item}` in customPrices, [customPrices]);
  const resetAllPrices = useCallback(() => setCustomPrices({}), []);
  const editCount = Object.keys(customPrices).length;

  const handleCityChange = (index: number, slug: string) => {
    trackEvent("city_compare", { city: slug, position: index });
    setCitySlugs((prev) => {
      const next = [...prev];
      next[index] = slug;
      return next;
    });
    if (citySlugs.length === 2) {
      const other = index === 0 ? citySlugs[1] : citySlugs[0];
      const newSlug = index === 0 ? slug : citySlugs[0];
      const newOther = index === 0 ? other : slug;
      if (newSlug !== newOther) {
        router.push(`/compare/${newSlug}-vs-${newOther}`, { scroll: false });
      }
    }
  };

  const addCity = () => {
    if (citySlugs.length >= MAX_CITIES) return;
    const usedSlugs = new Set(citySlugs);
    const next = cities.find((c) => !usedSlugs.has(c.slug));
    if (next) {
      setCitySlugs((prev) => [...prev, next.slug]);
      setCityAccommodations((prev) => ({ ...prev, [next.slug]: "1 BHK Outside City Centre" }));
    }
  };

  const removeCity = (index: number) => {
    if (citySlugs.length <= 2) return;
    setCitySlugs((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateMonthlyBudget = useCallback(
    (cityData: CityData) => {
      let total = 0;
      const acc = getAccommodation(cityData.slug);
      if (!excludedItems.has(acc)) {
        const accPrice = cityData.prices.find((p) => p.item === acc);
        if (accPrice) total += getPrice(cityData.slug, accPrice.item, accPrice.price);
      }
      budgetItems.forEach((itemName) => {
        if (excludedItems.has(itemName)) return;
        const priceItem = cityData.prices.find((p) => p.item === itemName);
        if (!priceItem) return;
        total += getPrice(cityData.slug, priceItem.item, priceItem.price) * (quantities[itemName] ?? 1);
      });
      return total;
    },
    [cityAccommodations, budgetItems, getPrice, excludedItems, quantities, getAccommodation]
  );

  const applyProfile = (profileKey: ProfileKey, accOverride?: string) => {
    const acc = accOverride ?? getProfileAccommodation(profileKey, true);
    const accMap: Record<string, string> = {};
    citySlugs.forEach((s) => { accMap[s] = acc; });
    setCityAccommodations(accMap);
    setExcludedItems(getProfileExclusions(profileKey));
    setQuantities({ ...DEFAULT_QUANTITIES });
    setCustomPrices({});
    setActiveProfile(profileKey);
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    citySlugs.forEach((s, i) => params.set(`c${i + 1}`, s));
    citySlugs.forEach((s, i) => params.set(`acc${i + 1}`, getAccommodation(s)));
    params.set("v", viewMode);
    citySlugs.forEach((s, i) => { if ((salaries[s] ?? 0) > 0) params.set(`s${i + 1}`, String(salaries[s])); });
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`).then(() => {
      setShareCopied(true); setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const groupedByCity = useMemo(
    () => cityDataList.map((cd) => ({ city: cd, grouped: getPricesByCategory(cd.prices) })),
    [cityDataList]
  );

  const budgets = useMemo(
    () => cityDataList.map((cd) => ({ city: cd, budget: calculateMonthlyBudget(cd) })),
    [cityDataList, calculateMonthlyBudget]
  );

  const cheapestBudget = Math.min(...budgets.map((b) => b.budget));
  const costliestBudget = Math.max(...budgets.map((b) => b.budget));
  const cheapestCity = budgets.find((b) => b.budget === cheapestBudget)?.city.name ?? "";
  const costliestCity = budgets.find((b) => b.budget === costliestBudget)?.city.name ?? "";
  const budgetSpread = cheapestBudget > 0 ? Math.round(((costliestBudget - cheapestBudget) / cheapestBudget) * 100) : 0;

  const qtyChanges = Object.entries(quantities).filter(([k, v]) => v !== (DEFAULT_QUANTITIES[k] ?? 1)).length;

  return (
    <div className="space-y-8">
      {/* City Selectors */}
      <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Cities to Compare</h2>
          {citySlugs.length < MAX_CITIES && (
            <button onClick={addCity}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add City ({citySlugs.length}/{MAX_CITIES})
            </button>
          )}
        </div>
        <div className={`grid gap-3 ${gridCols(citySlugs.length)}`}>
          {citySlugs.map((slug, index) => (
            <div key={index} className="relative">
              <label className={`block text-sm font-medium mb-1.5 ${CITY_COLORS[index].text}`}>
                City {index + 1}
              </label>
              <div className="flex gap-1">
                <select value={slug} onChange={(e) => handleCityChange(index, e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white">
                  {cities.map((city) => (
                    <option key={city.slug} value={city.slug} disabled={citySlugs.includes(city.slug) && city.slug !== slug}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
                {citySlugs.length > 2 && (
                  <button onClick={() => removeCity(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove city">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {citySlugs.length === 2 && (
          <div className="flex justify-center mt-3">
            <button onClick={() => { const [a, b] = citySlugs; setCitySlugs([b, a]); router.push(`/compare/${b}-vs-${a}`, { scroll: false }); }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Swap cities" aria-label="Swap cities">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Profile Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Who are you?</div>
          <div className="text-[11px] text-gray-400">Affects accommodation &amp; budget defaults</div>
        </div>
        <ProfilePills active={activeProfile} onChange={applyProfile} showCoupleVariants />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(["compare", "calculator"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold transition-colors relative ${activeTab === tab ? "text-orange-600" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}>
            {tab === "compare" ? "Compare Prices" : "Budget Calculator"}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Decision Banner with Assumptions */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
        {citySlugs.length === 2 ? (
          <p className="text-lg font-bold text-gray-900 dark:text-white">{decisionSummary(cityDataList[0], cityDataList[1])}</p>
        ) : (
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {cheapestCity} is the most affordable — {budgetSpread}% cheaper than {costliestCity}.
          </p>
        )}

        {/* Per-city budget breakdown with accommodation */}
        <div className={`grid gap-3 mt-4 ${gridCols(cityDataList.length)}`}>
          {cityDataList.map((cd, i) => {
            const acc = getAccommodation(cd.slug);
            const accLabel = ACCOMMODATION_OPTIONS.find((o) => o.key === acc)?.label ?? acc;
            const accPrice = cd.prices.find((p) => p.item === acc)?.price ?? 0;
            const budget = budgets[i].budget;
            const expensesExRent = budget - getPrice(cd.slug, acc, accPrice);
            return (
              <div key={cd.slug} className="bg-white/60 dark:bg-white/5 rounded-lg p-3 border border-emerald-200/50 dark:border-emerald-800/50">
                <div className={`text-sm font-bold ${CITY_COLORS[i].text} mb-1.5`}>{cd.name}</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(budget)}<span className="text-xs font-normal text-gray-500">/mo</span></div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">🏠 {accLabel}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{formatPrice(getPrice(cd.slug, acc, accPrice))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">🛒 Other expenses</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{formatPrice(expensesExRent)}</span>
                  </div>
                </div>
                {/* Accommodation selector */}
                <select
                  value={acc}
                  onChange={(e) => setAccommodation(cd.slug, e.target.value)}
                  className="mt-2 w-full text-[11px] px-2 py-1.5 border border-emerald-200 dark:border-emerald-800 rounded-md bg-white dark:bg-[#0a0a0a] text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {ACCOMMODATION_OPTIONS.map((opt) => {
                    const p = cd.prices.find((pr) => pr.item === opt.key)?.price ?? 0;
                    return (
                      <option key={opt.key} value={opt.key}>
                        {opt.label} — {formatPrice(p)}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
        </div>

        {/* Assumptions summary */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-600 dark:text-gray-300">Assumptions:</span>
          <span>Food {budgetItems.has("Veg Thali (local restaurant)") ? "×30 days" : "excluded"}</span>
          <span>·</span>
          <span className="relative" ref={budgetPopoverRef}>
            <button onClick={() => setShowBudgetItems(!showBudgetItems)} className="underline decoration-dashed underline-offset-2 cursor-pointer hover:text-emerald-600 transition-colors">{budgetItems.size} items included</button>
            {showBudgetItems && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 z-50 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Items in budget calculation:</div>
                  <button onClick={() => setShowBudgetItems(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400 space-y-0.5 max-h-52 overflow-y-auto">
                  {BUDGET_GROUP_ORDER.map((cat) => {
                    const active = (BUDGET_GROUPS[cat]?.items ?? []).filter((item) => budgetItems.has(item));
                    if (active.length === 0) return null;
                    return (
                      <div key={cat} className="mb-1.5">
                        <div className="font-semibold text-gray-500 dark:text-gray-400 mb-0.5">{cat}</div>
                        {active.map((item) => (
                          <div key={item} className={excludedItems.has(item) ? "line-through text-gray-400 dark:text-gray-600" : ""}>
                            {item}{quantities[item] && quantities[item] !== 1 ? ` ×${quantities[item]}` : ""}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[9px] text-gray-400 mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-800">+ accommodation (shown above)</div>
              </div>
            )}
          </span>
          <span>·</span>
          <span>{excludedItems.size > 0 ? `${excludedItems.size} excluded` : "nothing excluded"}</span>
          <span>·</span>
          <span>{vegMode ? "🌱 Veg only" : "Non-veg included"}</span>
          <button onClick={() => setActiveTab("calculator")} className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Customize →
          </button>
        </div>

        {citySlugs.length === 2 && (salaries[citySlugs[0]] ?? 0) > 0 && (salaries[citySlugs[1]] ?? 0) > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Salary equivalence: {formatPrice(salaries[citySlugs[0]])} in {cityDataList[0].name} ≈ <strong className="text-emerald-700 dark:text-emerald-400">{formatPrice(salaryEquivalent(salaries[citySlugs[0]], cityDataList[0], cityDataList[1]))}</strong> in {cityDataList[1].name}
          </p>
        )}
      </div>

      {/* ====== COMPARE TAB ====== */}
      {activeTab === "compare" && <>
        <CategoryFilter
          visibleCategories={visibleCategories}
          onToggle={toggleCategory}
          onSelectAll={() => setVisibleCategories(new Set(CATEGORIES))}
          onDeselectAll={() => setVisibleCategories(new Set())}
          vegMode={vegMode}
          onToggleVeg={toggleVegMode}
          nonVegCount={NON_VEG_ITEMS.length}
        />

        {/* Price Tables */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Price Comparison</h2>
              {(excludedItems.size > 0 || qtyChanges > 0) && (
                <button onClick={() => { setExcludedItems(new Set()); setQuantities({ ...DEFAULT_QUANTITIES }); }}
                  className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full font-medium transition-colors">
                  {[excludedItems.size > 0 ? `${excludedItems.size} excluded` : "", qtyChanges > 0 ? `${qtyChanges} qty changed` : ""].filter(Boolean).join(", ")} · Reset
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hidden sm:block">Uncheck to exclude from budget</p>
          </div>

          <div className="space-y-8">
            {CATEGORIES.map((category) => {
              if (!visibleCategories.has(category)) return null;
              const allGrouped = groupedByCity.map((g) => g.grouped[category]);
              if (allGrouped.some((g) => !g)) return null;

              const baseItems = allGrouped[0].filter((item) =>
                allGrouped.some((g) => (g.find((p) => p.item === item.item)?.price ?? 0) > 0)
              );
              if (baseItems.length === 0) return null;

              return (
                <section key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{CATEGORY_ICONS[category as Category]}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{CATEGORY_DESCRIPTIONS[category as Category]}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] overflow-hidden shadow-sm scroll-hint">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px]">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="w-10 px-2 sm:px-3 py-3"><span className="sr-only">Include</span></th>
                            <th className="text-left px-2 sm:px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Item</th>
                            {cityDataList.map((cd, i) => (
                              <th key={cd.slug} className={`text-right px-3 sm:px-5 py-3 text-sm font-semibold ${CITY_COLORS[i].text}`}>{cd.name}</th>
                            ))}
                            {citySlugs.length === 2 && (
                              <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Diff</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {baseItems.map((item1, idx) => {
                            const matchedItems = cityDataList.map((cd) =>
                              cd.prices.find((p) => p.item === item1.item && p.category === item1.category)
                            );
                            if (matchedItems.some((m) => !m)) return null;
                            const qty = getQty(item1.item);
                            const prices = matchedItems.map((m, ci) =>
                              getPrice(cityDataList[ci].slug, m!.item, m!.price) * qty
                            );
                            const excluded = excludedItems.has(item1.item);
                            const diff = citySlugs.length === 2 ? getPercentageDifference(prices[0], prices[1]) : 0;

                            return (
                              <tr key={item1.item} className={`${excluded ? "opacity-40" : idx % 2 === 0 ? "bg-white dark:bg-[#171717]" : "bg-gray-50/50 dark:bg-gray-800/20"} hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all`}>
                                <td className="px-2 sm:px-3 py-3 text-center">
                                  <input type="checkbox" checked={!excluded} onChange={() => toggleExcluded(item1.item)}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer" />
                                </td>
                                <td className="px-2 sm:px-4 py-3">
                                  <div className={`text-sm font-medium ${excluded ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>{item1.item}</div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs text-gray-400">{item1.unit}</span>
                                    <div className="inline-flex items-center gap-0.5 ml-1">
                                      <button onClick={() => setQty(item1.item, qty - 1)} disabled={qty <= 1}
                                        className="w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-sm sm:text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" aria-label={`Decrease ${item1.item} quantity`}>−</button>
                                      <span className={`text-xs font-semibold min-w-[22px] text-center ${qty !== (DEFAULT_QUANTITIES[item1.item] ?? 1) ? "text-orange-600" : "text-gray-500"}`}>×{qty}</span>
                                      <button onClick={() => setQty(item1.item, qty + 1)}
                                        className="w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-sm sm:text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 active:bg-gray-300 transition-colors" aria-label={`Increase ${item1.item} quantity`}>+</button>
                                    </div>
                                  </div>
                                </td>
                                {cityDataList.map((cd, ci) => (
                                  <td key={cd.slug} className={`px-3 sm:px-5 py-3 text-right ${excluded ? "line-through" : ""}`}>
                                    <EditablePrice value={prices[ci]} onChange={(val) => setPrice(cd.slug, item1.item, val / qty)} isEdited={isEdited(cd.slug, item1.item)} />
                                  </td>
                                ))}
                                {citySlugs.length === 2 && (
                                  <td className="px-4 sm:px-6 py-3 text-right">
                                    {excluded ? <span className="text-xs text-gray-300">—</span> : <DiffBadge diff={diff} />}
                                  </td>
                                )}
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
        {/* Per-City Accommodation */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Accommodation per City</h2>
          <p className="text-sm text-gray-500 mb-4">Pick different accommodation types for each city</p>
          <div className={`grid gap-4 ${gridCols(cityDataList.length)}`}>
            {cityDataList.map((cd, i) => {
              const currentAcc = getAccommodation(cd.slug);
              return (
                <div key={cd.slug} className="space-y-2">
                  <div className={`text-sm font-bold ${CITY_COLORS[i].text}`}>{cd.name}</div>
                  {ACCOMMODATION_OPTIONS.map((opt) => {
                    const sel = currentAcc === opt.key;
                    const p = cd.prices.find((pr) => pr.item === opt.key);
                    return (
                      <label key={opt.key} className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${sel ? `${CITY_COLORS[i].border} ${CITY_COLORS[i].bg} dark:bg-opacity-30 ring-1 ${CITY_COLORS[i].ring}` : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                        <div className="flex items-center gap-2">
                          <input type="radio" name={`acc-${cd.slug}`} checked={sel} onChange={() => setAccommodation(cd.slug, opt.key)} className="w-3.5 h-3.5 text-orange-500 accent-orange-500" />
                          <span className={`text-xs font-medium ${sel ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>{opt.label}</span>
                        </div>
                        {p && (
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {formatPrice(getPrice(cd.slug, opt.key, p.price) * multiplier)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
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
          <div className={`grid gap-4 mb-6 ${gridCols(budgets.length)}`}>
            {budgets.map(({ city, budget }, i) => {
              const acc = getAccommodation(city.slug);
              const accLabel = ACCOMMODATION_OPTIONS.find((o) => o.key === acc)?.label ?? acc;
              return (
                <div key={city.slug} className={`bg-white/15 backdrop-blur-sm rounded-xl px-4 py-4 text-center ${budget === cheapestBudget && budgets.length > 2 ? "ring-2 ring-white/50" : ""}`}>
                  <div className="text-sm text-orange-100">{city.name}</div>
                  <div className="text-2xl sm:text-3xl font-bold">{formatPrice(budget * multiplier)}</div>
                  <div className="text-xs text-orange-200">per {viewMode === "yearly" ? "year" : "month"}</div>
                  <div className="text-[10px] text-orange-200/70 mt-1">🏠 {accLabel}</div>
                  {budget === cheapestBudget && budgets.length > 2 && (
                    <div className="text-[10px] font-semibold text-green-200 mt-0.5">CHEAPEST</div>
                  )}
                </div>
              );
            })}
          </div>
          <details className="group">
            <summary className="text-sm font-medium text-orange-100 cursor-pointer hover:text-white flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              Customize budget items ({budgetItems.size} selected)
            </summary>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BUDGET_GROUP_ORDER.map((group) => {
                const config = BUDGET_GROUPS[group];
                if (!config) return null;
                return (
                  <div key={group} className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs font-semibold text-orange-200 mb-2 uppercase tracking-wide">
                      {group}
                    </div>
                    {config.items.map((item) => (
                      <label key={item} className="flex items-center gap-2 py-0.5 cursor-pointer">
                        <input type="checkbox" checked={budgetItems.has(item)} onChange={() => toggleBudgetItem(item)} className="w-3.5 h-3.5 rounded border-white/30 text-orange-300 focus:ring-orange-300 accent-orange-300" />
                        <span className="text-xs text-orange-100">{item}{DEFAULT_QUANTITIES[item] > 1 ? ` ×${DEFAULT_QUANTITIES[item]}` : ""}</span>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>
          </details>
        </div>

        {/* Savings Calculator */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Savings Calculator</h2>
          <p className="text-sm text-gray-500 mb-5">Enter salary in each city to see disposable income</p>
          <div className={`grid gap-4 mb-6 ${gridCols(cityDataList.length)}`}>
            {cityDataList.map((cd) => (
              <div key={cd.slug}>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Salary in {cd.name}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input type="text" inputMode="numeric" value={salaries[cd.slug] || ""} onChange={(e) => setSalaries((prev) => ({ ...prev, [cd.slug]: Number(e.target.value.replace(/[^0-9]/g, "")) }))}
                    placeholder="e.g. 50000" className="w-full pl-7 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/mo</span>
                </div>
              </div>
            ))}
          </div>
          {cityDataList.some((cd) => (salaries[cd.slug] ?? 0) > 0) && (
            <div className={`grid gap-4 ${gridCols(cityDataList.length)}`}>
              {cityDataList.map((cd, i) => {
                const salary = salaries[cd.slug] ?? 0;
                const budget = budgets[i].budget;
                const savings = salary - budget;
                return (
                  <div key={cd.slug} className={`rounded-xl px-4 py-4 text-center border ${savings >= 0 ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"}`}>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{cd.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatPrice(salary)} − {formatPrice(budget)}</div>
                    <div className={`text-xl font-bold mt-1 ${savings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{savings >= 0 ? "" : "−"}{formatPrice(Math.abs(savings))}</div>
                    <div className="text-xs text-gray-400">savings/mo · {formatPrice(Math.abs(savings) * 12)}/yr</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Salary Equivalence + Affordability Tiers */}
        {citySlugs.length === 2 && ((salaries[citySlugs[0]] ?? 0) > 0 || (salaries[citySlugs[1]] ?? 0) > 0) && (
          <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Salary Equivalence</h2>
            <p className="text-sm text-gray-500 mb-4">What salary in one city equals the same lifestyle in another?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {(salaries[citySlugs[0]] ?? 0) > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500">{formatPrice(salaries[citySlugs[0]])} in {cityDataList[0].name} =</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPrice(salaryEquivalent(salaries[citySlugs[0]], cityDataList[0], cityDataList[1]))}</div>
                  <div className="text-xs text-gray-500">in {cityDataList[1].name}</div>
                </div>
              )}
              {(salaries[citySlugs[1]] ?? 0) > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500">{formatPrice(salaries[citySlugs[1]])} in {cityDataList[1].name} =</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPrice(salaryEquivalent(salaries[citySlugs[1]], cityDataList[1], cityDataList[0]))}</div>
                  <div className="text-xs text-gray-500">in {cityDataList[0].name}</div>
                </div>
              )}
            </div>

            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Affordability Tier</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cityDataList.filter((cd) => (salaries[cd.slug] ?? 0) > 0).map((cd) => {
                const tier = affordabilityTier(salaries[cd.slug], cd);
                const info = TIER_CONFIG[tier];
                return (
                  <div key={cd.slug} className={`rounded-xl border p-4 ${info.bgColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${info.color}`}>{info.label}</span>
                      <span className="text-xs text-gray-500">{cd.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{info.description}</p>
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
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Home Loan EMI (2BHK)</h2>
          <p className="text-sm text-gray-500 mb-4">Based on average 2BHK apartment prices in each city</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Down Payment %</label>
              <input type="number" value={loanDownPct} onChange={(e) => setLoanDownPct(Number(e.target.value))} min={0} max={90}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tenure (years)</label>
              <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} min={1} max={30}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Interest Rate %</label>
              <input type="number" value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value))} min={1} max={20} step={0.25}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
            </div>
          </div>
          <div className={`grid gap-4 ${gridCols(cityDataList.length)}`}>
            {cityDataList.map((cd) => {
              const avgProp = cd.prices.find((p) => p.item === "Home Loan EMI (2BHK avg)")?.price ?? 0;
              const propPrice = Math.round(avgProp * 240 / 1.8);
              const emi = calculateEMI(propPrice * (1 - loanDownPct / 100), loanRate, loanTenure);
              return (
                <div key={cd.slug} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">{cd.name}</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Avg 2BHK Price</span><span className="font-semibold dark:text-gray-300">{formatPrice(propPrice)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Down Payment ({loanDownPct}%)</span><span className="font-semibold dark:text-gray-300">{formatPrice(Math.round(propPrice * loanDownPct / 100))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Loan Amount</span><span className="font-semibold dark:text-gray-300">{formatPrice(Math.round(propPrice * (1 - loanDownPct / 100)))}</span></div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-1.5"><span className="text-gray-700 dark:text-gray-300 font-medium">Monthly EMI</span><span className="font-bold text-orange-600 text-sm">{formatPrice(emi.emi)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Interest</span><span className="font-semibold text-red-500">{formatPrice(emi.totalInterest)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share */}
        <div className="flex justify-center">
          <button onClick={generateShareUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            {shareCopied ? "Link Copied!" : "Share This Comparison"}
          </button>
        </div>
      </>}
    </div>
  );
}
