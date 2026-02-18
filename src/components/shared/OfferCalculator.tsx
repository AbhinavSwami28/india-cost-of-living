"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cities, formatPrice } from "@/lib/data";
import { salaryEquivalent, affordabilityTier, TIER_CONFIG, getEstimatedMonthlyCost } from "@/lib/decisions";
import { getProfileAccommodation, type ProfileKey } from "@/lib/budgetConfig";
import { trackEvent } from "@/lib/analytics";
import ProfilePills from "@/components/ui/ProfilePills";

export default function OfferCalculator() {
  const [currentCity, setCurrentCity] = useState("");
  const [currentSalary, setCurrentSalary] = useState(0);
  const [currentEMI, setCurrentEMI] = useState(0);
  const [newCity, setNewCity] = useState("");
  const [newSalary, setNewSalary] = useState(0);
  const [profile, setProfile] = useState<ProfileKey>("professional");

  const acc = useMemo(() => getProfileAccommodation(profile, true), [profile]);

  const city1 = useMemo(() => cities.find((c) => c.slug === currentCity), [currentCity]);
  const city2 = useMemo(() => cities.find((c) => c.slug === newCity), [newCity]);

  const hasInput = city1 && city2 && currentSalary > 0 && newSalary > 0;

  const { cost1, cost2, savings1, savings2, diff, equivSalary, tier1, tier2 } = useMemo(() => {
    const c1 = city1 ? getEstimatedMonthlyCost(city1, acc) + currentEMI : 0;
    const c2 = city2 ? getEstimatedMonthlyCost(city2, acc) + currentEMI : 0;
    return {
      cost1: c1,
      cost2: c2,
      savings1: currentSalary - c1,
      savings2: newSalary - c2,
      diff: (newSalary - c2) - (currentSalary - c1),
      equivSalary: city1 && city2 ? salaryEquivalent(currentSalary, city1, city2, acc) : 0,
      tier1: city1 && currentSalary > 0 ? affordabilityTier(currentSalary - currentEMI, city1, acc) : null,
      tier2: city2 && newSalary > 0 ? affordabilityTier(newSalary - currentEMI, city2, acc) : null,
    };
  }, [city1, city2, currentSalary, newSalary, currentEMI, acc]);

  const verdict = !hasInput ? null
    : diff > 5000 ? "yes" as const
    : diff > 0 ? "maybe" as const
    : diff > -3000 ? "neutral" as const
    : "no" as const;

  useEffect(() => {
    if (verdict && city1 && city2) {
      trackEvent("offer_evaluate", { from_city: city1.slug, to_city: city2.slug, verdict });
    }
  }, [verdict, city1, city2]);

  return (
    <div className="space-y-6">
      {/* Current Situation */}
      <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your Current Situation</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Where you are now</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
            <select value={currentCity} onChange={(e) => setCurrentCity(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white">
              <option value="">Select city</option>
              {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly In-Hand Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input type="text" inputMode="numeric" value={currentSalary || ""} onChange={(e) => setCurrentSalary(Number(e.target.value.replace(/[^0-9]/g, "")))}
                placeholder="e.g. 50000" className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Existing EMIs (total)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input type="text" inputMode="numeric" value={currentEMI || ""} onChange={(e) => setCurrentEMI(Number(e.target.value.replace(/[^0-9]/g, "")))}
                placeholder="e.g. 15000" className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* New Offer */}
      <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">The New Offer</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">What they&apos;re offering you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">New City</label>
            <select value={newCity} onChange={(e) => setNewCity(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white">
              <option value="">Select city</option>
              {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Offered Monthly In-Hand</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input type="text" inputMode="numeric" value={newSalary || ""} onChange={(e) => setNewSalary(Number(e.target.value.replace(/[^0-9]/g, "")))}
                placeholder="e.g. 70000" className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white dark:bg-[#0a0a0a] dark:text-white" />
            </div>
          </div>
        </div>
        {city1 && city2 && currentSalary > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            To match your {city1.name} lifestyle, you need at least <strong className="text-gray-900">{formatPrice(equivSalary)}</strong> in {city2.name}
          </p>
        )}
      </div>

      {/* Lifestyle Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Your Lifestyle</h2>
            <p className="text-xs text-gray-500">Affects rent estimation in both cities</p>
          </div>
          <span className="text-xs text-gray-400">{acc}</span>
        </div>
        <ProfilePills active={profile} onChange={(key) => setProfile(key)} />
      </div>

      {/* Verdict */}
      {hasInput && verdict && (
        <div className={`rounded-xl border-2 p-6 text-center ${
          verdict === "yes" ? "border-green-400 bg-green-50" :
          verdict === "maybe" ? "border-emerald-300 bg-emerald-50" :
          verdict === "neutral" ? "border-yellow-300 bg-yellow-50" :
          "border-red-300 bg-red-50"
        }`}>
          <div className={`text-3xl sm:text-4xl font-black mb-2 ${
            verdict === "yes" ? "text-green-600" :
            verdict === "maybe" ? "text-emerald-600" :
            verdict === "neutral" ? "text-yellow-600" :
            "text-red-600"
          }`}>
            {verdict === "yes" ? "✓ YES, Take It!" :
             verdict === "maybe" ? "↗ Slightly Better" :
             verdict === "neutral" ? "≈ About the Same" :
             "✗ Think Twice"}
          </div>
          <p className="text-gray-700 text-sm mb-4">
            {diff > 0
              ? `You'll save ${formatPrice(diff)} more per month in ${city2!.name}. That's ${formatPrice(diff * 12)} extra per year.`
              : diff < 0
                ? `You'll save ${formatPrice(Math.abs(diff))} less per month in ${city2!.name}. That's ${formatPrice(Math.abs(diff) * 12)} less per year.`
                : "Your savings will be roughly the same in both cities."}
          </p>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-left">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Current: {city1!.name}</div>
              <div className="text-xs space-y-0.5">
                <div className="flex justify-between"><span>Salary</span><span className="font-semibold">{formatPrice(currentSalary)}</span></div>
                <div className="flex justify-between"><span>Expenses</span><span>{formatPrice(cost1)}</span></div>
                <div className="flex justify-between border-t pt-0.5 mt-0.5"><span className="font-medium">Savings</span><span className={`font-bold ${savings1 >= 0 ? "text-green-600" : "text-red-600"}`}>{formatPrice(savings1)}</span></div>
              </div>
              {tier1 && <div className={`text-[10px] font-bold mt-1 ${TIER_CONFIG[tier1].color}`}>{TIER_CONFIG[tier1].label}</div>}
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">New: {city2!.name}</div>
              <div className="text-xs space-y-0.5">
                <div className="flex justify-between"><span>Salary</span><span className="font-semibold">{formatPrice(newSalary)}</span></div>
                <div className="flex justify-between"><span>Expenses</span><span>{formatPrice(cost2)}</span></div>
                <div className="flex justify-between border-t pt-0.5 mt-0.5"><span className="font-medium">Savings</span><span className={`font-bold ${savings2 >= 0 ? "text-green-600" : "text-red-600"}`}>{formatPrice(savings2)}</span></div>
              </div>
              {tier2 && <div className={`text-[10px] font-bold mt-1 ${TIER_CONFIG[tier2].color}`}>{TIER_CONFIG[tier2].label}</div>}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {city1 && city2 && (
              <Link href={`/compare/${city1.slug}-vs-${city2.slug}`}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium underline">
                See detailed price comparison →
              </Link>
            )}
          </div>
        </div>
      )}

      {!hasInput && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-3">🤔</div>
          <p className="text-sm mb-3">Fill in both sections above to get your verdict</p>
          <p className="text-xs text-gray-300">Example: ₹50,000/month in Pune → offered ₹75,000 in Bangalore</p>
        </div>
      )}
    </div>
  );
}
