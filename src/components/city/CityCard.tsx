import Link from "next/link";
import Image from "next/image";
import { CityData } from "@/lib/types";
import { calculateCostIndex, formatPrice, getPriceByItem } from "@/lib/data";

interface CityCardProps {
  city: CityData;
}

export default function CityCard({ city }: CityCardProps) {
  const index = calculateCostIndex(city);
  const rent1bhk = getPriceByItem(city, "1 BHK in City Centre");
  const pgDouble = getPriceByItem(city, "PG - Double Sharing (with meals)");
  const thali = getPriceByItem(city, "Veg Thali (local restaurant)");

  return (
    <Link
      href={`/cost-of-living/${city.slug}/prices`}
      className="group block bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* City Image + Overlay */}
      <div className="relative h-36 bg-gradient-to-r from-orange-500 to-amber-500">
        <Image
          src={city.image}
          alt={`${city.name} landmark`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-sm">{city.name}</h3>
            <p className="text-white/80 text-sm drop-shadow-sm">{city.state}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <div className="text-[10px] text-white/80">Index</div>
            <div className="text-lg font-bold text-white leading-tight">{index}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3.5">
        <div className="space-y-2">
          {thali > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">🍽️ Veg Thali</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(thali)}</span>
            </div>
          )}
          {rent1bhk > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">🏠 1BHK Rent</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(rent1bhk)}</span>
            </div>
          )}
          {pgDouble > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">🏘️ PG Double</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(pgDouble)}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-400">{city.population}</span>
          <span className="text-xs text-orange-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 font-medium">
            View prices →
          </span>
        </div>
      </div>
    </Link>
  );
}
