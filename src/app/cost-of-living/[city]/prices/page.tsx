import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCityBySlug, getAllCitySlugs, calculateCostIndex, formatPrice, cities } from "@/lib/data";
import HeroImage from "@/components/shared/HeroImage";
import { CATEGORIES, Category, CATEGORY_ICONS } from "@/lib/types";
import PriceTable from "@/components/ui/PriceTable";
import AdBanner from "@/components/shared/AdBanner";
import CityCompareDropdown from "@/components/city/CityCompareDropdown";
import { getCityQuotes } from "@/lib/cityQuotes";
import { getCityFacts } from "@/lib/cityFacts";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const pgDouble = city.prices.find((p) => p.item === "PG - Double Sharing (with meals)");
  const rent1bhk = city.prices.find((p) => p.item === "1 BHK in City Centre");

  return {
    title: `Cost of Living in ${city.name}, ${city.state} - Prices & Rent 2026`,
    description: `Cost of living in ${city.name}: 1BHK rent from ${rent1bhk ? formatPrice(rent1bhk.price) : "N/A"}, PG double sharing from ${pgDouble ? formatPrice(pgDouble.price) : "N/A"}. Compare groceries, transport, dining, and utilities prices.`,
    keywords: [
      `cost of living in ${city.name}`,
      `cost of living ${city.name}`,
      `${city.name} rent prices`,
      `PG in ${city.name}`,
      `${city.name} grocery prices`,
      `double sharing PG ${city.name}`,
      `${city.name} expenses 2026`,
    ],
    alternates: {
      canonical: `/cost-of-living/${slug}/prices`,
    },
    openGraph: {
      title: `Cost of Living in ${city.name} — Prices & Rent 2026`,
      description: `1BHK: ${rent1bhk ? formatPrice(rent1bhk.price) : "N/A"}/mo, PG: ${pgDouble ? formatPrice(pgDouble.price) : "N/A"}/mo. Full breakdown of ${city.name} expenses.`,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const costIndex = calculateCostIndex(city);
  const otherCities = cities.filter((c) => c.slug !== city.slug);
  const cityFacts = getCityFacts(city.slug);

  // Quick summary stats
  const thali = city.prices.find((p) => p.item === "Veg Thali (local restaurant)");
  const rent1bhk = city.prices.find((p) => p.item === "1 BHK in City Centre");
  const rent1bhkOut = city.prices.find((p) => p.item === "1 BHK Outside City Centre");
  const pgDouble = city.prices.find((p) => p.item === "PG - Double Sharing (with meals)");
  const pgTriple = city.prices.find((p) => p.item === "PG - Triple Sharing (with meals)");
  const petrol = city.prices.find((p) => p.item === "Petrol");
  const metro = city.prices.find((p) => p.item === "Metro / Local Train (monthly pass)");
  const bus = city.prices.find((p) => p.item === "Bus (monthly pass)");
  const electricity = city.prices.find((p) => p.item === "Electricity");
  const internet = city.prices.find((p) => p.item === "Broadband Internet");

  // Compute budget scenarios
  const frugalBudget = pgTriple
    ? Math.round((pgTriple.price + (bus?.price ?? 500) + 1000) / 100) * 100
    : null;
  const moderateBudget = (() => {
    const accommodation = pgDouble?.price ?? rent1bhkOut?.price ?? 0;
    const food = thali ? thali.price * 60 : 6000;
    const transport = metro?.price ?? bus?.price ?? 800;
    const utils = (electricity?.price ?? 800) + (internet?.price ?? 600);
    return Math.round((accommodation + food + transport + utils + 2000) / 500) * 500;
  })();
  const comfortBudget = (() => {
    const accommodation = rent1bhk?.price ?? rent1bhkOut?.price ?? 0;
    const food = thali ? thali.price * 60 : 6000;
    const transport = (metro?.price ?? bus?.price ?? 800) + 2000;
    const utils = (electricity?.price ?? 1000) + (internet?.price ?? 700);
    return Math.round((accommodation + food + transport + utils + 5000) / 500) * 500;
  })();

  // Cost tier label
  const costTier =
    costIndex <= 40 ? "very affordable" :
    costIndex <= 60 ? "affordable" :
    costIndex <= 80 ? "moderately priced" :
    costIndex <= 100 ? "somewhat expensive" :
    "expensive";

  // City-specific FAQ
  const cityFaq = [
    {
      q: `How much does it cost to live in ${city.name} per month?`,
      a: `A single person living frugally in ${city.name} (PG triple sharing) can manage on around ${frugalBudget ? formatPrice(frugalBudget) : "₹12,000–₹18,000"}/month. A comfortable independent lifestyle with a 1BHK apartment typically costs ${comfortBudget ? formatPrice(comfortBudget) : "₹35,000–₹55,000"}/month, depending on lifestyle choices.`,
    },
    {
      q: `What is the average rent for a 1BHK apartment in ${city.name}?`,
      a: rent1bhk
        ? `A 1BHK apartment in ${city.name}'s city centre costs around ${formatPrice(rent1bhk.price)}/month. Outside the city centre, rent drops to approximately ${rent1bhkOut ? formatPrice(rent1bhkOut.price) : "20–30% less"}. Prices vary significantly by neighbourhood and the age of the building.`
        : `Rent for a 1BHK in ${city.name} varies by area. Central neighbourhoods command a premium, while areas further from the city centre are considerably more affordable.`,
    },
    {
      q: `Is ${city.name} affordable for students?`,
      a: pgTriple
        ? `Yes — ${city.name} has good PG accommodation options for students. A PG with triple sharing and meals starts from around ${formatPrice(pgTriple.price)}/month, making it accessible for students on a budget. The city is considered ${costTier} overall, with a Cost Index of ${costIndex} compared to Mumbai's base of 100.`
        : `${city.name} has student-friendly accommodation options. The city is considered ${costTier} with a Cost Index of ${costIndex} (Mumbai = 100), making it ${costIndex < 80 ? "a good choice" : "manageable"} for students.`,
    },
    {
      q: `How does ${city.name} compare to Mumbai for cost of living?`,
      a: costIndex === 100
        ? `${city.name} is used as the benchmark city (Cost Index = 100). All other cities are compared against Mumbai.`
        : costIndex < 100
        ? `${city.name} is ${Math.round(100 - costIndex)}% cheaper than Mumbai on average. Its Cost Index is ${costIndex} compared to Mumbai's 100. This means your rupee goes significantly further in ${city.name} than in India's most expensive city.`
        : `${city.name} is slightly more expensive than Mumbai in some categories. Its Cost Index is ${costIndex} compared to Mumbai's 100.`,
    },
    {
      q: `What are the cheapest accommodation options in ${city.name}?`,
      a: pgTriple
        ? `The most affordable option in ${city.name} is a PG with triple sharing and meals at around ${formatPrice(pgTriple.price)}/month. Double sharing PG accommodation costs approximately ${pgDouble ? formatPrice(pgDouble.price) : "10–20% more"}. For independent living, a 1BHK outside the city centre is typically the next step up.`
        : pgDouble
        ? `PG double sharing with meals is one of the most affordable accommodation options in ${city.name}, starting from around ${formatPrice(pgDouble.price)}/month. This includes meals, making it cost-effective for working professionals and students.`
        : `${city.name} offers a range of accommodation options from PG rooms to independent apartments. Use the price table above for current average rates.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cityFaq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://costoflivingindia.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Cost of Living in ${city.name}`,
        item: `https://costoflivingindia.com/cost-of-living/${city.slug}/prices`,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative text-white overflow-hidden">
        {/* Background: image with fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-700">
          <HeroImage src={city.image} alt={`${city.name} landmark`} />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-orange-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Cost of Living in {city.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Cost of Living in {city.name}
              </h1>
              <p className="text-lg text-orange-100">
                {city.state} • Population: {city.population}
              </p>
              <p className="text-orange-200 mt-2 max-w-2xl">{city.description}</p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                <div className="text-sm text-orange-200">Cost Index</div>
                <div className="text-3xl font-bold">{costIndex}</div>
                <div className="text-xs text-orange-200">Mumbai = 100</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {thali && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-xs text-orange-200">Veg Thali</div>
                <div className="text-lg font-bold">{formatPrice(thali.price)}</div>
              </div>
            )}
            {rent1bhk && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-xs text-orange-200">1BHK (Centre)</div>
                <div className="text-lg font-bold">{formatPrice(rent1bhk.price)}</div>
              </div>
            )}
            {pgDouble && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-xs text-orange-200">PG Double Sharing</div>
                <div className="text-lg font-bold">{formatPrice(pgDouble.price)}</div>
              </div>
            )}
            {petrol && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-xs text-orange-200">Petrol</div>
                <div className="text-lg font-bold">{formatPrice(petrol.price)}/L</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Category Quick Nav */}
            <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-4 mb-8 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Jump to Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat}
                    href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-700 dark:hover:text-orange-400 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <span>{CATEGORY_ICONS[cat as Category]}</span>
                    <span>{cat.split(" (")[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Ad */}
            <AdBanner adFormat="horizontal" className="mb-6" />

            {/* Price Tables */}
            <PriceTable prices={city.prices} cityName={city.name} />

            {/* Data info */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">
                    Last updated: <strong>{city.lastUpdated}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Based on data from {city.contributors} contributors
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Prices are averages and may vary by locality
                </p>
              </div>
            </div>

            {/* Monthly Budget Scenarios */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Monthly Budget Guide for {city.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Estimated all-in monthly costs based on current {city.name} prices — accommodation, food, transport, and utilities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {frugalBudget && (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                    <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">Student / Frugal</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">{formatPrice(frugalBudget)}<span className="text-sm font-normal">/mo</span></div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• PG triple sharing (meals incl.)</li>
                      <li>• Bus pass for commute</li>
                      <li>• Basic personal expenses</li>
                    </ul>
                  </div>
                )}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Working Professional</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">{formatPrice(moderateBudget)}<span className="text-sm font-normal">/mo</span></div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• PG double sharing or 1BHK outside centre</li>
                    <li>• Meals at local restaurants</li>
                    <li>• Metro / transport + utilities</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5">
                  <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">Comfortable</div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">{formatPrice(comfortBudget)}<span className="text-sm font-normal">/mo</span></div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• 1BHK in city centre</li>
                    <li>• Dining out + groceries</li>
                    <li>• Transport + utilities + leisure</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * Estimates are indicative. Actual costs depend on lifestyle, exact location, and current market rates.{" "}
                <Link href="/calculator" className="text-orange-500 hover:text-orange-600">Use the calculator</Link> to customise for your situation.
              </p>
            </div>

            {/* City Insights / Facts */}
            {cityFacts.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {city.name}: Key Facts & Insights
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  What makes {city.name} unique — economy, infrastructure, lifestyle, and things to know before you move.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cityFacts.map((fact, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 ${
                        fact.type === "positive"
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                          : fact.type === "negative"
                          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                          : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <span className="text-xl flex-shrink-0 mt-0.5">{fact.emoji}</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{fact.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                Frequently Asked Questions — Cost of Living in {city.name}
              </h2>
              <div className="space-y-4">
                {cityFaq.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.q}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compare CTA */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Thinking of relocating to or from {city.name}?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Use our tools to compare {city.name} with other cities, calculate your salary needs, or build a personalised monthly budget.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/compare?city=${city.slug}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Compare {city.name} with another city →
                </Link>
                <Link href="/offer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#2a2a2a] hover:border-orange-300 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                  Evaluate a job offer
                </Link>
                <Link href="/calculator" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#2a2a2a] hover:border-orange-300 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                  Budget calculator
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Quick Compare */}
            <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Compare {city.name} with</h3>
              <div className="mb-3">
                <CityCompareDropdown currentSlug={city.slug} cities={otherCities} />
              </div>
              <div className="space-y-1.5">
                {otherCities.slice(0, 5).map((other) => (
                  <Link key={other.slug} href={`/compare/${city.slug}-vs-${other.slug}`}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors group text-sm">
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-400">{city.name} vs {other.name}</span>
                    <span className="text-orange-400 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Cities */}
            <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Other Cities</h3>
              <div className="space-y-1.5">
                {otherCities.slice(0, 10).map((other) => (
                  <Link key={other.slug} href={`/cost-of-living/${other.slug}/prices`}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <span>{other.name}</span>
                    <span className="text-xs text-gray-400">{other.state}</span>
                  </Link>
                ))}
                <Link href="/#cities" className="block text-center py-2 text-sm text-orange-500 font-medium hover:text-orange-600">
                  View all {otherCities.length} cities →
                </Link>
              </div>
            </div>

            {/* Popular Moves */}
            <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">People from {city.name} also compare</h3>
              <div className="space-y-1.5">
                {otherCities.slice(0, 4).map((other) => (
                  <Link key={other.slug} href={`/compare/${city.slug}-vs-${other.slug}`}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors group text-sm">
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-400">{city.name} vs {other.name}</span>
                    <span className="text-orange-400 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* City Quotes */}
            {getCityQuotes(city.slug).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Voices of {city.name}</h3>
                {getCityQuotes(city.slug).map((quote, i) => (
                  <div key={i} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200/60 p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                    <div className="mt-2 text-xs text-orange-500 font-medium">
                      — {quote.author}{quote.context ? `, ${quote.context}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
