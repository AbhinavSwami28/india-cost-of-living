import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🏙️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. Maybe you were looking for a city?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
            Go Home
          </Link>
          <Link href="/compare" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:border-orange-300 transition-colors">
            Compare Cities
          </Link>
          <Link href="/offer" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:border-orange-300 transition-colors">
            Job Offer Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
