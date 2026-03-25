import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCityBySlug, cities, calculateCostIndex, formatPrice } from "@/lib/data";
import InteractiveComparison from "@/components/comparison/InteractiveComparison";
import AdBanner from "@/components/shared/AdBanner";

interface PageProps {
  params: Promise<{ cities: string }>;
}

function parseSlugs(citiesParam: string): [string, string] | null {
  const parts = citiesParam.split("-vs-");
  if (parts.length !== 2) return null;
  return [parts[0], parts[1]];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cities: citiesParam } = await params;
  const slugs = parseSlugs(citiesParam);
  if (!slugs) return {};

  const city1 = getCityBySlug(slugs[0]);
  const city2 = getCityBySlug(slugs[1]);
  if (!city1 || !city2) return {};

  return {
    title: `${city1.name} vs ${city2.name} - Cost of Living Comparison 2026`,
    description: `Compare cost of living between ${city1.name} and ${city2.name}. Side-by-side prices for rent, PG accommodation (double sharing, triple sharing, private room), groceries, transport, dining, and utilities. Edit prices to match your experience.`,
    keywords: [
      `${city1.name} vs ${city2.name} cost of living`,
      `${city1.name} ${city2.name} comparison`,
      `PG prices ${city1.name} vs ${city2.name}`,
      `rent ${city1.name} vs ${city2.name}`,
    ],
  };
}

// Pre-build only top 10 cities' pairs (90 pages). Rest generated on-demand via ISR.
export async function generateStaticParams() {
  const top = cities.slice(0, 10);
  const params: { cities: string }[] = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      params.push({ cities: `${top[i].slug}-vs-${top[j].slug}` });
      params.push({ cities: `${top[j].slug}-vs-${top[i].slug}` });
    }
  }
  return params;
}

// On-demand pages cached for 1 hour
export const revalidate = 3600;

export default async function ComparisonPage({ params }: PageProps) {
  const { cities: citiesParam } = await params;
  const slugs = parseSlugs(citiesParam);

  if (!slugs) notFound();

  const city1 = getCityBySlug(slugs[0]);
  const city2 = getCityBySlug(slugs[1]);

  if (!city1 || !city2) notFound();

  const index1 = calculateCostIndex(city1);
  const index2 = calculateCostIndex(city2);
  const cheaperCity = index1 <= index2 ? city1 : city2;
  const pricierCity = index1 <= index2 ? city2 : city1;
  const cheaperIndex = Math.min(index1, index2);
  const pricierIndex = Math.max(index1, index2);
  const diffPct = pricierIndex > 0 ? Math.round(((pricierIndex - cheaperIndex) / pricierIndex) * 100) : 0;

  // Key price comparisons
  const compareItems = [
    "1 BHK in City Centre",
    "PG - Double Sharing (with meals)",
    "Veg Thali (local restaurant)",
    "Metro / Local Train (monthly pass)",
    "Electricity",
  ] as const;

  const pricePairs = compareItems
    .map((item) => {
      const p1 = city1.prices.find((p) => p.item === item);
      const p2 = city2.prices.find((p) => p.item === item);
      if (!p1 || !p2) return null;
      const diff = Math.abs(p1.price - p2.price);
      const diffPctLocal = Math.round((diff / Math.max(p1.price, p2.price)) * 100);
      const cheaperHere = p1.price <= p2.price ? city1.name : city2.name;
      return { item, p1, p2, diffPctLocal, cheaperHere };
    })
    .filter(Boolean) as {
      item: string;
      p1: { price: number };
      p2: { price: number };
      diffPctLocal: number;
      cheaperHere: string;
    }[];

  // Who should choose which city
  const city1Pros: string[] = [];
  const city2Pros: string[] = [];
  if (index1 < index2) {
    city1Pros.push(`${diffPct}% lower overall cost of living`);
    city2Pros.push("higher earning potential in some sectors");
  } else if (index2 < index1) {
    city2Pros.push(`${diffPct}% lower overall cost of living`);
    city1Pros.push("higher earning potential in some sectors");
  }
  if (city1.state !== city2.state) {
    city1Pros.push(`located in ${city1.state}`);
    city2Pros.push(`located in ${city2.state}`);
  }

  const comparisonFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${city1.name} cheaper than ${city2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            index1 === index2
              ? `${city1.name} and ${city2.name} have a very similar overall cost of living (Cost Index: ${index1} vs ${index2}, with Mumbai = 100).`
              : `${cheaperCity.name} is cheaper than ${pricierCity.name} by approximately ${diffPct}%. ${cheaperCity.name} has a Cost Index of ${cheaperIndex} vs ${pricierCity.name}'s ${pricierIndex} (Mumbai = 100).`,
        },
      },
      {
        "@type": "Question",
        name: `What is the average rent in ${city1.name} compared to ${city2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: (() => {
            const r1 = city1.prices.find((p) => p.item === "1 BHK in City Centre");
            const r2 = city2.prices.find((p) => p.item === "1 BHK in City Centre");
            if (r1 && r2) {
              return `A 1BHK in ${city1.name}'s city centre costs around ${formatPrice(r1.price)}/month, compared to ${formatPrice(r2.price)}/month in ${city2.name}. ${r1.price < r2.price ? city1.name : city2.name} is more affordable for renting.`;
            }
            return `Use the comparison tool above to see detailed rent prices for both cities.`;
          })(),
        },
      },
      {
        "@type": "Question",
        name: `Which city is better for working professionals — ${city1.name} or ${city2.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Both ${city1.name} and ${city2.name} have active job markets. ${cheaperCity.name} offers a lower cost of living, which means your salary goes further. However, the right choice depends on your industry, career stage, and lifestyle preferences. Use the salary evaluator tool to compare purchasing power across cities.`,
        },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonFaqJsonLd) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="text-sm text-orange-200 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{city1.name} vs {city2.name}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {city1.name} vs {city2.name}
          </h1>
          <p className="text-lg text-orange-100 mb-2">
            Interactive Cost of Living Comparison — {city1.state} vs {city2.state}
          </p>
          <p className="text-sm text-orange-200">
            Edit any price to match your experience. Filter categories. Choose your accommodation type. Calculate your monthly budget.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InteractiveComparison initialCity1={city1} initialCity2={city2} />

        <AdBanner adFormat="horizontal" className="mt-8" />

        {/* Cost Summary */}
        <div className="mt-10 bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {city1.name} vs {city2.name}: Cost of Living Summary
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            An overview of how costs compare between {city1.state} and {city2.state}.
          </p>

          {/* Cost index comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cost Index</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{index1}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">{city1.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{city1.state}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cost Index</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{index2}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">{city2.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{city2.state}</div>
            </div>
          </div>

          {/* Verdict text */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {index1 === index2 ? (
                <>{city1.name} and {city2.name} have an almost identical overall cost of living, both scoring {index1} on the Cost Index (Mumbai = 100). The differences between them are in specific categories rather than the overall total.</>
              ) : (
                <><strong>{cheaperCity.name}</strong> is approximately <strong>{diffPct}% cheaper</strong> than {pricierCity.name} overall (Cost Index: {cheaperIndex} vs {pricierIndex}, Mumbai = 100). If affordability is your primary concern, {cheaperCity.name} has a clear advantage. That said, salary levels and career opportunities vary between the two cities, so your net purchasing power depends on your specific role and industry.</>
              )}
            </p>
          </div>

          {/* Key price comparison table */}
          {pricePairs.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                Key Price Comparison
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#2a2a2a]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Item</th>
                      <th className="text-right px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{city1.name}</th>
                      <th className="text-right px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{city2.name}</th>
                      <th className="text-right px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Cheaper</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricePairs.map((pair, i) => (
                      <tr key={i} className="border-t border-gray-100 dark:border-[#2a2a2a]">
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pair.item}</td>
                        <td className={`px-4 py-3 text-right font-medium ${pair.cheaperHere === city1.name ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                          {formatPrice(pair.p1.price)}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${pair.cheaperHere === city2.name ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                          {formatPrice(pair.p2.price)}
                        </td>
                        <td className="px-4 py-3 text-right text-xs">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                            {pair.cheaperHere} ({pair.diffPctLocal}% less)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Who should choose which city */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Choose {city1.name} if you…</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {index1 < index2 && <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span>Want a lower cost of living ({diffPct}% cheaper than {city2.name})</li>}
              <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span>Have a job offer or career opportunity in {city1.state}</li>
              <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span>Prefer the culture, climate, and lifestyle of {city1.name}</li>
              {index1 > index2 && <li className="flex gap-2"><span className="text-orange-400 flex-shrink-0">→</span>Are comfortable with higher living costs in exchange for other benefits</li>}
            </ul>
          </div>
          <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Choose {city2.name} if you…</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {index2 < index1 && <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span>Want a lower cost of living ({diffPct}% cheaper than {city1.name})</li>}
              <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span>Have a job offer or career opportunity in {city2.state}</li>
              <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">✓</span>Prefer the culture, climate, and lifestyle of {city2.name}</li>
              {index2 > index1 && <li className="flex gap-2"><span className="text-orange-400 flex-shrink-0">→</span>Are comfortable with higher living costs in exchange for other benefits</li>}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
            Common Questions: {city1.name} vs {city2.name}
          </h2>
          <div className="space-y-4">
            {comparisonFaqJsonLd.mainEntity.map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Comparisons (kept as static SEO content) */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Comparisons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cities
              .filter((c) => c.slug !== city1.slug && c.slug !== city2.slug)
              .slice(0, 6)
              .flatMap((c) => [
                { from: city1, to: c },
                { from: city2, to: c },
              ])
              .slice(0, 6)
              .map(({ from, to }) => (
                <Link
                  key={`${from.slug}-${to.slug}`}
                  href={`/compare/${from.slug}-vs-${to.slug}`}
                  className="flex items-center justify-between bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all group"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-orange-700 dark:group-hover:text-orange-400">
                    {from.name} vs {to.name}
                  </span>
                  <span className="text-orange-400 group-hover:text-orange-600 text-sm">→</span>
                </Link>
              ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prices look different from your experience?{" "}
            <Link href="/feedback" className="text-orange-500 hover:text-orange-600 font-medium">
              Help us improve the data →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
