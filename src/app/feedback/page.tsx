import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Feedback — Help Improve India Cost of Living Data",
  description:
    "Report incorrect prices, missing data, or suggest improvements. Help us keep India Cost of Living accurate and useful for everyone.",
};

export default function FeedbackPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 dark:from-orange-950 dark:via-orange-900 dark:to-amber-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="text-sm text-orange-200 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Feedback</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Help Us Improve
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            Spotted an incorrect price? Missing city? Outdated data? Your
            feedback helps thousands of people make better decisions.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSe5leTO7zVyJ5fVUcaq7Wnu7WmkgLpykZO8oUNOWccnZUXxTg/viewform?embedded=true"
            width="100%"
            height="900"
            className="border-0 w-full"
            title="Feedback Form"
          >
            Loading feedback form...
          </iframe>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-100 dark:border-orange-900/50">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              Incorrect Prices
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Rent, groceries, transport — if a price seems off, let us know the
              correct one.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50">
            <div className="text-2xl mb-2">🏙️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              Missing Cities
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your city not listed? Tell us and we&apos;ll work on adding it.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-100 dark:border-green-900/50">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              Suggestions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              New features, better categories, UI improvements — all ideas are
              welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
