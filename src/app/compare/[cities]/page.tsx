import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCityBySlug, cities } from "@/lib/data";
import InteractiveComparison from "@/components/InteractiveComparison";
import AdBanner from "@/components/AdBanner";

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

  return (
    <div>
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
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700">
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
