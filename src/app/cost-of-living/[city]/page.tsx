import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCityBySlug, getAllCitySlugs, calculateCostIndex, formatPrice, cities } from "@/lib/data";
import HeroImage from "@/components/HeroImage";
import { CATEGORIES, Category, CATEGORY_ICONS } from "@/lib/types";
import PriceTable from "@/components/PriceTable";
import AdBanner from "@/components/AdBanner";
import CityCompareDropdown from "@/components/CityCompareDropdown";

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
      canonical: `/cost-of-living/${slug}`,
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

  // Quick summary stats
  const thali = city.prices.find((p) => p.item === "Veg Thali (local restaurant)");
  const rent1bhk = city.prices.find((p) => p.item === "1 BHK in City Centre");
  const pgDouble = city.prices.find((p) => p.item === "PG - Double Sharing (with meals)");
  const petrol = city.prices.find((p) => p.item === "Petrol");

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
        item: `https://costoflivingindia.com/cost-of-living/${city.slug}`,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Jump to Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat}
                    href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm text-gray-700 transition-colors"
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
            <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-5">
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
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Quick Compare */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Compare {city.name} with</h3>
              <div className="mb-3">
                <CityCompareDropdown currentSlug={city.slug} cities={otherCities} />
              </div>
              <div className="space-y-1.5">
                {otherCities.slice(0, 5).map((other) => (
                  <Link key={other.slug} href={`/compare/${city.slug}-vs-${other.slug}`}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-orange-50 transition-colors group text-sm">
                    <span className="text-gray-700 group-hover:text-orange-700">{city.name} vs {other.name}</span>
                    <span className="text-orange-400 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Cities */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Other Cities</h3>
              <div className="space-y-1.5">
                {otherCities.slice(0, 10).map((other) => (
                  <Link key={other.slug} href={`/cost-of-living/${other.slug}`}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900">
                    <span>{other.name}</span>
                    <span className="text-xs text-gray-400">{other.state}</span>
                  </Link>
                ))}
                <Link href="/#cities" className="block text-center py-2 text-sm text-orange-500 font-medium hover:text-orange-600">
                  View all {otherCities.length} cities →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
