"use client";

import { useState, useRef, useEffect } from "react";
import { BUDGET_ITEMS, BUDGET_GROUP_ORDER, BUDGET_GROUPS, DEFAULT_QUANTITIES } from "@/lib/budgetConfig";

const TOTAL_ITEMS = BUDGET_ITEMS.filter((b) => !b.isOptional).length;

interface ItemsPopoverProps {
  accommodation?: string;
}

export default function ItemsPopover({ accommodation }: ItemsPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <span className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="underline decoration-dashed underline-offset-2 cursor-pointer hover:text-orange-600 transition-colors"
      >
        {TOTAL_ITEMS} items included
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-semibold text-gray-700">Items in estimate:</div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-[10px] text-gray-600 space-y-1.5 max-h-52 overflow-y-auto">
            {BUDGET_GROUP_ORDER.map((group) => {
              const items = BUDGET_GROUPS[group]?.items.filter(
                (item) => !BUDGET_ITEMS.find((b) => b.item === item)?.isOptional
              );
              if (!items || items.length === 0) return null;
              return (
                <div key={group}>
                  <div className="font-semibold text-gray-500">{group}</div>
                  <div>
                    {items.map((item) => {
                      const qty = DEFAULT_QUANTITIES[item];
                      return `${item}${qty > 1 ? ` ×${qty}` : ""}`;
                    }).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
          {accommodation && (
            <div className="text-[9px] text-gray-400 mt-2 pt-1.5 border-t border-gray-100">
              + {accommodation}
            </div>
          )}
        </div>
      )}
    </span>
  );
}
