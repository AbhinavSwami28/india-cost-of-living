"use client";

interface CentreToggleProps {
  value: boolean;
  onChange: (cityCentre: boolean) => void;
}

export default function CentreToggle({ value, onChange }: CentreToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-500">📍</span>
      <button
        onClick={() => onChange(true)}
        className={`text-[11px] px-2.5 py-1 rounded-l-full border transition-all ${
          value
            ? "bg-orange-50 text-orange-700 border-orange-300 font-medium"
            : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
        }`}
      >
        City Centre
      </button>
      <button
        onClick={() => onChange(false)}
        className={`text-[11px] px-2.5 py-1 rounded-r-full border -ml-2 transition-all ${
          !value
            ? "bg-orange-50 text-orange-700 border-orange-300 font-medium"
            : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"
        }`}
      >
        Away from Centre
      </button>
    </div>
  );
}
