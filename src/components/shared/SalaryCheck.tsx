"use client";

import { useState, useEffect, useMemo } from "react";
import { CityData } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { affordabilityTier, TIER_CONFIG, getEstimatedMonthlyCost, type AffordabilityTier } from "@/lib/decisions";
import { getProfileAccommodation, type ProfileKey } from "@/lib/budgetConfig";
import { trackEvent } from "@/lib/analytics";
import ProfilePills from "@/components/ui/ProfilePills";
import CentreToggle from "@/components/ui/CentreToggle";
import ItemsPopover from "@/components/ui/ItemsPopover";

export default function SalaryCheck({ cities }: { cities: CityData[] }) {
  const [salary, setSalary] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [profile, setProfile] = useState<ProfileKey>("professional");
  const [cityCentre, setCityCentre] = useState(true);

  const acc = useMemo(() => getProfileAccommodation(profile, cityCentre), [profile, cityCentre]);
  const hasCentreOption = profile !== "student";

  const city = useMemo(() => cities.find((c) => c.slug === selectedCity), [cities, selectedCity]);
  const tier = useMemo(() => city && salary > 0 ? affordabilityTier(salary, city, acc) : null, [city, salary, acc]);
  const tierInfo = tier ? TIER_CONFIG[tier] : null;
  const monthlyCost = useMemo(() => city ? getEstimatedMonthlyCost(city, acc) : 0, [city, acc]);
  const savings = salary - monthlyCost;

  useEffect(() => {
    if (tier && city && salary > 0) {
      trackEvent("salary_check", { city: city.slug, salary, profile, tier });
    }
  }, [tier, city, salary, profile]);

  const suggestions = useMemo(() => {
    if (!city || salary <= 0) return null;
    const otherCities = cities.filter((c) => c.slug !== city.slug);
    const cityTiers = otherCities.map((c) => ({
      city: c,
      tier: affordabilityTier(salary, c, acc) as AffordabilityTier,
    }));
    const tierOrder: AffordabilityTier[] = ["luxury", "saving_well", "comfortable", "survival", "cannot_afford"];
    cityTiers.sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));
    const savingWellCount = cityTiers.filter((c) => c.tier === "saving_well" || c.tier === "luxury").length;
    const comfortableCount = cityTiers.filter((c) => c.tier === "comfortable").length;
    return { top: cityTiers.slice(0, 6), savingWellCount, comfortableCount };
  }, [city, salary, acc, cities]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Can You Afford This City?</h2>
      <p className="text-xs text-gray-500 mb-4">Enter your monthly salary and pick a city for an instant answer</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
          <input type="text" inputMode="numeric" value={salary || ""}
            onChange={(e) => setSalary(Number(e.target.value.replace(/[^0-9]/g, "")))}
            placeholder="Monthly salary"
            className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white" />
        </div>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white sm:w-56">
          <option value="">Select city</option>
          {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <ProfilePills active={profile} onChange={(key) => setProfile(key)} size="sm" />
      </div>

      {hasCentreOption && (
        <div className="mb-4">
          <CentreToggle value={cityCentre} onChange={setCityCentre} />
        </div>
      )}

      {tierInfo && city && salary > 0 && (
        <div className={`rounded-xl border p-4 ${tierInfo.bgColor} transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-lg font-bold ${tierInfo.color}`}>{tierInfo.label}</span>
            <span className="text-xs text-gray-500">{city.name}</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{tierInfo.description}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-500">Salary</div>
              <div className="text-sm font-bold text-gray-900">{formatPrice(salary)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Est. Expenses</div>
              <div className="text-sm font-bold text-gray-900">{formatPrice(monthlyCost)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Savings</div>
              <div className={`text-sm font-bold ${savings >= 0 ? "text-green-600" : "text-red-600"}`}>
                {savings >= 0 ? "" : "-"}{formatPrice(Math.abs(savings))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-500">
            <span className="font-medium text-gray-600">Assumptions:</span>
            <span>🏠 {acc}</span>
            <span>·</span>
            <ItemsPopover accommodation={acc} />
            <span>·</span>
            <a href={`/calculator?city=${city.slug}&profile=${profile}&centre=${cityCentre ? "1" : "0"}`} className="text-orange-500 font-medium hover:underline">
              See full breakdown of expenses →
            </a>
          </div>

          {suggestions && (
            <div className="mt-3 pt-3 border-t border-gray-200/50">
              <div className="text-xs text-gray-600 mb-2">
                At {formatPrice(salary)}/mo, you&apos;d be <strong className="text-emerald-600">Saving Well</strong> in {suggestions.savingWellCount} cities
                {suggestions.comfortableCount > 0 && <> and <strong className="text-green-600">Comfortable</strong> in {suggestions.comfortableCount}</>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.top.map(({ city: c, tier: t }) => (
                  <a key={c.slug} href={`/cost-of-living/${c.slug}/prices`}
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${TIER_CONFIG[t].bgColor} ${TIER_CONFIG[t].color} font-medium hover:opacity-80 transition-opacity`}>
                    {c.name}: {TIER_CONFIG[t].label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
