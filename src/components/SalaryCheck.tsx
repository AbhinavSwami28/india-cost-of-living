"use client";

import { useState, useRef, useEffect } from "react";
import { CityData } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { affordabilityTier, TIER_CONFIG, getEstimatedMonthlyCost } from "@/lib/decisions";

const LIFESTYLE_PROFILES = [
  { key: "student", label: "Student", icon: "🎓", accCentre: "PG - Double Sharing (with meals)", accOutskirts: "PG - Double Sharing (with meals)" },
  { key: "professional", label: "Professional", icon: "💼", accCentre: "1 BHK in City Centre", accOutskirts: "1 BHK Outside City Centre" },
  { key: "couple", label: "Couple", icon: "💑", accCentre: "1 BHK in City Centre", accOutskirts: "1 BHK Outside City Centre" },
  { key: "family", label: "Family", icon: "👨‍👩‍👧", accCentre: "2 BHK in City Centre", accOutskirts: "2 BHK Outside City Centre" },
];

const ESTIMATE_ITEMS: Record<string, string[]> = {
  "Food & Dining": ["Veg Thali ×15", "Chai ×30", "Coffee ×10", "Street Food ×8", "Dosa ×4", "Fast Food ×2", "Water ×15"],
  "Groceries": ["Rice 5kg", "Atta 3kg", "Dal 2kg", "Milk 15L", "Eggs ×3dz", "Paneer 1kg", "Onions 3kg", "Tomatoes 3kg", "Potatoes 3kg", "Oil 2L", "Sugar 1kg", "Apples 2kg", "Bananas ×2dz", "Bread ×4"],
  "Transport": ["Metro/Train pass", "Ola/Uber ×8", "Auto ×15", "Petrol 20L"],
  "Utilities": ["Electricity", "Water", "LPG", "Broadband", "Mobile"],
  "Household": ["Maid", "Laundry", "Miscellaneous"],
  "Lifestyle": ["Gym", "Movies ×2", "Netflix", "Spotify", "Haircut", "Beer ×4"],
  "Shopping": ["Skincare", "Amazon Prime"],
};
const TOTAL_ITEMS = Object.values(ESTIMATE_ITEMS).flat().length;

export default function SalaryCheck({ cities }: { cities: CityData[] }) {
  const [salary, setSalary] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [profile, setProfile] = useState("professional");
  const [cityCentre, setCityCentre] = useState(true);
  const [showItems, setShowItems] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showItems) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowItems(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showItems]);

  const profileData = LIFESTYLE_PROFILES.find((p) => p.key === profile);
  const acc = cityCentre ? profileData?.accCentre : profileData?.accOutskirts;
  const hasCentreOption = profile !== "student";

  const city = cities.find((c) => c.slug === selectedCity);
  const tier = city && salary > 0 ? affordabilityTier(salary, city, acc) : null;
  const tierInfo = tier ? TIER_CONFIG[tier] : null;
  const monthlyCost = city ? getEstimatedMonthlyCost(city, acc) : 0;
  const savings = salary - monthlyCost;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Can You Afford This City?</h2>
      <p className="text-xs text-gray-500 mb-4">Enter your monthly salary and pick a city for an instant answer</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={salary || ""}
            onChange={(e) => setSalary(Number(e.target.value.replace(/[^0-9]/g, "")))}
            placeholder="Monthly salary"
            className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          />
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white sm:w-56"
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {LIFESTYLE_PROFILES.map((p) => (
          <button key={p.key} onClick={() => setProfile(p.key)}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
              profile === p.key
                ? "bg-orange-50 text-orange-700 border-orange-300 font-medium"
                : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
            }`}>
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {hasCentreOption && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] text-gray-500">📍</span>
          <button
            onClick={() => setCityCentre(true)}
            className={`text-[11px] px-2.5 py-1 rounded-l-full border transition-all ${
              cityCentre
                ? "bg-orange-50 text-orange-700 border-orange-300 font-medium"
                : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
            }`}
          >
            City Centre
          </button>
          <button
            onClick={() => setCityCentre(false)}
            className={`text-[11px] px-2.5 py-1 rounded-r-full border -ml-2 transition-all ${
              !cityCentre
                ? "bg-orange-50 text-orange-700 border-orange-300 font-medium"
                : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
            }`}
          >
            Away from Centre
          </button>
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
            <span className="relative" ref={popoverRef}>
              <button
                onClick={() => setShowItems(!showItems)}
                className="underline decoration-dashed underline-offset-2 cursor-pointer hover:text-orange-600 transition-colors"
              >
                {TOTAL_ITEMS} items included
              </button>
              {showItems && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold text-gray-700">Items in estimate:</div>
                    <button onClick={() => setShowItems(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-600 space-y-1.5 max-h-52 overflow-y-auto">
                    {Object.entries(ESTIMATE_ITEMS).map(([cat, items]) => (
                      <div key={cat}>
                        <div className="font-semibold text-gray-500">{cat}</div>
                        <div>{items.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </span>
            <span>·</span>
            <a href={`/calculator?city=${city.slug}&profile=${profile}&centre=${cityCentre ? "1" : "0"}`} className="text-orange-500 font-medium hover:underline">See full breakdown of expenses →</a>
          </div>
        </div>
      )}
    </div>
  );
}
