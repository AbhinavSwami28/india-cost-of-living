import type { Metadata } from "next";
import OfferCalculator from "@/components/OfferCalculator";

export const metadata: Metadata = {
  title: "Should I Take This Job Offer? — Salary & City Comparison",
  description: "Compare your current salary and city with a new job offer. Factor in rent, groceries, transport, EMI commitments, and lifestyle to see if the move is worth it.",
  keywords: [
    "job offer comparison India",
    "should I relocate",
    "salary comparison cities",
    "cost of living job offer",
    "Bangalore vs Hyderabad salary",
    "is this offer worth it",
  ],
};

export default function OfferPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Should I Take This Offer?</h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            Enter your current situation and the new offer. We&apos;ll tell you if you&apos;ll actually be better off.
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OfferCalculator />
      </div>
    </div>
  );
}
