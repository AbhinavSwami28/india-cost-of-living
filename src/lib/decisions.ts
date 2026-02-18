import { CityData } from "./types";
import { formatPrice } from "./data";

// Comprehensive monthly expense for a single working professional
// Includes: food, groceries, transport, utilities, lifestyle, household help, shopping, misc
function comprehensiveMonthlyExpense(city: CityData): number {
  const get = (item: string) => city.prices.find((p) => p.item === item)?.price ?? 0;

  // Food: mix of cooking at home + eating out
  const food =
    get("Veg Thali (local restaurant)") * 15 +  // eat out ~15 days
    get("Chai (regular cup)") * 30 +              // daily chai
    get("Coffee (Cappuccino)") * 10 +             // coffee 10x/month
    get("Street Food (Vada Pav / Samosa)") * 8 +  // snacks
    get("Dosa (plain)") * 4 +                     // occasional
    get("Fast Food Combo (McDonald's)") * 2 +     // occasional
    get("Bottled Water (1 litre)") * 15;           // water

  // Groceries: monthly staples
  const groceries =
    get("Rice (Basmati)") * 5 +
    get("Wheat Flour (Atta)") * 3 +
    get("Toor Dal") * 2 +
    get("Milk (Full Cream)") * 15 +
    get("Eggs") * 3 +                             // 3 dozen
    get("Paneer") * 1 +
    get("Onions") * 3 +
    get("Tomatoes") * 3 +
    get("Potatoes") * 3 +
    get("Cooking Oil (Sunflower)") * 2 +
    get("Sugar") * 1 +
    get("Apples (Shimla)") * 2 +
    get("Bananas") * 2 +
    get("Bread (White, Sliced)") * 4;

  // Transport: metro pass + Ola rides + auto rides + petrol
  const transport =
    (get("Metro / Local Train (monthly pass)") || get("Bus (monthly pass)")) +
    get("Ola/Uber (avg ride)") * 8 +              // 8 rides/month
    get("Auto Rickshaw (minimum fare)") * 15 +     // 15 auto rides
    get("Petrol") * 20;                            // 20L petrol

  // Utilities
  const utilities =
    get("Electricity") +
    get("Water Bill") +
    get("Cooking Gas (LPG Cylinder)") +
    get("Broadband Internet") +
    get("Mobile Plan (Jio/Airtel)");

  // Household help
  const household =
    get("Maid / Cleaning Help") +
    get("Laundry / Ironing (dhobi)") +
    get("Miscellaneous Monthly Spend");

  // Lifestyle
  const lifestyle =
    get("Gym Membership") +
    get("Movie Ticket (Multiplex)") * 2 +
    get("Netflix (Standard Plan)") +
    get("Spotify Premium") +
    get("Haircut (Men, basic salon)") +
    get("Domestic Beer (pint, restaurant)") * 4;

  // Shopping
  const shopping =
    get("Skincare Basics (Nykaa avg)") +
    get("Amazon Prime Membership");

  return food + groceries + transport + utilities + household + lifestyle + shopping;
}

// Full monthly cost including rent
function fullMonthlyCost(city: CityData, accommodation = "1 BHK Outside City Centre"): number {
  const rent = city.prices.find((p) => p.item === accommodation)?.price ?? 0;
  return comprehensiveMonthlyExpense(city) + rent;
}

/**
 * Salary equivalence: what salary in City B gives the same lifestyle as salaryInA in City A
 */
export function salaryEquivalent(salaryInA: number, cityA: CityData, cityB: CityData, accommodation?: string): number {
  const costA = fullMonthlyCost(cityA, accommodation);
  const costB = fullMonthlyCost(cityB, accommodation);
  if (costA === 0) return salaryInA;
  return Math.round(salaryInA * (costB / costA));
}

/**
 * Affordability tier based on salary vs expenses
 */
export type AffordabilityTier = "cannot_afford" | "survival" | "comfortable" | "saving_well" | "luxury";

export function affordabilityTier(salary: number, city: CityData, accommodation?: string): AffordabilityTier {
  const cost = fullMonthlyCost(city, accommodation);
  if (cost === 0) return "comfortable";
  const ratio = salary / cost;

  if (ratio < 1) return "cannot_afford";
  if (ratio < 1.3) return "survival";
  if (ratio < 2) return "comfortable";
  if (ratio < 3) return "saving_well";
  return "luxury";
}

export const TIER_CONFIG: Record<AffordabilityTier, { label: string; color: string; bgColor: string; description: string }> = {
  cannot_afford: { label: "Cannot Afford", color: "text-red-600", bgColor: "bg-red-50 border-red-200", description: "Salary doesn't cover basic expenses + rent in this city" },
  survival: { label: "Tight Budget", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", description: "Covers expenses but very little savings. Cut lifestyle to save." },
  comfortable: { label: "Comfortable", color: "text-green-600", bgColor: "bg-green-50 border-green-200", description: "Good lifestyle with moderate savings each month" },
  saving_well: { label: "Saving Well", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200", description: "Strong savings — can invest, build emergency fund" },
  luxury: { label: "Very Comfortable", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", description: "Premium lifestyle with significant surplus for investments" },
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
  if (principal <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
  const emi = Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  return { emi, totalInterest, totalAmount };
}

/**
 * Get estimated full monthly cost for a city (for external use)
 */
export function getEstimatedMonthlyCost(city: CityData, accommodation?: string): number {
  return fullMonthlyCost(city, accommodation);
}
