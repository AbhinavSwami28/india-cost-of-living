"use client";

import { useState } from "react";
import { CityData } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { affordabilityTier, TIER_CONFIG, getEstimatedMonthlyCost } from "@/lib/decisions";

export default function SalaryCheck({ cities }: { cities: CityData[] }) {
  const [salary, setSalary] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");

  const city = cities.find((c) => c.slug === selectedCity);
  const tier = city && salary > 0 ? affordabilityTier(salary, city) : null;
  const tierInfo = tier ? TIER_CONFIG[tier] : null;
  const monthlyCost = city ? getEstimatedMonthlyCost(city) : 0;
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
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Includes rent (1BHK), food, groceries, transport, utilities, lifestyle. <a href={`/cost-of-living/${city.slug}`} className="text-orange-500 underline">See full breakdown →</a>
          </p>
        </div>
      )}
    </div>
  );
}
