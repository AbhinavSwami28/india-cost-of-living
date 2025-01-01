import { CityData, CATEGORIES, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice, getPercentageDifference, getPricesByCategory } from "@/lib/data";

interface ComparisonTableProps {
  city1: CityData;
  city2: CityData;
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-xs text-gray-400">same</span>;

  const isPositive = diff > 0;
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
        isPositive
          ? "bg-red-50 text-red-600"
          : "bg-green-50 text-green-600"
      }`}
    >
      {isPositive ? "+" : ""}
      {diff}%
    </span>
  );
}

export default function ComparisonTable({ city1, city2 }: ComparisonTableProps) {
  const grouped1 = getPricesByCategory(city1.prices);
  const grouped2 = getPricesByCategory(city2.prices);

  return (
    <div className="space-y-8">
      {CATEGORIES.map((category) => {
        const items1 = grouped1[category];
        const items2 = grouped2[category];
        if (!items1 || !items2) return null;

        return (
          <section key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{CATEGORY_ICONS[category as Category]}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                <p className="text-sm text-gray-500">{CATEGORY_DESCRIPTIONS[category as Category]}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Responsive: horizontal scroll on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
                        Item
                      </th>
                      <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-orange-600">
                        {city1.name}
                      </th>
                      <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-blue-600">
                        {city2.name}
                      </th>
                      <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
                        Difference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items1.map((item1, idx) => {
                      const item2 = items2.find((i) => i.item === item1.item);
                      if (!item2) return null;

                      const diff = getPercentageDifference(item1.price, item2.price);

                      return (
                        <tr
                          key={item1.item}
                          className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-orange-50/30 transition-colors`}
                        >
                          <td className="px-4 sm:px-6 py-3">
                            <div className="text-sm font-medium text-gray-900">{item1.item}</div>
                            <div className="text-xs text-gray-400">{item1.unit}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(item1.price)}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(item2.price)}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-right">
                            <DiffBadge diff={diff} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
