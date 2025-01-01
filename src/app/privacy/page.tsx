import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Cost of Living India — how we handle your data, cookies, and third-party services.",
};

export default function PrivacyPage() {
  const siteUrl = "https://costoflivingindia.com";
  const siteName = "Cost of Living India";
  const contactEmail = "swami.abhinav28@gmail.com";
  const lastUpdated = "February 16, 2026";

  return (
    <div>
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-orange-200 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-orange-200 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Introduction</h2>
            <p className="text-gray-600">
              Welcome to {siteName} (<a href={siteUrl} className="text-orange-600 hover:underline">{siteUrl}</a>).
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and
              protect your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information We Collect</h2>

            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Information You Provide</h3>
            <p className="text-gray-600">
              We do not require you to create an account or provide personal information
              to use our website. The budget calculator and comparison tools work entirely
              in your browser — no data is sent to our servers. If you contact us via email,
              we will only use your email address to respond to your inquiry.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Automatically Collected Information</h3>
            <p className="text-gray-600">When you visit our website, certain information may be collected automatically:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>IP address (anonymized)</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>
            <p className="text-gray-600 mt-2">
              This information is collected through cookies and similar technologies
              by third-party services described below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Third-Party Services</h2>

            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Google AdSense</h3>
            <p className="text-gray-600">
              This website uses Google AdSense to display advertisements. Google AdSense
              may use cookies and web beacons to serve ads based on your prior visits to
              this website or other websites on the internet. Google&apos;s use of advertising
              cookies enables it and its partners to serve ads based on your visit to this
              site and/or other sites on the internet.
            </p>
            <p className="text-gray-600 mt-2">
              You may opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                Google Ads Settings
              </a>. Alternatively, you can opt out of third-party vendor cookies by visiting{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                aboutads.info
              </a>.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Vercel</h3>
            <p className="text-gray-600">
              This website is hosted on Vercel. Vercel may collect anonymous usage data
              and log information for performance and security purposes. See{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                Vercel&apos;s Privacy Policy
              </a>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-600">This website uses cookies for the following purposes:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
              <li>
                <strong>Advertising cookies:</strong> Used by Google AdSense to serve
                relevant advertisements based on your browsing history
              </li>
              <li>
                <strong>Analytics cookies:</strong> To understand how visitors use our site
                and improve the user experience
              </li>
            </ul>
            <p className="text-gray-600 mt-2">
              You can control cookies through your browser settings. Disabling cookies
              may affect certain functionality of the website, including ad personalization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Retention</h2>
            <p className="text-gray-600">
              We do not store any personal data from visitors on our servers. All calculator
              and comparison data stays in your browser. Any data collected by
              third-party services (Google AdSense, Vercel) is subject to their
              respective data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Children&apos;s Privacy</h2>
            <p className="text-gray-600">
              This website is not directed at children under the age of 13. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights</h2>
            <p className="text-gray-600">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
              <li>Access the personal data held about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. Any changes will be
              posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href={`mailto:${contactEmail}`} className="text-orange-600 hover:underline">{contactEmail}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
