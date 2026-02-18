import { cities, calculateCostIndex, formatPrice } from "@/lib/data";
import dynamic from "next/dynamic";
import CitySelector from "@/components/shared/CitySelector";
import SalaryCheck from "@/components/shared/SalaryCheck";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import QuickStatsBar from "@/components/home/QuickStatsBar";
import IndexSection from "@/components/home/IndexSection";
import { FAQ_DATA } from "@/components/home/FAQSection";

const CityExplorer = dynamic(() => import("@/components/city/CityExplorer"));
const IndiaMap = dynamic(() => import("@/components/shared/IndiaMap"), {
  loading: () => (
    <div className="h-64 space-y-3 p-4">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="flex-1 bg-gray-100 rounded-xl animate-pulse h-48" />
    </div>
  ),
});
const AdBanner = dynamic(() => import("@/components/shared/AdBanner"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));

export default function HomePage() {
  const sortedCities = [...cities].sort(
    (a, b) => calculateCostIndex(b) - calculateCostIndex(a)
  );
  const cheapest5 = sortedCities.slice(-5).reverse();
  const expensive5 = sortedCities.slice(0, 5);

  const getPrice = (slug: string, item: string) =>
    cities.find((c) => c.slug === slug)?.prices.find((p) => p.item === item)?.price;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cost of Living India",
    url: "https://costoflivingindia.com",
    description: `Compare the cost of living across ${cities.length} Indian cities. Updated rent, PG, grocery, transport and utility prices for 2026.`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <HeroSection cityCount={cities.length} />
      <QuickStatsBar cityCount={cities.length} />

      {/* Compare Tool + Salary Check */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CitySelector />
          <SalaryCheck cities={cities} />
        </div>
      </section>

      {/* Interactive India Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Interactive Map</h2>
          <p className="text-xs text-gray-500 mb-2">Hover over a city for quick stats. Click to explore.</p>
          <IndiaMap cities={cities} />
        </div>
      </section>

      <IndexSection sortedCities={sortedCities} cities={cities} />

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner adFormat="horizontal" className="my-4" />
      </div>

      {/* City Cards */}
      <section id="cities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Cities</h2>
          <p className="text-gray-500 mt-1 text-sm">Search or filter by state to find your city.</p>
        </div>
        <CityExplorer cities={cities} />
      </section>

      {/* SEO Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Cost of Living in India</h2>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4">
            <p>
              The cost of living in India varies dramatically from city to city. Mumbai, the
              financial capital, consistently tops every index as the most expensive city — a
              1BHK apartment in central Mumbai costs around {formatPrice(getPrice("mumbai", "1 BHK in City Centre") ?? 65000)}/month, while the same
              apartment in a city like Lucknow is just {formatPrice(getPrice("lucknow", "1 BHK in City Centre") ?? 10000)}. Understanding these
              differences is essential whether you&apos;re relocating for a job, choosing a
              college city, or simply planning your budget.
            </p>
            <p>
              Our data covers {cities.length} major Indian cities across 7 categories — restaurants,
              groceries, transportation, utilities, apartment rent, PG accommodation, and lifestyle
              expenses — with 56+ individual price points per city. All prices are in Indian Rupees
              (₹) and updated for 2026.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-2">Rent &amp; Accommodation</h3>
            <p>
              Rent is the single largest expense in most Indian cities, accounting for 30–50% of
              monthly income. The <Link href="/cost-of-living/mumbai/prices" className="text-orange-600 hover:text-orange-700 font-medium">cost of living in Mumbai</Link> is
              driven primarily by sky-high rents — a 1BHK in the city centre can exceed ₹60,000/month.
              In <Link href="/cost-of-living/bangalore/prices" className="text-orange-600 hover:text-orange-700 font-medium">Bangalore</Link>, strong
              IT-sector demand pushes 1BHK rents to around ₹28,000, while <Link href="/cost-of-living/delhi/prices" className="text-orange-600 hover:text-orange-700 font-medium">Delhi</Link> and <Link href="/cost-of-living/gurgaon/prices" className="text-orange-600 hover:text-orange-700 font-medium">Gurgaon</Link> hover
              around ₹22,000 each.
            </p>
            <p>
              For young professionals and students, <strong>PG (Paying Guest) accommodation</strong> is
              a popular and uniquely Indian option. Double sharing PGs with meals range from
              ₹5,500/month in Lucknow to ₹12,000 in Mumbai. Triple sharing rooms are even more
              budget-friendly, starting at ₹3,000/month in tier-2 cities — making them the most
              popular choice for college students.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-2">Food &amp; Dining</h3>
            <p>
              Food costs vary across cities but remain affordable by global standards. A veg thali at
              a local restaurant costs ₹80–150 depending on the city, while chicken biryani ranges
              from ₹120 to ₹250. Street food — samosas, vada pav, dosas — stays remarkably cheap at
              ₹10–30 across almost every city. Monthly grocery bills for a single person typically
              range from ₹3,000 in smaller cities to ₹6,000 in metros, covering rice, dal, vegetables,
              milk, and cooking oil.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-2">Most Expensive vs Most Affordable Cities</h3>
            <p>
              The five most expensive cities on our index are{" "}
              {expensive5.map((city, i) => (
                <span key={city.slug}>
                  {i > 0 && (i === expensive5.length - 1 ? ", and " : ", ")}
                  <Link href={`/cost-of-living/${city.slug}/prices`} className="text-orange-600 hover:text-orange-700 font-medium">
                    {city.name} ({calculateCostIndex(city)})
                  </Link>
                </span>
              ))}
              . On the other end, the most affordable cities include{" "}
              {cheapest5.map((city, i) => (
                <span key={city.slug}>
                  {i > 0 && (i === cheapest5.length - 1 ? ", and " : ", ")}
                  <Link href={`/cost-of-living/${city.slug}/prices`} className="text-orange-600 hover:text-orange-700 font-medium">
                    {city.name} ({calculateCostIndex(city)})
                  </Link>
                </span>
              ))}
              . The gap is striking — living in Mumbai costs roughly 5–6× more than in
              India&apos;s most affordable tier-2 cities.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-2">Transportation</h3>
            <p>
              Public transport is affordable across India. Monthly metro or local train passes cost
              ₹500–2,500 depending on the city and distance. Auto-rickshaw minimum fares range from
              ₹20 to ₹30, and Ola/Uber rides average ₹150–250 for typical commutes. Petrol prices
              hover around ₹100–110/litre across most cities, with minor state-level variations.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-2">India in a Global Context</h3>
            <p>
              Compared to Western countries, India remains one of the most affordable places to live.
              Overall living costs are roughly 70–80% lower than the United States or United Kingdom.
              A comfortable monthly budget for a single person ranges from ₹15,000 in a tier-2 city
              to ₹60,000 in Mumbai — the equivalent of $180 to $720. This affordability, combined
              with a growing services economy and improving infrastructure, makes Indian cities
              attractive for both domestic migrants and digital nomads.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-2">Tips for Relocating Between Cities</h3>
            <p>
              If you&apos;re moving to a new city, use our <Link href="/compare" className="text-orange-600 hover:text-orange-700 font-medium">city comparison tool</Link> to
              see a side-by-side breakdown. The <Link href="/offer" className="text-orange-600 hover:text-orange-700 font-medium">salary offer evaluator</Link> can
              help you judge whether a new job offer compensates for the difference in living costs.
              As a rule of thumb, expect to spend 30–40% of your take-home salary on rent in a metro
              city, dropping to 15–25% in tier-2 cities.
            </p>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner adFormat="horizontal" className="mb-6" />
      </div>

      {/* Feedback CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Prices look off? Help us fix them.</h3>
            <p className="text-sm text-gray-600">Your local knowledge makes this data better for everyone. Report corrections or suggest improvements.</p>
          </div>
          <Link href="/feedback" className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm">
            Give Feedback
          </Link>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Comparisons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["mumbai", "delhi"], ["mumbai", "bangalore"], ["delhi", "bangalore"],
            ["hyderabad", "pune"], ["chennai", "kolkata"], ["bangalore", "hyderabad"],
            ["delhi", "jaipur"], ["pune", "mumbai"], ["kolkata", "lucknow"],
          ].map(([c1, c2]) => {
            const city1 = cities.find((c) => c.slug === c1)!;
            const city2 = cities.find((c) => c.slug === c2)!;
            return (
              <Link key={`${c1}-${c2}`} href={`/compare/${c1}-vs-${c2}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 hover:shadow-md transition-all">
                <span className="text-sm font-medium text-gray-800">{city1.name} vs {city2.name}</span>
                <span className="text-orange-500 text-sm">→</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
