export default function QuickStatsBar({ cityCount }: { cityCount: number }) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{cityCount}</div>
            <div className="text-[11px] sm:text-sm text-gray-500">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">56+</div>
            <div className="text-[11px] sm:text-sm text-gray-500">Prices</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">7</div>
            <div className="text-[11px] sm:text-sm text-gray-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">2026</div>
            <div className="text-[11px] sm:text-sm text-gray-500">Updated</div>
          </div>
        </div>
      </div>
    </section>
  );
}
