import React from "react";

const DiffBadge = React.memo(function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-xs text-gray-400">same</span>;
  const isPositive = diff > 0;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
      {isPositive ? "+" : ""}{diff}%
    </span>
  );
});

export default DiffBadge;
