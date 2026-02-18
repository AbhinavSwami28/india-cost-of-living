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

export { FAQ_DATA };

export default function FAQSection() {
  return (
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
  );
}
