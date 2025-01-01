export interface PriceItem {
  category: string;
  item: string;
  unit: string;
  price: number; // in INR
}

export interface CityData {
  name: string;
  slug: string;
  state: string;
  description: string;
  population: string;
  image: string;
  lastUpdated: string;
  contributors: number;
  prices: PriceItem[];
}

export const CATEGORIES = [
  "Restaurants & Dining",
  "Groceries",
  "Transportation",
  "Utilities (Monthly)",
  "Accommodation - Rent (Monthly)",
  "PG / Shared Accommodation (Monthly)",
  "Lifestyle & Entertainment",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  "Restaurants & Dining": "🍽️",
  "Groceries": "🛒",
  "Transportation": "🚗",
  "Utilities (Monthly)": "💡",
  "Accommodation - Rent (Monthly)": "🏠",
  "PG / Shared Accommodation (Monthly)": "🏘️",
  "Lifestyle & Entertainment": "🎬",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "Restaurants & Dining": "Average prices at local restaurants, street food stalls, and cafes",
  "Groceries": "Prices at local markets and grocery stores",
  "Transportation": "Public transport, ride-hailing, and fuel costs",
  "Utilities (Monthly)": "Monthly bills for a typical 2BHK apartment",
  "Accommodation - Rent (Monthly)": "Monthly rent for apartments in different areas",
  "PG / Shared Accommodation (Monthly)": "Paying Guest accommodations popular with students and young professionals",
  "Lifestyle & Entertainment": "Gym, movies, streaming, and personal care",
};
