"use client";

import { useState, useCallback, useMemo } from "react";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice, cities } from "@/lib/data";
import { getStates, getDistricts, getCities as getGeoCities } from "@/lib/geography";

// Which items make sense as "monthly" expenses
const MONTHLY_ITEMS = new Set([
  "Metro / Local Train (monthly pass)",
  "Bus (monthly pass)",
  "Electricity (2BHK, avg usage)",
  "Water Bill",
  "Broadband Internet (100 Mbps)",
  "Mobile Plan (Jio/Airtel, 2GB/day)",
  "1 BHK in City Centre",
  "1 BHK Outside City Centre",
  "2 BHK in City Centre",
  "2 BHK Outside City Centre",
  "3 BHK in City Centre",
  "3 BHK Outside City Centre",
  "PG - Private Room (with meals)",
  "PG - Private Room (without meals)",
  "PG - Double Sharing (with meals)",
  "PG - Double Sharing (without meals)",
  "PG - Triple Sharing (with meals)",
  "PG - Triple Sharing (without meals)",
  "Gym Membership",
  "Netflix (Standard Plan)",
  "Spotify Premium",
]);

// Items that are daily (multiply by 30 for monthly)
const DAILY_ITEMS = new Set([
  "Veg Thali (local restaurant)",
  "Non-Veg Thali (local restaurant)",
  "Chai (regular cup)",
  "Coffee (Cappuccino)",
  "Bottled Water (1 litre)",
  "Milk (Full Cream)",
]);

// One-time / per-use items (user decides qty per month)
const QUANTITY_ITEMS = new Set([
  "Meal for Two (high-end restaurant)",
  "Street Food (Vada Pav / Samosa)",
  "Biryani (chicken)",
  "Dosa (plain)",
  "Fast Food Combo (McDonald's)",
  "Soft Drink (Coca-Cola, 300ml)",
  "Cooking Gas (LPG Cylinder)",
  "Movie Ticket (Multiplex)",
  "Haircut (Men, basic salon)",
  "Domestic Beer (pint, restaurant)",
  "Imported Beer (bottle, restaurant)",
]);

interface BudgetItem {
  item: string;
  category: string;
  unit: string;
  basePrice: number;
  customPrice: number;
  selected: boolean;
  quantity: number; // monthly quantity
}

export default function BudgetCalculator() {
  // Location
  const [selectedBaseCity, setSelectedBaseCity] = useState("");
  const [userState, setUserState] = useState("");
  const [userDistrict, setUserDistrict] = useState("");
  const [userCity, setUserCity] = useState("");
  const [locationName, setLocationName] = useState("");

  // Budget items
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  const states = useMemo(() => getStates(), []);
  const districts = useMemo(() => (userState ? getDistricts(userState) : []), [userState]);
  const geoCities = useMemo(
    () => (userState && userDistrict ? getGeoCities(userState, userDistrict) : []),
    [userState, userDistrict]
  );

  // Initialize budget items from a base city
  const initializeFromCity = useCallback((citySlug: string) => {
    const city = cities.find((c) => c.slug === citySlug);
    if (!city) return;

    const items: BudgetItem[] = city.prices.map((p) => {
      let qty = 1;
      if (DAILY_ITEMS.has(p.item)) qty = 30;
      else if (QUANTITY_ITEMS.has(p.item)) qty = 2;
      else if (MONTHLY_ITEMS.has(p.item)) qty = 1;

      // Skip vehicle prices by default
      const isVehicle = p.item.includes("Honda") || p.item.includes("Maruti");
      // Skip per-km items
      const isPerKm =
        p.item.includes("per km") || p.item === "Ola/Uber Mini (per km)";

      return {
        item: p.item,
        category: p.category,
        unit: p.unit,
        basePrice: p.price,
        customPrice: p.price,
        selected: !isVehicle && !isPerKm,
        quantity: qty,
      };
    });

    setBudgetItems(items);
    setInitialized(true);
    setLocationName(city.name);
  }, []);

  const handleBaseCityChange = (slug: string) => {
    setSelectedBaseCity(slug);
    initializeFromCity(slug);
  };

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

  const displayLocation = userCity || userDistrict || userState || locationName;

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

        {/* Your location */}
        {initialized && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Your actual location (optional — for your reference)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">State</label>
                <select
                  value={userState}
                  onChange={(e) => {
                    setUserState(e.target.value);
                    setUserDistrict("");
                    setUserCity("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="">Select state...</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">District</label>
                <select
                  value={userDistrict}
                  onChange={(e) => {
                    setUserDistrict(e.target.value);
                    setUserCity("");
                  }}
                  disabled={!userState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Select district...</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">City / Area</label>
                <select
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  disabled={!userDistrict}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Select city...</option>
                  {geoCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
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
                  <div key={cat} className="text-xs text-orange-100">
                    <span>{CATEGORY_ICONS[cat as Category]}</span>{" "}
                    <span className="font-medium text-white">{formatPrice(total)}</span>
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
                const items = grouped[category];
                if (!items || items.length === 0) return null;

                const allSelected = items.every((i) => i.selected);
                const noneSelected = items.every((i) => !i.selected);
                const catTotal = categoryTotals[category] || 0;

                return (
                  <section key={category}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {CATEGORY_ICONS[category as Category]}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                          <p className="text-xs text-gray-500">
                            {CATEGORY_DESCRIPTIONS[category as Category]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700">
                          {formatPrice(catTotal)}/mo
                        </span>
                        <button
                          onClick={() =>
                            selectAllInCategory(
                              category,
                              noneSelected || !allSelected
                            )
                          }
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1 rounded hover:bg-orange-50"
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="w-10 px-3 py-2.5"></th>
                              <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">
                                Item
                              </th>
                              <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-28">
                                Price (₹)
                              </th>
                              <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-24">
                                Qty/mo
                              </th>
                              <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-28">
                                Monthly
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, idx) => {
                              const monthly = item.selected
                                ? item.customPrice * item.quantity
                                : 0;
                              const priceEdited =
                                item.customPrice !== item.basePrice;

                              return (
                                <tr
                                  key={item.item}
                                  className={`${
                                    !item.selected ? "opacity-40" : ""
                                  } ${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                  } hover:bg-orange-50/30 transition-all`}
                                >
                                  {/* Checkbox */}
                                  <td className="px-3 py-2.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={item.selected}
                                      onChange={() => toggleItem(item.item)}
                                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                                    />
                                  </td>

                                  {/* Item name */}
                                  <td className="px-3 py-2.5">
                                    <div className="text-sm font-medium text-gray-900">
                                      {item.item}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {item.unit}
                                    </div>
                                  </td>

                                  {/* Editable Price */}
                                  <td className="px-3 py-2.5">
                                    <div className="flex items-center justify-end gap-1">
                                      <span className="text-xs text-gray-400">₹</span>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={item.customPrice}
                                        onChange={(e) => {
                                          const raw = e.target.value;
                                          if (raw === "" || raw === "0") {
                                            updatePrice(item.item, 0);
                                            return;
                                          }
                                          const val = parseFloat(raw);
                                          if (!isNaN(val) && val >= 0) {
                                            updatePrice(item.item, val);
                                          }
                                        }}
                                        onFocus={(e) => {
                                          if (item.customPrice === 0) e.target.select();
                                        }}
                                        className={`w-20 text-right text-sm font-semibold border rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                                          priceEdited
                                            ? "border-orange-400 bg-orange-50 text-orange-700"
                                            : "border-gray-200 bg-white text-gray-900"
                                        }`}
                                        disabled={!item.selected}
                                      />
                                    </div>
                                    {priceEdited && (
                                      <div className="text-right mt-0.5">
                                        <button
                                          onClick={() =>
                                            updatePrice(
                                              item.item,
                                              item.basePrice
                                            )
                                          }
                                          className="text-[10px] text-orange-500 hover:text-orange-700"
                                        >
                                          reset to {formatPrice(item.basePrice)}
                                        </button>
                                      </div>
                                    )}
                                  </td>

                                  {/* Quantity */}
                                  <td className="px-3 py-2.5">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={item.quantity}
                                      onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === "" || raw === "0") {
                                          updateQuantity(item.item, 0);
                                          return;
                                        }
                                        const val = parseInt(raw);
                                        if (!isNaN(val) && val >= 0) {
                                          updateQuantity(item.item, val);
                                        }
                                      }}
                                      onFocus={(e) => {
                                        if (item.quantity === 0) e.target.select();
                                      }}
                                      className="w-16 mx-auto block text-center text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                                      disabled={!item.selected}
                                    />
                                  </td>

                                  {/* Monthly total */}
                                  <td className="px-3 py-2.5 text-right">
                                    <span
                                      className={`text-sm font-semibold ${
                                        item.selected
                                          ? "text-gray-900"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      {formatPrice(monthly)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          {/* Category total */}
                          <tfoot>
                            <tr className="bg-orange-50 border-t border-orange-200">
                              <td colSpan={4} className="px-3 py-2.5 text-right">
                                <span className="text-sm font-semibold text-orange-700">
                                  {category.split(" (")[0]} Total
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                <span className="text-sm font-bold text-orange-700">
                                  {formatPrice(catTotal)}
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </section>
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
