"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, CATEGORY_ICONS, Category } from "@/lib/types";
import { formatPrice, cities } from "@/lib/data";
import { DEFAULT_QUANTITIES, getProfileExclusions, getProfileAccommodation, type ProfileKey } from "@/lib/budgetConfig";
import { trackEvent } from "@/lib/analytics";
import ProfilePills from "@/components/ui/ProfilePills";
import CategoryItemTable, { type BudgetItem } from "@/components/calculator/CategoryItemTable";

export default function BudgetCalculator() {
  const searchParams = useSearchParams();
  const [selectedBaseCity, setSelectedBaseCity] = useState("");
  const [locationName, setLocationName] = useState("");
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeProfile, setActiveProfile] = useState<ProfileKey>("professional");

  const initializeFromCity = useCallback((citySlug: string, profileKey?: ProfileKey, isCentre?: boolean) => {
    const city = cities.find((c) => c.slug === citySlug);
    if (!city) return;

    const profile = profileKey ?? "professional";
    const defaultAcc = getProfileAccommodation(profile, isCentre ?? true);
    const exclusions = getProfileExclusions(profile);

    const items: BudgetItem[] = city.prices.map((p) => {
      const qty = DEFAULT_QUANTITIES[p.item] ?? 1;
      const isVehicle = p.item.includes("EMI");
      const isPerKm = p.item.includes("per km after min");
      const isAccommodation =
        p.category === "Accommodation - Rent (Monthly)" ||
        p.category === "PG / Shared Accommodation (Monthly)";
      const isDefaultAccommodation = p.item === defaultAcc;

      let selected = isAccommodation ? isDefaultAccommodation : (!isVehicle && !isPerKm);
      if (exclusions.has(p.item)) selected = false;

      return {
        item: p.item,
        category: p.category,
        unit: p.unit,
        basePrice: p.price,
        customPrice: p.price,
        selected,
        quantity: qty,
      };
    });

    setBudgetItems(items);
    setInitialized(true);
    setLocationName(city.name);
    setActiveProfile(profile);
  // Deps are empty because imported functions (getProfileAccommodation, getProfileExclusions,
  // DEFAULT_QUANTITIES) are module-level constants — they never change between renders.
  }, []);

  const handleBaseCityChange = useCallback((slug: string) => {
    setSelectedBaseCity(slug);
    initializeFromCity(slug, activeProfile);
    trackEvent("budget_calculate", { city: slug, profile: activeProfile });
  }, [activeProfile, initializeFromCity]);

  const handleProfileChange = useCallback((profileKey: ProfileKey) => {
    setActiveProfile(profileKey);
    if (selectedBaseCity) {
      initializeFromCity(selectedBaseCity, profileKey);
    }
  }, [selectedBaseCity, initializeFromCity]);

  useEffect(() => {
    const cityParam = searchParams.get("city");
    const profileParam = searchParams.get("profile") as ProfileKey | null;
    const centreParam = searchParams.get("centre");
    if (cityParam && !initialized && cities.some((c) => c.slug === cityParam)) {
      setSelectedBaseCity(cityParam);
      if (profileParam) setActiveProfile(profileParam);
      initializeFromCity(cityParam, profileParam ?? "professional", centreParam !== "0");
    }
  }, [searchParams, initialized, initializeFromCity]);

  const toggleItem = (itemName: string) => {
    setBudgetItems((prev) =>
      prev.map((i) =>
        i.item === itemName ? { ...i, selected: !i.selected } : i
      )
    );
  };

  const updatePrice = (itemName: string, price: number) => {
    setBudgetItems((prev) =>
      prev.map((i) =>
        i.item === itemName ? { ...i, customPrice: price } : i
      )
    );
  };

  const updateQuantity = (itemName: string, qty: number) => {
    setBudgetItems((prev) =>
      prev.map((i) =>
        i.item === itemName ? { ...i, quantity: Math.max(0, qty) } : i
      )
    );
  };

  const selectAllInCategory = (category: string, value: boolean) => {
    setBudgetItems((prev) =>
      prev.map((i) =>
        i.category === category ? { ...i, selected: value } : i
      )
    );
  };

  const resetPrices = () => {
    setBudgetItems((prev) =>
      prev.map((i) => ({ ...i, customPrice: i.basePrice }))
    );
  };

  // Calculate totals
  const totalMonthly = useMemo(() => {
    return budgetItems
      .filter((i) => i.selected)
      .reduce((sum, i) => sum + i.customPrice * i.quantity, 0);
  }, [budgetItems]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    budgetItems
      .filter((i) => i.selected)
      .forEach((i) => {
        totals[i.category] = (totals[i.category] || 0) + i.customPrice * i.quantity;
      });
    return totals;
  }, [budgetItems]);

  const grouped = useMemo(() => {
    const map: Record<string, BudgetItem[]> = {};
    budgetItems.forEach((i) => {
      if (!map[i.category]) map[i.category] = [];
      map[i.category].push(i);
    });
    return map;
  }, [budgetItems]);

  const selectedCount = budgetItems.filter((i) => i.selected).length;
  const editedCount = budgetItems.filter(
    (i) => i.customPrice !== i.basePrice
  ).length;

  const displayLocation = locationName;

  return (
    <div className="space-y-6">
      {/* Step 1: Location Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Step 1: Where do you live (or plan to)?
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Pick a base city to pre-fill prices, then optionally enter your exact location
        </p>

        {/* Base city pre-fill */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Start with prices from
          </label>
          <select
            value={selectedBaseCity}
            onChange={(e) => handleBaseCityChange(e.target.value)}
            className="w-full sm:w-80 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="">Select a city to start...</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}, {city.state}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your lifestyle</label>
          <ProfilePills active={activeProfile} onChange={handleProfileChange} />
        </div>

      </div>

      {!initialized && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🏙️</div>
          <p className="text-lg font-medium">Select a base city above to get started</p>
          <p className="text-sm mt-1">
            We&apos;ll pre-fill prices which you can then edit to match your experience
          </p>
        </div>
      )}

      {initialized && (
        <>
          {/* Monthly Budget Summary - Sticky */}
          <div className="sticky top-16 z-40 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-orange-100 mb-0.5">
                  Estimated Monthly Budget{displayLocation ? ` — ${displayLocation}` : ""}
                </div>
                <div className="text-4xl font-bold">{formatPrice(totalMonthly)}</div>
                <div className="text-xs text-orange-200 mt-1">
                  {selectedCount} items selected
                  {editedCount > 0 && ` • ${editedCount} price${editedCount > 1 ? "s" : ""} edited`}
                </div>
              </div>
              <div className="flex gap-2">
                {editedCount > 0 && (
                  <button
                    onClick={resetPrices}
                    className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    Reset Prices
                  </button>
                )}
              </div>
            </div>

            {/* Category breakdown bar */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
              {CATEGORIES.map((cat) => {
                const total = categoryTotals[cat] || 0;
                if (total === 0) return null;
                return (
                  <div key={cat} className="text-xs text-orange-100 group/cat relative cursor-help">
                    <span>{CATEGORY_ICONS[cat as Category]}</span>{" "}
                    <span className="font-medium text-white">{formatPrice(total)}</span>
                    <div className="hidden group-hover/cat:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-medium rounded-md whitespace-nowrap shadow-lg z-50">
                      {cat}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select & Edit Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Step 2: Select items & edit prices
                </h2>
                <p className="text-sm text-gray-500">
                  Check items you spend on. Edit prices and quantities to match your lifestyle.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {CATEGORIES.map((category) => {
                const items = grouped[category]?.filter((i: BudgetItem) => i.basePrice > 0);
                if (!items || items.length === 0) return null;
                return (
                  <CategoryItemTable
                    key={category}
                    category={category}
                    items={items}
                    categoryTotal={categoryTotals[category] || 0}
                    onToggleItem={toggleItem}
                    onUpdatePrice={updatePrice}
                    onUpdateQuantity={updateQuantity}
                    onSelectAll={selectAllInCategory}
                  />
                );
              })}
            </div>
          </div>

          {/* Final Summary */}
          <div className="bg-white rounded-xl border-2 border-orange-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Monthly Budget Breakdown
              {displayLocation ? ` — ${displayLocation}` : ""}
            </h2>

            <div className="space-y-3 mb-6">
              {CATEGORIES.map((cat) => {
                const total = categoryTotals[cat] || 0;
                const percentage =
                  totalMonthly > 0
                    ? Math.round((total / totalMonthly) * 100)
                    : 0;

                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-lg w-8">
                      {CATEGORY_ICONS[cat as Category]}
                    </span>
                    <span className="text-sm text-gray-700 w-56 truncate">
                      {cat.split(" (")[0]}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      {formatPrice(total)}
                    </span>
                    <span className="text-xs text-gray-400 w-10 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total Monthly Expense</span>
              <span className="text-3xl font-bold text-orange-600">
                {formatPrice(totalMonthly)}
              </span>
            </div>
            <div className="mt-2 text-right text-sm text-gray-500">
              ≈ {formatPrice(totalMonthly * 12)} per year
            </div>
          </div>
        </>
      )}
    </div>
  );
}
