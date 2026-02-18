import { cities, calculateCostIndex, calculateRentIndex, formatPrice } from "@/lib/data";
import dynamic from "next/dynamic";
import CityExplorer from "@/components/CityExplorer";
import CitySelector from "@/components/CitySelector";
import SalaryCheck from "@/components/SalaryCheck";
import Link from "next/link";

const IndiaMap = dynamic(() => import("@/components/IndiaMap"), {
  loading: () => (
    <div className="h-64 space-y-3 p-4">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="flex-1 bg-gray-100 rounded-xl animate-pulse h-48" />
    </div>
  ),
});
const AdBanner = dynamic(() => import("@/components/AdBanner"));

const FAQ_DATA = [
  {
    question: "Which is the cheapest city to live in India?",
    answer: "Based on our cost index (Mumbai = 100), cities like Gwalior (17), Siliguri (17), and Prayagraj (18) are among the cheapest major cities in India. Tier-2 cities in Uttar Pradesh, Madhya Pradesh, and Chhattisgarh offer the most affordable living, with 1BHK apartments available for ₹5,000–8,000/month and veg thalis for ₹60–70.",
  },
  {
    question: "Which Indian city has the highest cost of living?",
    answer: "Mumbai is India's most expensive city by a wide margin, scoring 100 on our cost index. A 1BHK apartment in central Mumbai costs around ₹65,000/month — nearly double Bangalore's and triple Delhi's. Bangalore (57) and Gurgaon (50) are the next most expensive, driven largely by IT-sector housing demand.",
  },
  {
    question: "What salary do you need to live comfortably in India?",
    answer: "It depends heavily on the city. In Mumbai, a single person needs around ₹50,000–60,000/month for a comfortable lifestyle including rent, food, and transport. In Bangalore, ₹35,000–45,000 is sufficient. In tier-2 cities like Jaipur or Lucknow, ₹20,000–25,000 covers rent, food, transport, and basic entertainment comfortably.",
  },
  {
    question: "Is India expensive compared to other countries?",
    answer: "India is one of the most affordable countries globally. Living costs are roughly 70–80% lower than in the US or UK. A restaurant meal costs ₹80–200, monthly rent for a 1BHK ranges from ₹5,000 to ₹65,000 depending on the city, and public transport passes cost ₹500–2,500/month.",
  },
  {
    question: "How much does PG accommodation cost in India?",
    answer: "PG (Paying Guest) prices vary by city and room type. Double sharing with meals ranges from ₹5,500/month in cities like Lucknow to ₹12,000 in Mumbai. Private rooms cost 40–60% more. Triple sharing starts at just ₹3,000/month in tier-2 cities, making it the most popular option for students.",
  },
  {
    question: "What are the biggest monthly expenses in India?",
    answer: "Rent is the largest expense, consuming 30–50% of income depending on the city and accommodation type. Food accounts for 15–25%, transportation 5–10%, and utilities 5–8%. Rent varies the most between cities — a 1BHK in Mumbai costs roughly 6x more than in Gwalior or Prayagraj.",
  },
];

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
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Cost of Living in India
            </h1>
            <p className="text-base sm:text-xl text-orange-100 mb-6 sm:mb-8 leading-relaxed">
              Compare prices across {cities.length} major Indian cities. From PG
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

      {/* Quick Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{cities.length}</div>
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

      {/* Compare Tool + Quick Salary Check */}
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

      {/* COL Index + Rent Index */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost of Living Index */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Cost of Living Index</h2>
            <p className="text-xs text-gray-500 mb-4">Mumbai = 100. Score of 75 means ~25% cheaper than Mumbai.</p>
            <div className="space-y-2">
              {sortedCities.slice(0, 10).map((city) => {
                const index = calculateCostIndex(city);
                return (
                  <Link key={city.slug} href={`/cost-of-living/${city.slug}/prices`} className="flex items-center gap-2 group">
                    <span className="text-xs font-medium text-gray-700 w-20 shrink-0 group-hover:text-orange-600 transition-colors truncate">{city.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{ width: `${Math.max(index, 10)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{index}</span>
                  </Link>
                );
              })}
            </div>
            <details className="mt-3">
              <summary className="text-xs text-orange-600 font-medium cursor-pointer hover:text-orange-700">
                Show all {sortedCities.length} cities
              </summary>
              <div className="space-y-2 mt-3">
                {sortedCities.slice(10).map((city) => {
                  const index = calculateCostIndex(city);
                  return (
                    <Link key={city.slug} href={`/cost-of-living/${city.slug}/prices`} className="flex items-center gap-2 group">
                      <span className="text-xs font-medium text-gray-700 w-20 shrink-0 group-hover:text-orange-600 transition-colors truncate">{city.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{ width: `${Math.max(index, 10)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{index}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>

          {/* Rent Index */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Rent Index</h2>
            <p className="text-xs text-gray-500 mb-4">Rent & PG prices relative to Mumbai = 100</p>
            <div className="space-y-2">
              {[...cities].sort((a, b) => calculateRentIndex(b) - calculateRentIndex(a)).slice(0, 10).map((city) => {
                const index = calculateRentIndex(city);
                return (
                  <Link key={city.slug} href={`/cost-of-living/${city.slug}/prices`} className="flex items-center gap-2 group">
                    <span className="text-xs font-medium text-gray-700 w-20 shrink-0 group-hover:text-blue-600 transition-colors truncate">{city.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: `${Math.max(index, 10)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{index}</span>
                  </Link>
                );
              })}
            </div>
            <details className="mt-3">
              <summary className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                Show all {cities.length} cities
              </summary>
              <div className="space-y-2 mt-3">
                {[...cities].sort((a, b) => calculateRentIndex(b) - calculateRentIndex(a)).slice(10).map((city) => {
                  const index = calculateRentIndex(city);
                  return (
                    <Link key={city.slug} href={`/cost-of-living/${city.slug}/prices`} className="flex items-center gap-2 group">
                      <span className="text-xs font-medium text-gray-700 w-20 shrink-0 group-hover:text-blue-600 transition-colors truncate">{city.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: `${Math.max(index, 10)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">{index}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner adFormat="horizontal" className="my-4" />
      </div>

      {/* City Cards */}
      <section id="cities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore Cities
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Search or filter by state to find your city.
          </p>
        </div>

        <CityExplorer cities={cities} />
      </section>

      {/* SEO Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Cost of Living in India
          </h2>
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

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-gray-100">
            {FAQ_DATA.map((faq, i) => (
              <details key={i} className="py-4 first:pt-0 last:pb-0 group" open={i === 0}>
                <summary className="flex items-center justify-between cursor-pointer list-none text-base font-semibold text-gray-900 hover:text-orange-700 transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner adFormat="horizontal" className="mb-6" />
      </div>

      {/* Feedback CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800/50 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Prices look off? Help us fix them.</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your local knowledge makes this data better for everyone. Report corrections or suggest improvements.</p>
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
            ["mumbai", "delhi"],
            ["mumbai", "bangalore"],
            ["delhi", "bangalore"],
            ["hyderabad", "pune"],
            ["chennai", "kolkata"],
            ["bangalore", "hyderabad"],
            ["delhi", "jaipur"],
            ["pune", "mumbai"],
            ["kolkata", "lucknow"],
          ].map(([c1, c2]) => {
            const city1 = cities.find((c) => c.slug === c1)!;
            const city2 = cities.find((c) => c.slug === c2)!;
            return (
              <Link
                key={`${c1}-${c2}`}
                href={`/compare/${c1}-vs-${c2}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium text-gray-800">
                  {city1.name} vs {city2.name}
                </span>
                <span className="text-orange-500 text-sm">→</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
