export interface BudgetItemConfig {
  item: string;
  budgetGroup: string;
  defaultQty: number;
  isOptional?: boolean;
  genderTag?: "m" | "f";
}

export type ProfileKey = "student" | "professional" | "couple" | "family";

export interface ProfileConfig {
  key: ProfileKey;
  label: string;
  icon: string;
  accCentre: string;
  accOutskirts: string;
  excludeItems: string[];
  excludeWomens: boolean;
}

const PG_ITEMS = [
  "PG - Private Room (with meals)", "PG - Private Room (without meals)",
  "PG - Double Sharing (with meals)", "PG - Double Sharing (without meals)",
  "PG - Triple Sharing (with meals)", "PG - Triple Sharing (without meals)",
];

export const BUDGET_ITEMS: BudgetItemConfig[] = [
  // Restaurants & Dining
  { item: "Veg Thali (local restaurant)", budgetGroup: "Restaurants & Dining", defaultQty: 2 },
  { item: "Chai (regular cup)", budgetGroup: "Restaurants & Dining", defaultQty: 30 },
  { item: "Coffee (Cappuccino)", budgetGroup: "Restaurants & Dining", defaultQty: 10 },
  { item: "Street Food (Vada Pav / Samosa)", budgetGroup: "Restaurants & Dining", defaultQty: 8 },
  { item: "Dosa (plain)", budgetGroup: "Restaurants & Dining", defaultQty: 4 },
  { item: "Fast Food Combo (McDonald's)", budgetGroup: "Restaurants & Dining", defaultQty: 2 },
  { item: "Bottled Water (1 litre)", budgetGroup: "Restaurants & Dining", defaultQty: 15 },

  // Groceries
  { item: "Rice (Basmati)", budgetGroup: "Groceries", defaultQty: 5 },
  { item: "Wheat Flour (Atta)", budgetGroup: "Groceries", defaultQty: 3 },
  { item: "Toor Dal", budgetGroup: "Groceries", defaultQty: 2 },
  { item: "Milk (Full Cream)", budgetGroup: "Groceries", defaultQty: 15 },
  { item: "Eggs", budgetGroup: "Groceries", defaultQty: 3 },
  { item: "Paneer", budgetGroup: "Groceries", defaultQty: 1 },
  { item: "Onions", budgetGroup: "Groceries", defaultQty: 3 },
  { item: "Tomatoes", budgetGroup: "Groceries", defaultQty: 3 },
  { item: "Potatoes", budgetGroup: "Groceries", defaultQty: 3 },
  { item: "Cooking Oil (Sunflower)", budgetGroup: "Groceries", defaultQty: 2 },
  { item: "Sugar", budgetGroup: "Groceries", defaultQty: 1 },
  { item: "Apples (Shimla)", budgetGroup: "Groceries", defaultQty: 2 },
  { item: "Bananas", budgetGroup: "Groceries", defaultQty: 2 },
  { item: "Bread (White, Sliced)", budgetGroup: "Groceries", defaultQty: 2 },

  // Transportation
  { item: "Metro / Local Train (monthly pass)", budgetGroup: "Transportation", defaultQty: 1 },
  { item: "Ola/Uber (avg ride)", budgetGroup: "Transportation", defaultQty: 8 },
  { item: "Auto Rickshaw (minimum fare)", budgetGroup: "Transportation", defaultQty: 15 },
  { item: "Petrol", budgetGroup: "Transportation", defaultQty: 20 },

  // Utilities
  { item: "Electricity", budgetGroup: "Utilities", defaultQty: 1 },
  { item: "Water Bill", budgetGroup: "Utilities", defaultQty: 1 },
  { item: "Cooking Gas (LPG Cylinder)", budgetGroup: "Utilities", defaultQty: 1 },
  { item: "Broadband Internet", budgetGroup: "Utilities", defaultQty: 1 },
  { item: "Mobile Plan (Jio/Airtel)", budgetGroup: "Utilities", defaultQty: 1 },

  // Household Help
  { item: "Cook (part-time, 2 meals/day)", budgetGroup: "Household Help", defaultQty: 1 },
  { item: "Maid / Cleaning Help", budgetGroup: "Household Help", defaultQty: 1 },
  { item: "Laundry / Ironing (dhobi)", budgetGroup: "Household Help", defaultQty: 1 },

  // Miscellaneous
  { item: "Miscellaneous Monthly Spend", budgetGroup: "Miscellaneous", defaultQty: 1 },

  // Shopping & Personal Care
  { item: "Men's Casual Shirt (Zara/H&M)", budgetGroup: "Shopping & Personal Care", defaultQty: 1, genderTag: "m" },
  { item: "Women's Dress (Myntra/Zara)", budgetGroup: "Shopping & Personal Care", defaultQty: 1, genderTag: "f" },
  { item: "Running Shoes (Nike/Adidas)", budgetGroup: "Shopping & Personal Care", defaultQty: 1 },
  { item: "Skincare Basics (Nykaa avg)", budgetGroup: "Shopping & Personal Care", defaultQty: 1 },
  { item: "Amazon Prime Membership", budgetGroup: "Shopping & Personal Care", defaultQty: 1 },

  // Lifestyle & Entertainment
  { item: "Gym Membership", budgetGroup: "Lifestyle & Entertainment", defaultQty: 1 },
  { item: "Movie Ticket (Multiplex)", budgetGroup: "Lifestyle & Entertainment", defaultQty: 2 },
  { item: "Netflix (Standard Plan)", budgetGroup: "Lifestyle & Entertainment", defaultQty: 1 },
  { item: "Spotify Premium", budgetGroup: "Lifestyle & Entertainment", defaultQty: 1 },
  { item: "Haircut (Men, basic salon)", budgetGroup: "Lifestyle & Entertainment", defaultQty: 1, genderTag: "m" },
  { item: "Domestic Beer (pint, restaurant)", budgetGroup: "Lifestyle & Entertainment", defaultQty: 4 },

  // Optional items — not in default budget, user can add
  { item: "Non-Veg Thali (local restaurant)", budgetGroup: "Restaurants & Dining", defaultQty: 2, isOptional: true },
  { item: "Chicken", budgetGroup: "Groceries", defaultQty: 2, isOptional: true },
  { item: "Meal for Two (high-end restaurant)", budgetGroup: "Restaurants & Dining", defaultQty: 1, isOptional: true },
  { item: "Biryani (chicken)", budgetGroup: "Restaurants & Dining", defaultQty: 2, isOptional: true },
  { item: "Soft Drink (Coca-Cola, 300ml)", budgetGroup: "Restaurants & Dining", defaultQty: 4, isOptional: true },
  { item: "Two Wheeler EMI (avg)", budgetGroup: "Transportation", defaultQty: 1, isOptional: true },
  { item: "Car EMI (avg)", budgetGroup: "Transportation", defaultQty: 1, isOptional: true },
  { item: "Diesel", budgetGroup: "Transportation", defaultQty: 15, isOptional: true },
  { item: "Imported Beer (bottle, restaurant)", budgetGroup: "Lifestyle & Entertainment", defaultQty: 2, isOptional: true },
  { item: "Whey Protein (1 kg)", budgetGroup: "Groceries", defaultQty: 1, isOptional: true },
  { item: "Specialty Coffee (Third Wave)", budgetGroup: "Restaurants & Dining", defaultQty: 4, isOptional: true },
];

export const DEFAULT_QUANTITIES: Record<string, number> = Object.fromEntries(
  BUDGET_ITEMS.map((b) => [b.item, b.defaultQty])
);

export const BUDGET_GROUPS: Record<string, { items: string[] }> = {};
for (const b of BUDGET_ITEMS) {
  if (!BUDGET_GROUPS[b.budgetGroup]) BUDGET_GROUPS[b.budgetGroup] = { items: [] };
  if (!BUDGET_GROUPS[b.budgetGroup].items.includes(b.item)) {
    BUDGET_GROUPS[b.budgetGroup].items.push(b.item);
  }
}

export const BUDGET_GROUP_ORDER = [
  "Restaurants & Dining",
  "Groceries",
  "Transportation",
  "Utilities",
  "Household Help",
  "Miscellaneous",
  "Shopping & Personal Care",
  "Lifestyle & Entertainment",
];

export const PROFILE_CONFIGS: ProfileConfig[] = [
  {
    key: "student",
    label: "Student",
    icon: "🎓",
    accCentre: "PG - Double Sharing (with meals)",
    accOutskirts: "PG - Double Sharing (with meals)",
    excludeItems: ["Meal for Two (high-end restaurant)", "Two Wheeler EMI (avg)", "Car EMI (avg)", "Diesel"],
    excludeWomens: true,
  },
  {
    key: "professional",
    label: "Professional",
    icon: "💼",
    accCentre: "1 BHK in City Centre",
    accOutskirts: "1 BHK Outside City Centre",
    excludeItems: ["Two Wheeler EMI (avg)", "Car EMI (avg)", "Diesel"],
    excludeWomens: true,
  },
  {
    key: "couple",
    label: "Newly Married",
    icon: "💑",
    accCentre: "1 BHK in City Centre",
    accOutskirts: "1 BHK Outside City Centre",
    excludeItems: [...PG_ITEMS],
    excludeWomens: false,
  },
  {
    key: "family",
    label: "Family",
    icon: "👨‍👩‍👧",
    accCentre: "2 BHK in City Centre",
    accOutskirts: "2 BHK Outside City Centre",
    excludeItems: ["Two Wheeler EMI (avg)", "Car EMI (avg)", ...PG_ITEMS],
    excludeWomens: false,
  },
];

export function getProfileExclusions(profileKey: string): Set<string> {
  const profile = PROFILE_CONFIGS.find((p) => p.key === profileKey);
  if (!profile) return new Set();
  const exclusions = [...profile.excludeItems];
  if (profile.excludeWomens) {
    BUDGET_ITEMS.filter((b) => b.genderTag === "f").forEach((b) => exclusions.push(b.item));
  }
  return new Set(exclusions);
}

export function getProfileAccommodation(profileKey: string, cityCentre: boolean): string {
  const profile = PROFILE_CONFIGS.find((p) => p.key === profileKey);
  if (!profile) return "1 BHK Outside City Centre";
  return cityCentre ? profile.accCentre : profile.accOutskirts;
}

export const DEFAULT_BUDGET_ITEM_SET: Set<string> = new Set(
  BUDGET_ITEMS.filter((b) => !b.isOptional).map((b) => b.item)
);
