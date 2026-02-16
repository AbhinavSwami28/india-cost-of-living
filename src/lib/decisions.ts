import { CityData } from "./types";
import { formatPrice } from "./data";

// Basic monthly expense estimate for a single person (no rent)
// Uses key items: thali×30, milk×15, groceries, transport pass, utilities, mobile, broadband
function basicMonthlyExpense(city: CityData): number {
  const get = (item: string) => city.prices.find((p) => p.item === item)?.price ?? 0;

  const food = get("Veg Thali (local restaurant)") * 30;
  const groceries =
    get("Rice (Basmati)") * 5 +
    get("Wheat Flour (Atta)") * 3 +
    get("Toor Dal") * 2 +
    get("Milk (Full Cream)") * 15 +
    get("Cooking Oil (Sunflower)") * 2 +
    get("Onions") * 3 +
    get("Tomatoes") * 3 +
    get("Potatoes") * 3 +
    get("Sugar") * 1;
  const transport = get("Metro / Local Train (monthly pass)") || get("Bus (monthly pass)");
  const utilities =
    get("Electricity") +
    get("Water Bill") +
    get("Cooking Gas (LPG Cylinder)") +
    get("Broadband Internet") +
    get("Mobile Plan (Jio/Airtel)");

  return food + groceries + transport + utilities;
}

// Full monthly cost including rent (1BHK outside city centre as default)
function fullMonthlyCost(city: CityData, accommodation = "1 BHK Outside City Centre"): number {
  const rent = city.prices.find((p) => p.item === accommodation)?.price ?? 0;
  return basicMonthlyExpense(city) + rent;
}

/**
 * Salary equivalence: what salary in City B gives the same lifestyle as salaryInA in City A
 */
export function salaryEquivalent(salaryInA: number, cityA: CityData, cityB: CityData): number {
  const costA = fullMonthlyCost(cityA);
  const costB = fullMonthlyCost(cityB);
  if (costA === 0) return salaryInA;
  return Math.round(salaryInA * (costB / costA));
}

/**
 * Affordability tier based on salary vs expenses
 */
export type AffordabilityTier = "cannot_afford" | "survival" | "comfortable" | "saving_well" | "luxury";

export function affordabilityTier(salary: number, city: CityData): AffordabilityTier {
  const cost = fullMonthlyCost(city);
  if (cost === 0) return "comfortable";
  const ratio = salary / cost;

  if (ratio < 1) return "cannot_afford";
  if (ratio < 1.3) return "survival";
  if (ratio < 2) return "comfortable";
  if (ratio < 3) return "saving_well";
  return "luxury";
}

export const TIER_CONFIG: Record<AffordabilityTier, { label: string; color: string; bgColor: string; description: string }> = {
  cannot_afford: { label: "Cannot Afford", color: "text-red-600", bgColor: "bg-red-50 border-red-200", description: "Salary doesn't cover basic expenses + rent" },
  survival: { label: "Tight Budget", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", description: "Covers basics but very little savings" },
  comfortable: { label: "Comfortable", color: "text-green-600", bgColor: "bg-green-50 border-green-200", description: "Good lifestyle with moderate savings" },
  saving_well: { label: "Saving Well", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200", description: "Strong savings, can invest and plan ahead" },
  luxury: { label: "Very Comfortable", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", description: "Premium lifestyle with significant surplus" },
};

/**
 * Monthly savings comparison between two cities
 */
export function savingsComparison(
  salary1: number, salary2: number,
  city1: CityData, city2: CityData
): { savings1: number; savings2: number; betterCity: string; differencePerMonth: number } {
  const cost1 = fullMonthlyCost(city1);
  const cost2 = fullMonthlyCost(city2);
  const savings1 = salary1 - cost1;
  const savings2 = salary2 - cost2;

  return {
    savings1,
    savings2,
    betterCity: savings1 > savings2 ? city1.name : savings2 > savings1 ? city2.name : "Equal",
    differencePerMonth: Math.abs(savings1 - savings2),
  };
}

/**
 * Human-readable decision summary comparing two cities
 */
export function decisionSummary(city1: CityData, city2: CityData): string {
  const cost1 = fullMonthlyCost(city1);
  const cost2 = fullMonthlyCost(city2);

  if (cost1 === 0 || cost2 === 0) return "";

  const diff = Math.abs(cost1 - cost2);
  const pctDiff = Math.round(Math.abs((cost1 - cost2) / cost1) * 100);
  const cheaper = cost1 > cost2 ? city2.name : city1.name;
  const costlier = cost1 > cost2 ? city1.name : city2.name;

  if (pctDiff < 3) {
    return `${city1.name} and ${city2.name} have similar costs of living.`;
  }

  return `Living in ${cheaper} is ~${pctDiff}% cheaper than ${costlier}. You'll save approximately ${formatPrice(diff)} per month.`;
}

/**
 * EMI calculator
 */
export function calculateEMI(
  principal: number,
  annualRate: number = 8.75,
  tenureYears: number = 20
): { emi: number; totalInterest: number; totalAmount: number } {
  const r = annualRate / 100 / 12;
  const n = tenureYears * 12;
  const emi = Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  return { emi, totalInterest, totalAmount };
}

/**
 * Get estimated full monthly cost for a city (for external use)
 */
export function getEstimatedMonthlyCost(city: CityData): number {
  return fullMonthlyCost(city);
}
