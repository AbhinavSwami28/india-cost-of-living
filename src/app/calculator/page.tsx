import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import AdBanner from "@/components/AdBanner";

const BudgetCalculator = dynamic(() => import("@/components/BudgetCalculator"), {
  loading: () => <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-3">🧮</div><p>Loading calculator...</p></div>,
});

export const metadata: Metadata = {
  title: "Monthly Budget Calculator - India Cost of Living",
  description:
    "Calculate your monthly cost of living in any Indian city. Select items, edit prices, set quantities, and get an accurate monthly budget. Covers rent, PG accommodation, groceries, transport, utilities, and lifestyle.",
  keywords: [
    "monthly budget calculator India",
    "cost of living calculator",
    "monthly expenses India",
    "PG budget calculator",
    "rent calculator India",
    "student budget India",
  ],
};

export default function CalculatorPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 dark:from-orange-950 dark:via-orange-900 dark:to-amber-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="text-sm text-orange-200 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">My Budget Calculator</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            My Monthly Budget Calculator
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl mb-2">
            Pick a base city, then customize everything — select what you spend on,
            edit prices to match your area, set your quantities, and get an accurate
            monthly budget.
          </p>
          <p className="text-sm text-orange-200">
            You can also enter your state, district, and city for reference.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BudgetCalculator />
        <AdBanner adFormat="horizontal" className="mt-8" />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prices don&apos;t match your experience?{" "}
            <Link href="/feedback" className="text-orange-500 hover:text-orange-600 font-medium">
              Let us know →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
