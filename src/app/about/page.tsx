import type { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/lib/data";

export const metadata: Metadata = {
  title: "About - Cost of Living India",
  description: "About Cost of Living India — our data methodology, mission, and team behind India's most comprehensive city cost comparison tool.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 dark:from-orange-950 dark:via-orange-900 dark:to-amber-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-orange-200 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">About</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold">About Cost of Living India</h1>
          <p className="text-orange-100 mt-2 max-w-2xl">
            Helping Indians make informed decisions about where to live, work, and study.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cost of Living India is built to answer one simple question: <strong>&quot;Can I afford to live in this city?&quot;</strong>
              Whether you&apos;re a student choosing between colleges, a professional evaluating a job offer in a new city,
              or a family planning a relocation — we provide the data you need to make smart financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Cover</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">🏙️</div>
                <div className="text-sm font-bold text-gray-900">{cities.length} Cities</div>
                <p className="text-xs text-gray-500 mt-1">From metros like Mumbai and Bangalore to emerging cities like Indore and Kochi</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-bold text-gray-900">56+ Price Points</div>
                <p className="text-xs text-gray-500 mt-1">Covering rent, PG accommodation, groceries, transport, utilities, dining, and lifestyle</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-sm font-bold text-gray-900">Updated Regularly</div>
                <p className="text-xs text-gray-500 mt-1">Prices are community-sourced and updated to reflect current market conditions</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">🧮</div>
                <div className="text-sm font-bold text-gray-900">Interactive Tools</div>
                <p className="text-xs text-gray-500 mt-1">Budget calculator, city comparison, salary-based savings calculator, and more</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Methodology</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our data is aggregated from multiple sources including rental listing platforms,
              local market surveys, government publications, and community contributions.
              Prices represent averages for each city and are intended as guidelines — actual costs
              may vary by neighbourhood, season, and lifestyle choices.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              We track prices across 7 categories: Restaurants &amp; Dining, Groceries, Transportation,
              Utilities, Apartment Rent, PG/Shared Accommodation, and Lifestyle &amp; Entertainment.
              Each category contains 6-12 specific items that represent typical monthly expenses.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <p className="text-xs text-orange-800">
                <strong>Data accuracy note:</strong> All prices are in Indian Rupees (₹) and represent city-wide averages
                as of February 2026. Prices in premium localities may be 20-50% higher than shown.
                We welcome corrections and updates from local residents.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-xs text-yellow-800">
                <strong>Tier-2/3 city disclaimer:</strong> Prices for cities beyond the top 10 metros are
                derived using cost-scaling formulas based on rent levels and verified against available
                online data. They may be less accurate than metro city prices. All prices are editable —
                adjust them to match your local experience.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Have feedback, data corrections, or partnership inquiries? Reach out to us at:{" "}
              <a href="mailto:swami.abhinav28@gmail.com" className="text-orange-600 hover:underline">
                swami.abhinav28@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
