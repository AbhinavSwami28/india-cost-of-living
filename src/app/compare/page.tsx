import { Metadata } from "next";
import { cities } from "@/lib/data";
import Link from "next/link";
import InteractiveComparison from "@/components/InteractiveComparison";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Compare Cost of Living Between Indian Cities",
  description:
    "Interactive side-by-side comparison of cost of living between Indian cities. Edit prices, filter categories, choose your accommodation type, and calculate your monthly budget.",
};

export default function ComparePage() {
  const defaultCity1 = cities[0]; // Mumbai
  const defaultCity2 = cities[2]; // Bangalore

  return (
    <div>
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Compare Cost of Living
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl mb-2">
            Select two cities, filter categories, edit prices to match your experience,
            and calculate your estimated monthly budget.
          </p>
          <p className="text-sm text-orange-200">
            Click any price in the table to override it with your own number.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InteractiveComparison initialCity1={defaultCity1} initialCity2={defaultCity2} />

        <AdBanner adFormat="horizontal" className="mt-8" />

        {/* Popular comparison links for SEO */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ["mumbai", "bangalore"],
              ["mumbai", "delhi"],
              ["bangalore", "hyderabad"],
              ["mumbai", "pune"],
              ["delhi", "bangalore"],
              ["chennai", "bangalore"],
              ["hyderabad", "pune"],
              ["kolkata", "delhi"],
              ["mumbai", "hyderabad"],
              ["bangalore", "pune"],
            ].map(([slug1, slug2]) => {
              const c1 = cities.find((c) => c.slug === slug1);
              const c2 = cities.find((c) => c.slug === slug2);
              if (!c1 || !c2) return null;
              return (
                <Link
                  key={`${slug1}-${slug2}`}
                  href={`/compare/${slug1}-vs-${slug2}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700">
                    {c1.name} vs {c2.name}
                  </span>
                  <span className="text-orange-400 group-hover:text-orange-600 text-sm">→</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            See incorrect prices in a comparison?{" "}
            <Link href="/feedback" className="text-orange-500 hover:text-orange-600 font-medium">
              Help us fix them →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
