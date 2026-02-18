"use client";

import { PROFILE_CONFIGS, type ProfileKey } from "@/lib/budgetConfig";

interface ProfilePillsProps {
  active: ProfileKey;
  onChange: (key: ProfileKey, accOverride?: string) => void;
  showCoupleVariants?: boolean;
  size?: "sm" | "md";
}

export default function ProfilePills({
  active,
  onChange,
  showCoupleVariants = false,
  size = "md",
}: ProfilePillsProps) {
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";
  const padding = size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5";

  return (
    <div className="flex flex-wrap gap-2">
      {PROFILE_CONFIGS.map((p) =>
        showCoupleVariants && p.key === "couple" ? (
          <div
            key={p.key}
            className={`inline-flex items-center gap-1.5 ${textSize} border rounded-full transition-all ${
              active === "couple"
                ? "bg-orange-50 border-orange-300"
                : "border-gray-200"
            }`}
          >
            <button
              onClick={() => onChange("couple", p.accCentre)}
              className={`pl-3 pr-1.5 ${padding} font-medium transition-colors ${
                active === "couple"
                  ? "text-orange-700"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              {p.icon} {p.label}
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => onChange("couple", p.accOutskirts)}
              className={`pr-3 pl-1.5 ${padding} text-[10px] text-gray-500 hover:text-orange-600 transition-colors`}
            >
              outskirts
            </button>
          </div>
        ) : (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={`inline-flex items-center gap-1.5 ${textSize} font-medium ${padding} rounded-full border transition-all ${
              active === p.key
                ? "bg-orange-50 text-orange-700 border-orange-300"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            <span>{p.icon}</span> {p.label}
          </button>
        )
      )}
    </div>
  );
}
