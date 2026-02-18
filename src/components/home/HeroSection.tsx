import Link from "next/link";

export default function HeroSection({ cityCount }: { cityCount: number }) {
  return (
    <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Cost of Living in India
          </h1>
          <p className="text-base sm:text-xl text-orange-100 mb-6 sm:mb-8 leading-relaxed">
            Compare prices across {cityCount} major Indian cities. From PG
            double sharing to 3BHK rent, chai to biryani — find out what life really costs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/offer"
              className="bg-white text-orange-600 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm sm:text-base"
            >
              Should I Take This Offer?
            </Link>
            <Link
              href="/compare"
              className="bg-orange-700/50 backdrop-blur-sm text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-orange-700/70 transition-colors border border-orange-400/30 text-sm sm:text-base"
            >
              Compare Cities
            </Link>
            <Link
              href="#cities"
              className="text-white/80 hover:text-white px-3 py-2.5 text-sm sm:text-base font-medium transition-colors"
            >
              Explore Cities ↓
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
