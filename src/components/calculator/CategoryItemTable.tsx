import { CATEGORY_ICONS, CATEGORY_DESCRIPTIONS, Category } from "@/lib/types";
import { formatPrice } from "@/lib/data";

export interface BudgetItem {
  item: string;
  category: string;
  unit: string;
  basePrice: number;
  customPrice: number;
  selected: boolean;
  quantity: number;
}

interface CategoryItemTableProps {
  category: string;
  items: BudgetItem[];
  categoryTotal: number;
  onToggleItem: (itemName: string) => void;
  onUpdatePrice: (itemName: string, price: number) => void;
  onUpdateQuantity: (itemName: string, qty: number) => void;
  onSelectAll: (category: string, value: boolean) => void;
}

export default function CategoryItemTable({
  category, items, categoryTotal,
  onToggleItem, onUpdatePrice, onUpdateQuantity, onSelectAll,
}: CategoryItemTableProps) {
  const allSelected = items.every((i) => i.selected);
  const noneSelected = items.every((i) => !i.selected);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{CATEGORY_ICONS[category as Category]}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{category}</h3>
            <p className="text-xs text-gray-500">{CATEGORY_DESCRIPTIONS[category as Category]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">{formatPrice(categoryTotal)}/mo</span>
          <button
            onClick={() => onSelectAll(category, noneSelected || !allSelected)}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1 rounded hover:bg-orange-50"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 px-3 py-2.5"></th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Item</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-28">Price (₹)</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-24">Qty/mo</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-28">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const monthly = item.selected ? item.customPrice * item.quantity : 0;
                const priceEdited = item.customPrice !== item.basePrice;

                return (
                  <tr key={item.item}
                    className={`${!item.selected ? "opacity-40" : ""} ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-orange-50/30 transition-all`}>
                    <td className="px-3 py-2.5 text-center">
                      <input type="checkbox" checked={item.selected} onChange={() => onToggleItem(item.item)}
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-sm font-medium text-gray-900">{item.item}</div>
                      <div className="text-xs text-gray-400">{item.unit}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-gray-400">₹</span>
                        <input type="text" inputMode="decimal" value={item.customPrice}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "" || raw === "0") { onUpdatePrice(item.item, 0); return; }
                            const val = parseFloat(raw);
                            if (!isNaN(val) && val >= 0) onUpdatePrice(item.item, val);
                          }}
                          onFocus={(e) => { if (item.customPrice === 0) e.target.select(); }}
                          className={`w-20 text-right text-sm font-semibold border rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                            priceEdited ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-900"
                          }`}
                          disabled={!item.selected} />
                      </div>
                      {priceEdited && (
                        <div className="text-right mt-0.5">
                          <button onClick={() => onUpdatePrice(item.item, item.basePrice)}
                            className="text-[10px] text-orange-500 hover:text-orange-700">
                            reset to {formatPrice(item.basePrice)}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <input type="text" inputMode="numeric" value={item.quantity}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "" || raw === "0") { onUpdateQuantity(item.item, 0); return; }
                          const val = parseInt(raw);
                          if (!isNaN(val) && val >= 0) onUpdateQuantity(item.item, val);
                        }}
                        onFocus={(e) => { if (item.quantity === 0) e.target.select(); }}
                        className="w-16 mx-auto block text-center text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                        disabled={!item.selected} />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-sm font-semibold ${item.selected ? "text-gray-900" : "text-gray-300"}`}>
                        {formatPrice(monthly)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-orange-50 border-t border-orange-200">
                <td colSpan={4} className="px-3 py-2.5 text-right">
                  <span className="text-sm font-semibold text-orange-700">{category.split(" (")[0]} Total</span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className="text-sm font-bold text-orange-700">{formatPrice(categoryTotal)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
