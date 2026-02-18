"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/data";

interface EditablePriceProps {
  value: number;
  onChange: (val: number) => void;
  isEdited: boolean;
}

const EditablePrice = React.memo(function EditablePrice({ value, onChange, isEdited }: EditablePriceProps) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleClick = () => { setInputVal(String(value)); setEditing(true); };
  const handleBlur = () => {
    setEditing(false);
    if (inputVal === "" || inputVal === "0") { if (value !== 0) onChange(0); return; }
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed) && parsed >= 0 && parsed !== value) onChange(parsed);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
    if (e.key === "Escape") setEditing(false);
  };

  if (editing) {
    return (
      <input type="text" inputMode="decimal" value={inputVal}
        onChange={(e) => setInputVal(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus
        className="w-24 text-right text-sm font-semibold border border-orange-400 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-orange-50" />
    );
  }
  return (
    <button onClick={handleClick}
      className={`text-sm font-semibold cursor-pointer group relative transition-colors ${isEdited ? "text-orange-600" : "text-gray-900"} hover:text-orange-500`}
      title="Click to edit price">
      {formatPrice(value)}
      {isEdited ? (
        <span className="ml-1 text-[10px] text-orange-500 font-normal">(edited)</span>
      ) : (
        <svg className="inline-block w-3 h-3 ml-1 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )}
    </button>
  );
});

export default EditablePrice;
