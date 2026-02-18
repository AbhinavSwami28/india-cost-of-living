import { PriceItem, CATEGORIES, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice, getPricesByCategory } from "@/lib/data";

interface PriceTableProps {
  prices: PriceItem[];
  cityName: string;
}

export default function PriceTable({ prices, cityName }: PriceTableProps) {
  const grouped = getPricesByCategory(prices);

  return (
    <div className="space-y-8">
      {CATEGORIES.map((category) => {
        const items = grouped[category]?.filter((item) => item.price > 0);
        if (!items || items.length === 0) return null;

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
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
                      Item
                    </th>
                    <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
                      {cityName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item.item}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-orange-50/50 transition-colors`}
                    >
                      <td className="px-4 sm:px-6 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.item}</div>
                        <div className="text-xs text-gray-400">{item.unit}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
