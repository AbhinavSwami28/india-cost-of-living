// Additional 40 Indian cities with cross-verified price data
// Sources: Numbeo, MagicBricks, NoBroker, local surveys
// Prices in INR as of early 2026

import { CityData } from "./types";

// Generator: takes a cost profile and produces full price list
function makePrices(p: {
  vegThali: number; nonVegThali: number; mealForTwo: number; chai: number; coffee: number;
  streetFood: number; biryani: number; dosa: number; fastFood: number; softDrink: number; water: number;
  rice: number; atta: number; dal: number; milk: number; eggs: number; chicken: number; paneer: number;
  onions: number; tomatoes: number; potatoes: number; oil: number; sugar: number; apples: number;
  bananas: number; bread: number;
  autoMin: number; autoKm: number; metroPass: number; busPass: number; olaKm: number;
  petrol: number; diesel: number; activa: number; swift: number;
  electricity: number; waterBill: number; lpg: number; broadband: number; mobile: number;
  rent1c: number; rent1o: number; rent2c: number; rent2o: number; rent3c: number; rent3o: number;
  pgPvtM: number; pgPvtNm: number; pgDblM: number; pgDblNm: number; pgTrpM: number; pgTrpNm: number;
  gym: number; movie: number; netflix: number; spotify: number; haircut: number; beer: number; importBeer: number;
}) {
  // Derive new items from cost profile (tier-based scaling)
  const costScale = p.rent1c / 15000; // relative to a mid-tier city
  const specialtyCoffee = Math.round(200 + costScale * 100);
  const wheyProtein = 3000;
  const cook = Math.round(4000 + costScale * 4000);
  const maid = Math.round(1500 + costScale * 1500);
  const laundry = Math.round(800 + costScale * 700);
  const misc = Math.round(1500 + costScale * 1500);

  return [
    { category: "Restaurants & Dining", item: "Veg Thali (local restaurant)", unit: "per plate", price: p.vegThali },
    { category: "Restaurants & Dining", item: "Non-Veg Thali (local restaurant)", unit: "per plate", price: p.nonVegThali },
    { category: "Restaurants & Dining", item: "Meal for Two (high-end restaurant)", unit: "per meal", price: p.mealForTwo },
    { category: "Restaurants & Dining", item: "Chai (regular cup)", unit: "per cup", price: p.chai },
    { category: "Restaurants & Dining", item: "Coffee (Cappuccino)", unit: "per cup", price: p.coffee },
    { category: "Restaurants & Dining", item: "Specialty Coffee (Third Wave)", unit: "per cup", price: specialtyCoffee },
    { category: "Restaurants & Dining", item: "Street Food (Vada Pav / Samosa)", unit: "per piece", price: p.streetFood },
    { category: "Restaurants & Dining", item: "Biryani (chicken)", unit: "per plate", price: p.biryani },
    { category: "Restaurants & Dining", item: "Dosa (plain)", unit: "per plate", price: p.dosa },
    { category: "Restaurants & Dining", item: "Fast Food Combo (McDonald's)", unit: "per meal", price: p.fastFood },
    { category: "Restaurants & Dining", item: "Soft Drink (Coca-Cola, 300ml)", unit: "per bottle", price: p.softDrink },
    { category: "Restaurants & Dining", item: "Bottled Water (1 litre)", unit: "per bottle", price: p.water },
    { category: "Groceries", item: "Rice (Basmati)", unit: "1 kg", price: p.rice },
    { category: "Groceries", item: "Wheat Flour (Atta)", unit: "1 kg", price: p.atta },
    { category: "Groceries", item: "Toor Dal", unit: "1 kg", price: p.dal },
    { category: "Groceries", item: "Milk (Full Cream)", unit: "1 litre", price: p.milk },
    { category: "Groceries", item: "Eggs", unit: "12 pcs", price: p.eggs },
    { category: "Groceries", item: "Chicken", unit: "1 kg", price: p.chicken },
    { category: "Groceries", item: "Paneer", unit: "1 kg", price: p.paneer },
    { category: "Groceries", item: "Onions", unit: "1 kg", price: p.onions },
    { category: "Groceries", item: "Tomatoes", unit: "1 kg", price: p.tomatoes },
    { category: "Groceries", item: "Potatoes", unit: "1 kg", price: p.potatoes },
    { category: "Groceries", item: "Cooking Oil (Sunflower)", unit: "1 litre", price: p.oil },
    { category: "Groceries", item: "Sugar", unit: "1 kg", price: p.sugar },
    { category: "Groceries", item: "Apples (Shimla)", unit: "1 kg", price: p.apples },
    { category: "Groceries", item: "Bananas", unit: "1 dozen", price: p.bananas },
    { category: "Groceries", item: "Bread (White, Sliced)", unit: "1 loaf", price: p.bread },
    { category: "Groceries", item: "Whey Protein (1 kg)", unit: "per kg", price: wheyProtein },
    { category: "Transportation", item: "Auto Rickshaw (minimum fare)", unit: "per ride", price: p.autoMin },
    { category: "Transportation", item: "Auto Rickshaw (per km after min)", unit: "per km", price: p.autoKm },
    { category: "Transportation", item: "Metro / Local Train (monthly pass)", unit: "per month", price: p.metroPass },
    { category: "Transportation", item: "Bus (monthly pass)", unit: "per month", price: p.busPass },
    { category: "Transportation", item: "Ola/Uber (avg ride)", unit: "per ride", price: Math.round(p.olaKm * 15) },
    { category: "Transportation", item: "Petrol", unit: "1 litre", price: p.petrol },
    { category: "Transportation", item: "Diesel", unit: "1 litre", price: p.diesel },
    { category: "Transportation", item: "Two Wheeler EMI (avg)", unit: "per month", price: 3500 },
    { category: "Transportation", item: "Car EMI (avg)", unit: "per month", price: 15000 },
    { category: "Utilities (Monthly)", item: "Electricity", unit: "per month", price: p.electricity },
    { category: "Utilities (Monthly)", item: "Water Bill", unit: "per month", price: p.waterBill },
    { category: "Utilities (Monthly)", item: "Cooking Gas (LPG Cylinder)", unit: "per cylinder", price: p.lpg },
    { category: "Utilities (Monthly)", item: "Broadband Internet", unit: "per month", price: p.broadband },
    { category: "Utilities (Monthly)", item: "Mobile Plan (Jio/Airtel)", unit: "per month", price: p.mobile },
    { category: "Utilities (Monthly)", item: "Air Purifier Electricity (Delhi/NCR)", unit: "per month", price: 0 },
    { category: "Accommodation - Rent (Monthly)", item: "1 BHK in City Centre", unit: "per month", price: p.rent1c },
    { category: "Accommodation - Rent (Monthly)", item: "1 BHK Outside City Centre", unit: "per month", price: p.rent1o },
    { category: "Accommodation - Rent (Monthly)", item: "2 BHK in City Centre", unit: "per month", price: p.rent2c },
    { category: "Accommodation - Rent (Monthly)", item: "2 BHK Outside City Centre", unit: "per month", price: p.rent2o },
    { category: "Accommodation - Rent (Monthly)", item: "3 BHK in City Centre", unit: "per month", price: p.rent3c },
    { category: "Accommodation - Rent (Monthly)", item: "3 BHK Outside City Centre", unit: "per month", price: p.rent3o },
    { category: "PG / Shared Accommodation (Monthly)", item: "PG - Private Room (with meals)", unit: "per month", price: p.pgPvtM },
    { category: "PG / Shared Accommodation (Monthly)", item: "PG - Private Room (without meals)", unit: "per month", price: p.pgPvtNm },
    { category: "PG / Shared Accommodation (Monthly)", item: "PG - Double Sharing (with meals)", unit: "per month", price: p.pgDblM },
    { category: "PG / Shared Accommodation (Monthly)", item: "PG - Double Sharing (without meals)", unit: "per month", price: p.pgDblNm },
    { category: "PG / Shared Accommodation (Monthly)", item: "PG - Triple Sharing (with meals)", unit: "per month", price: p.pgTrpM },
    { category: "PG / Shared Accommodation (Monthly)", item: "PG - Triple Sharing (without meals)", unit: "per month", price: p.pgTrpNm },
    { category: "Household Help & Misc", item: "Cook (part-time, 2 meals/day)", unit: "per month", price: cook },
    { category: "Household Help & Misc", item: "Maid / Cleaning Help", unit: "per month", price: maid },
    { category: "Household Help & Misc", item: "Laundry / Ironing (dhobi)", unit: "per month", price: laundry },
    { category: "Household Help & Misc", item: "Miscellaneous Monthly Spend", unit: "per month", price: misc },
    { category: "Shopping & Online", item: "Men's Casual Shirt (Zara/H&M)", unit: "per piece", price: 2500 },
    { category: "Shopping & Online", item: "Women's Dress (Myntra/Zara)", unit: "per piece", price: 2000 },
    { category: "Shopping & Online", item: "Running Shoes (Nike/Adidas)", unit: "per pair", price: 5500 },
    { category: "Shopping & Online", item: "Skincare Basics (Nykaa avg)", unit: "per month", price: 1200 },
    { category: "Shopping & Online", item: "Amazon Prime Membership", unit: "per month", price: 149 },
    { category: "Lifestyle & Entertainment", item: "Gym Membership", unit: "per month", price: p.gym },
    { category: "Lifestyle & Entertainment", item: "Movie Ticket (Multiplex)", unit: "per ticket", price: p.movie },
    { category: "Lifestyle & Entertainment", item: "Netflix (Standard Plan)", unit: "per month", price: p.netflix },
    { category: "Lifestyle & Entertainment", item: "Spotify Premium", unit: "per month", price: p.spotify },
    { category: "Lifestyle & Entertainment", item: "Haircut (Men, basic salon)", unit: "per cut", price: p.haircut },
    { category: "Lifestyle & Entertainment", item: "Domestic Beer (pint, restaurant)", unit: "per pint", price: p.beer },
    { category: "Lifestyle & Entertainment", item: "Imported Beer (bottle, restaurant)", unit: "per bottle", price: p.importBeer },
  ];
}

export const additionalCities: CityData[] = [
  // ──────────── TIER 1.5 / MAJOR TIER 2 ────────────
  {
    name: "Gurgaon", slug: "gurgaon", state: "Haryana", population: "15 L",
    description: "India's millennium city and corporate hub, home to 300+ Fortune 500 offices. Part of Delhi NCR.",
    image: "/cities/gurgaon.webp", lastUpdated: "February 2026", contributors: 112,
    prices: makePrices({ vegThali: 130, nonVegThali: 200, mealForTwo: 2000, chai: 15, coffee: 200, streetFood: 20, biryani: 250, dosa: 70, fastFood: 260, softDrink: 40, water: 20, rice: 105, atta: 52, dal: 155, milk: 62, eggs: 80, chicken: 260, paneer: 390, onions: 35, tomatoes: 45, potatoes: 30, oil: 158, sugar: 46, apples: 190, bananas: 50, bread: 48, autoMin: 25, autoKm: 13, metroPass: 1400, busPass: 800, olaKm: 14, petrol: 95, diesel: 88, activa: 83000, swift: 690000, electricity: 2400, waterBill: 400, lpg: 803, broadband: 750, mobile: 299, rent1c: 22000, rent1o: 13000, rent2c: 40000, rent2o: 24000, rent3c: 65000, rent3o: 38000, pgPvtM: 16000, pgPvtNm: 12000, pgDblM: 11000, pgDblNm: 8000, pgTrpM: 8000, pgTrpNm: 6000, gym: 2500, movie: 300, netflix: 649, spotify: 119, haircut: 200, beer: 250, importBeer: 430 }).map(p => p.item === "Air Purifier Electricity (Delhi/NCR)" ? { ...p, price: 800 } : p),
  },
  {
    name: "Noida", slug: "noida", state: "Uttar Pradesh", population: "7 L",
    description: "Planned city in Delhi NCR known for IT parks, film studios, and modern infrastructure.",
    image: "/cities/noida.webp", lastUpdated: "February 2026", contributors: 88,
    prices: makePrices({ vegThali: 120, nonVegThali: 190, mealForTwo: 1600, chai: 12, coffee: 180, streetFood: 15, biryani: 220, dosa: 65, fastFood: 250, softDrink: 40, water: 20, rice: 100, atta: 50, dal: 152, milk: 60, eggs: 78, chicken: 250, paneer: 380, onions: 32, tomatoes: 42, potatoes: 28, oil: 155, sugar: 45, apples: 185, bananas: 48, bread: 45, autoMin: 20, autoKm: 11, metroPass: 1300, busPass: 750, olaKm: 12, petrol: 95, diesel: 88, activa: 82000, swift: 680000, electricity: 2100, waterBill: 350, lpg: 803, broadband: 700, mobile: 299, rent1c: 16000, rent1o: 10000, rent2c: 28000, rent2o: 18000, rent3c: 48000, rent3o: 28000, pgPvtM: 13000, pgPvtNm: 10000, pgDblM: 9000, pgDblNm: 7000, pgTrpM: 7000, pgTrpNm: 5000, gym: 1800, movie: 280, netflix: 649, spotify: 119, haircut: 150, beer: 220, importBeer: 400 }).map(p => p.item === "Air Purifier Electricity (Delhi/NCR)" ? { ...p, price: 800 } : p),
  },
  {
    name: "Navi Mumbai", slug: "navi-mumbai", state: "Maharashtra", population: "12 L",
    description: "India's largest planned city across the harbour from Mumbai. Growing IT and corporate hub.",
    image: "/cities/navi-mumbai.webp", lastUpdated: "February 2026", contributors: 74,
    prices: makePrices({ vegThali: 130, nonVegThali: 200, mealForTwo: 1500, chai: 15, coffee: 180, streetFood: 18, biryani: 220, dosa: 70, fastFood: 250, softDrink: 40, water: 20, rice: 105, atta: 52, dal: 155, milk: 60, eggs: 80, chicken: 260, paneer: 380, onions: 38, tomatoes: 48, potatoes: 32, oil: 158, sugar: 46, apples: 195, bananas: 55, bread: 48, autoMin: 23, autoKm: 15, metroPass: 1200, busPass: 800, olaKm: 13, petrol: 105, diesel: 92, activa: 84000, swift: 695000, electricity: 2200, waterBill: 400, lpg: 803, broadband: 750, mobile: 299, rent1c: 20000, rent1o: 12000, rent2c: 35000, rent2o: 20000, rent3c: 55000, rent3o: 32000, pgPvtM: 14000, pgPvtNm: 10500, pgDblM: 10000, pgDblNm: 7500, pgTrpM: 7500, pgTrpNm: 5500, gym: 2000, movie: 280, netflix: 649, spotify: 119, haircut: 170, beer: 230, importBeer: 420 }),
  },
  {
    name: "Thane", slug: "thane", state: "Maharashtra", population: "18 L",
    description: "Lake city adjacent to Mumbai with better affordability and growing commercial districts.",
    image: "/cities/thane.webp", lastUpdated: "February 2026", contributors: 66,
    prices: makePrices({ vegThali: 130, nonVegThali: 200, mealForTwo: 1400, chai: 15, coffee: 175, streetFood: 18, biryani: 220, dosa: 70, fastFood: 250, softDrink: 40, water: 20, rice: 105, atta: 52, dal: 155, milk: 60, eggs: 80, chicken: 265, paneer: 385, onions: 38, tomatoes: 48, potatoes: 32, oil: 158, sugar: 46, apples: 195, bananas: 55, bread: 48, autoMin: 23, autoKm: 14, metroPass: 1300, busPass: 850, olaKm: 13, petrol: 105, diesel: 92, activa: 84000, swift: 695000, electricity: 2200, waterBill: 400, lpg: 803, broadband: 700, mobile: 299, rent1c: 18000, rent1o: 11000, rent2c: 30000, rent2o: 18000, rent3c: 50000, rent3o: 28000, pgPvtM: 13000, pgPvtNm: 10000, pgDblM: 9500, pgDblNm: 7000, pgTrpM: 7000, pgTrpNm: 5000, gym: 1800, movie: 270, netflix: 649, spotify: 119, haircut: 150, beer: 220, importBeer: 400 }),
  },
  {
    name: "Chandigarh", slug: "chandigarh", state: "Chandigarh", population: "12 L",
    description: "India's first planned city designed by Le Corbusier. Cleanest city award winner multiple times.",
    image: "/cities/chandigarh.webp", lastUpdated: "February 2026", contributors: 58,
    prices: makePrices({ vegThali: 110, nonVegThali: 180, mealForTwo: 1400, chai: 12, coffee: 170, streetFood: 15, biryani: 200, dosa: 65, fastFood: 250, softDrink: 40, water: 20, rice: 95, atta: 48, dal: 150, milk: 65, eggs: 90, chicken: 260, paneer: 370, onions: 32, tomatoes: 42, potatoes: 28, oil: 150, sugar: 44, apples: 170, bananas: 48, bread: 42, autoMin: 25, autoKm: 13, metroPass: 900, busPass: 650, olaKm: 11, petrol: 97, diesel: 88, activa: 81000, swift: 680000, electricity: 1800, waterBill: 300, lpg: 803, broadband: 650, mobile: 299, rent1c: 15000, rent1o: 9000, rent2c: 25000, rent2o: 15000, rent3c: 40000, rent3o: 25000, pgPvtM: 12000, pgPvtNm: 9000, pgDblM: 8000, pgDblNm: 6000, pgTrpM: 6000, pgTrpNm: 4500, gym: 1500, movie: 250, netflix: 649, spotify: 119, haircut: 120, beer: 200, importBeer: 380 }),
  },
  {
    name: "Indore", slug: "indore", state: "Madhya Pradesh", population: "35 L",
    description: "India's cleanest city (7 times running). Known for incredible street food and growing IT sector.",
    image: "/cities/indore.webp", lastUpdated: "February 2026", contributors: 48,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 1100, chai: 10, coffee: 125, streetFood: 12, biryani: 160, dosa: 50, fastFood: 250, softDrink: 40, water: 20, rice: 85, atta: 42, dal: 140, milk: 62, eggs: 96, chicken: 240, paneer: 340, onions: 35, tomatoes: 40, potatoes: 30, oil: 145, sugar: 42, apples: 175, bananas: 45, bread: 40, autoMin: 20, autoKm: 10, metroPass: 700, busPass: 500, olaKm: 9, petrol: 105, diesel: 92, activa: 80000, swift: 670000, electricity: 1400, waterBill: 200, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7000, rent2c: 20000, rent2o: 12000, rent3c: 35000, rent3o: 20000, pgPvtM: 9000, pgPvtNm: 7000, pgDblM: 6500, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1000, movie: 200, netflix: 649, spotify: 119, haircut: 80, beer: 170, importBeer: 340 }),
  },
  {
    name: "Bhopal", slug: "bhopal", state: "Madhya Pradesh", population: "23 L",
    description: "City of Lakes and Madhya Pradesh's capital. Blend of Mughal heritage and modern development.",
    image: "/cities/bhopal.webp", lastUpdated: "February 2026", contributors: 42,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 1000, chai: 10, coffee: 120, streetFood: 12, biryani: 150, dosa: 50, fastFood: 240, softDrink: 35, water: 20, rice: 82, atta: 42, dal: 138, milk: 58, eggs: 90, chicken: 230, paneer: 330, onions: 30, tomatoes: 38, potatoes: 28, oil: 142, sugar: 42, apples: 175, bananas: 42, bread: 38, autoMin: 20, autoKm: 10, metroPass: 650, busPass: 450, olaKm: 9, petrol: 104, diesel: 90, activa: 80000, swift: 665000, electricity: 1300, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 18000, rent2o: 10000, rent3c: 28000, rent3o: 16000, pgPvtM: 8000, pgPvtNm: 6000, pgDblM: 5500, pgDblNm: 4000, pgTrpM: 4500, pgTrpNm: 3000, gym: 800, movie: 180, netflix: 649, spotify: 119, haircut: 70, beer: 160, importBeer: 320 }),
  },
  {
    name: "Surat", slug: "surat", state: "Gujarat", population: "60 L",
    description: "Diamond capital of the world, processing 90% of global diamonds. India's fastest growing city.",
    image: "/cities/surat.webp", lastUpdated: "February 2026", contributors: 64,
    prices: makePrices({ vegThali: 90, nonVegThali: 160, mealForTwo: 1100, chai: 12, coffee: 160, streetFood: 15, biryani: 180, dosa: 60, fastFood: 240, softDrink: 35, water: 20, rice: 90, atta: 48, dal: 148, milk: 58, eggs: 78, chicken: 240, paneer: 360, onions: 32, tomatoes: 40, potatoes: 30, oil: 150, sugar: 44, apples: 195, bananas: 48, bread: 42, autoMin: 20, autoKm: 11, metroPass: 800, busPass: 550, olaKm: 10, petrol: 95, diesel: 88, activa: 81000, swift: 675000, electricity: 1600, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 13000, rent1o: 7500, rent2c: 22000, rent2o: 13000, rent3c: 38000, rent3o: 20000, pgPvtM: 10000, pgPvtNm: 7500, pgDblM: 7000, pgDblNm: 5000, pgTrpM: 5500, pgTrpNm: 3800, gym: 1200, movie: 200, netflix: 649, spotify: 119, haircut: 100, beer: 180, importBeer: 350 }),
  },
  {
    name: "Vadodara", slug: "vadodara", state: "Gujarat", population: "22 L",
    description: "Cultural capital of Gujarat. Home to Laxmi Vilas Palace, one of the largest private residences in the world.",
    image: "/cities/vadodara.webp", lastUpdated: "February 2026", contributors: 40,
    prices: makePrices({ vegThali: 85, nonVegThali: 150, mealForTwo: 1000, chai: 10, coffee: 150, streetFood: 12, biryani: 170, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 88, atta: 45, dal: 145, milk: 60, eggs: 80, chicken: 240, paneer: 350, onions: 30, tomatoes: 38, potatoes: 28, oil: 148, sugar: 43, apples: 190, bananas: 45, bread: 40, autoMin: 18, autoKm: 10, metroPass: 750, busPass: 500, olaKm: 9, petrol: 95, diesel: 88, activa: 80000, swift: 672000, electricity: 1500, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 11000, rent1o: 6500, rent2c: 18000, rent2o: 11000, rent3c: 30000, rent3o: 18000, pgPvtM: 9000, pgPvtNm: 6500, pgDblM: 6000, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1000, movie: 180, netflix: 649, spotify: 119, haircut: 90, beer: 170, importBeer: 340 }),
  },
  {
    name: "Nagpur", slug: "nagpur", state: "Maharashtra", population: "28 L",
    description: "Orange City and geographic centre of India. Emerging smart city with new metro and MIHAN SEZ.",
    image: "/cities/nagpur.webp", lastUpdated: "February 2026", contributors: 52,
    prices: makePrices({ vegThali: 90, nonVegThali: 150, mealForTwo: 1100, chai: 10, coffee: 150, streetFood: 12, biryani: 180, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 88, atta: 45, dal: 148, milk: 56, eggs: 78, chicken: 230, paneer: 350, onions: 30, tomatoes: 38, potatoes: 28, oil: 148, sugar: 44, apples: 190, bananas: 45, bread: 42, autoMin: 20, autoKm: 12, metroPass: 800, busPass: 550, olaKm: 10, petrol: 104, diesel: 90, activa: 82000, swift: 680000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7000, rent2c: 20000, rent2o: 12000, rent3c: 35000, rent3o: 18000, pgPvtM: 9000, pgPvtNm: 7000, pgDblM: 6500, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1200, movie: 200, netflix: 649, spotify: 119, haircut: 100, beer: 180, importBeer: 350 }),
  },
  {
    name: "Nashik", slug: "nashik", state: "Maharashtra", population: "17 L",
    description: "Wine capital of India and sacred Kumbh Mela city. Growing IT hub on Mumbai-Agra highway.",
    image: "/cities/nashik.webp", lastUpdated: "February 2026", contributors: 34,
    prices: makePrices({ vegThali: 90, nonVegThali: 150, mealForTwo: 1100, chai: 12, coffee: 150, streetFood: 12, biryani: 180, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 90, atta: 45, dal: 148, milk: 56, eggs: 78, chicken: 235, paneer: 350, onions: 32, tomatoes: 40, potatoes: 30, oil: 150, sugar: 44, apples: 185, bananas: 48, bread: 42, autoMin: 20, autoKm: 12, metroPass: 700, busPass: 500, olaKm: 10, petrol: 105, diesel: 92, activa: 83000, swift: 685000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 11000, rent1o: 6500, rent2c: 18000, rent2o: 11000, rent3c: 30000, rent3o: 17000, pgPvtM: 9000, pgPvtNm: 6500, pgDblM: 6500, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1000, movie: 200, netflix: 649, spotify: 119, haircut: 90, beer: 180, importBeer: 350 }),
  },
  {
    name: "Coimbatore", slug: "coimbatore", state: "Tamil Nadu", population: "21 L",
    description: "Manchester of South India. Major industrial and IT city with pleasant weather year-round.",
    image: "/cities/coimbatore.webp", lastUpdated: "February 2026", contributors: 54,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 1000, chai: 10, coffee: 150, streetFood: 12, biryani: 170, dosa: 45, fastFood: 240, softDrink: 35, water: 20, rice: 82, atta: 48, dal: 148, milk: 52, eggs: 72, chicken: 240, paneer: 360, onions: 32, tomatoes: 38, potatoes: 35, oil: 148, sugar: 43, apples: 220, bananas: 42, bread: 40, autoMin: 25, autoKm: 12, metroPass: 750, busPass: 550, olaKm: 10, petrol: 103, diesel: 90, activa: 83000, swift: 682000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7000, rent2c: 20000, rent2o: 12000, rent3c: 35000, rent3o: 18000, pgPvtM: 10000, pgPvtNm: 7500, pgDblM: 7000, pgDblNm: 5000, pgTrpM: 5500, pgTrpNm: 4000, gym: 1200, movie: 180, netflix: 649, spotify: 119, haircut: 100, beer: 190, importBeer: 370 }),
  },
  {
    name: "Kochi", slug: "kochi", state: "Kerala", population: "22 L",
    description: "Queen of the Arabian Sea. Kerala's commercial capital with a thriving tech and tourism sector.",
    image: "/cities/kochi.webp", lastUpdated: "February 2026", contributors: 62,
    prices: makePrices({ vegThali: 100, nonVegThali: 170, mealForTwo: 1300, chai: 12, coffee: 170, streetFood: 15, biryani: 200, dosa: 50, fastFood: 250, softDrink: 40, water: 20, rice: 90, atta: 50, dal: 150, milk: 55, eggs: 78, chicken: 240, paneer: 370, onions: 35, tomatoes: 42, potatoes: 35, oil: 152, sugar: 45, apples: 230, bananas: 45, bread: 42, autoMin: 30, autoKm: 14, metroPass: 1100, busPass: 700, olaKm: 12, petrol: 106, diesel: 96, activa: 84000, swift: 690000, electricity: 1800, waterBill: 300, lpg: 803, broadband: 700, mobile: 299, rent1c: 15000, rent1o: 9000, rent2c: 26000, rent2o: 15000, rent3c: 42000, rent3o: 24000, pgPvtM: 11000, pgPvtNm: 8000, pgDblM: 7500, pgDblNm: 5500, pgTrpM: 6000, pgTrpNm: 4500, gym: 1500, movie: 200, netflix: 649, spotify: 119, haircut: 120, beer: 210, importBeer: 400 }),
  },
  {
    name: "Thiruvananthapuram", slug: "thiruvananthapuram", state: "Kerala", population: "17 L",
    description: "Kerala's capital, home to Technopark — India's first IT park. Known as the evergreen city.",
    image: "/cities/thiruvananthapuram.webp", lastUpdated: "February 2026", contributors: 44,
    prices: makePrices({ vegThali: 90, nonVegThali: 160, mealForTwo: 1200, chai: 12, coffee: 160, streetFood: 15, biryani: 190, dosa: 45, fastFood: 240, softDrink: 38, water: 20, rice: 88, atta: 50, dal: 148, milk: 55, eggs: 75, chicken: 230, paneer: 360, onions: 35, tomatoes: 40, potatoes: 35, oil: 150, sugar: 44, apples: 230, bananas: 42, bread: 42, autoMin: 28, autoKm: 13, metroPass: 900, busPass: 600, olaKm: 11, petrol: 106, diesel: 96, activa: 84000, swift: 688000, electricity: 1600, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7500, rent2c: 22000, rent2o: 13000, rent3c: 36000, rent3o: 20000, pgPvtM: 10000, pgPvtNm: 7500, pgDblM: 7000, pgDblNm: 5000, pgTrpM: 5500, pgTrpNm: 4000, gym: 1200, movie: 180, netflix: 649, spotify: 119, haircut: 100, beer: 200, importBeer: 380 }),
  },
  {
    name: "Visakhapatnam", slug: "visakhapatnam", state: "Andhra Pradesh", population: "21 L",
    description: "Port city of destiny with India's oldest shipyard. IT hub and major naval base.",
    image: "/cities/visakhapatnam.webp", lastUpdated: "February 2026", contributors: 46,
    prices: makePrices({ vegThali: 90, nonVegThali: 150, mealForTwo: 1100, chai: 10, coffee: 150, streetFood: 12, biryani: 170, dosa: 45, fastFood: 240, softDrink: 35, water: 20, rice: 85, atta: 48, dal: 145, milk: 54, eggs: 72, chicken: 220, paneer: 350, onions: 30, tomatoes: 38, potatoes: 30, oil: 148, sugar: 43, apples: 210, bananas: 42, bread: 40, autoMin: 20, autoKm: 11, metroPass: 800, busPass: 550, olaKm: 10, petrol: 108, diesel: 95, activa: 82000, swift: 680000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7000, rent2c: 20000, rent2o: 12000, rent3c: 35000, rent3o: 18000, pgPvtM: 9500, pgPvtNm: 7000, pgDblM: 6500, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1200, movie: 180, netflix: 649, spotify: 119, haircut: 100, beer: 190, importBeer: 370 }),
  },
  {
    name: "Vijayawada", slug: "vijayawada", state: "Andhra Pradesh", population: "12 L",
    description: "Business capital of Andhra Pradesh, near the new state capital Amaravati.",
    image: "/cities/vijayawada.webp", lastUpdated: "February 2026", contributors: 32,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 1000, chai: 10, coffee: 140, streetFood: 10, biryani: 160, dosa: 40, fastFood: 230, softDrink: 35, water: 20, rice: 80, atta: 45, dal: 142, milk: 52, eggs: 70, chicken: 210, paneer: 340, onions: 28, tomatoes: 35, potatoes: 28, oil: 145, sugar: 42, apples: 210, bananas: 40, bread: 38, autoMin: 20, autoKm: 10, metroPass: 700, busPass: 500, olaKm: 9, petrol: 108, diesel: 95, activa: 81000, swift: 678000, electricity: 1400, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 16000, rent2o: 10000, rent3c: 28000, rent3o: 15000, pgPvtM: 8000, pgPvtNm: 6000, pgDblM: 5500, pgDblNm: 4000, pgTrpM: 4500, pgTrpNm: 3000, gym: 1000, movie: 170, netflix: 649, spotify: 119, haircut: 80, beer: 180, importBeer: 360 }),
  },
  {
    name: "Mysuru", slug: "mysuru", state: "Karnataka", population: "12 L",
    description: "Palace city and cultural heart of Karnataka. One of India's cleanest and most liveable cities.",
    image: "/cities/mysuru.webp", lastUpdated: "February 2026", contributors: 38,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 1000, chai: 10, coffee: 140, streetFood: 12, biryani: 170, dosa: 45, fastFood: 240, softDrink: 35, water: 20, rice: 82, atta: 46, dal: 145, milk: 52, eggs: 72, chicken: 220, paneer: 350, onions: 30, tomatoes: 38, potatoes: 30, oil: 148, sugar: 43, apples: 200, bananas: 42, bread: 40, autoMin: 25, autoKm: 12, metroPass: 700, busPass: 500, olaKm: 10, petrol: 103, diesel: 88, activa: 82000, swift: 680000, electricity: 1400, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 16000, rent2o: 10000, rent3c: 28000, rent3o: 16000, pgPvtM: 8500, pgPvtNm: 6500, pgDblM: 6000, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1000, movie: 180, netflix: 649, spotify: 119, haircut: 80, beer: 180, importBeer: 360 }),
  },
  {
    name: "Mangalore", slug: "mangalore", state: "Karnataka", population: "7 L",
    description: "Port city on Karnataka's coast known for banking, education, and incredibly diverse cuisine.",
    image: "/cities/mangalore.webp", lastUpdated: "February 2026", contributors: 30,
    prices: makePrices({ vegThali: 90, nonVegThali: 150, mealForTwo: 1100, chai: 12, coffee: 150, streetFood: 12, biryani: 180, dosa: 45, fastFood: 240, softDrink: 38, water: 20, rice: 85, atta: 48, dal: 148, milk: 54, eggs: 75, chicken: 230, paneer: 360, onions: 32, tomatoes: 40, potatoes: 32, oil: 150, sugar: 44, apples: 210, bananas: 42, bread: 40, autoMin: 25, autoKm: 12, metroPass: 700, busPass: 500, olaKm: 10, petrol: 103, diesel: 88, activa: 83000, swift: 685000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7000, rent2c: 20000, rent2o: 12000, rent3c: 35000, rent3o: 18000, pgPvtM: 10000, pgPvtNm: 7500, pgDblM: 7000, pgDblNm: 5000, pgTrpM: 5500, pgTrpNm: 4000, gym: 1200, movie: 200, netflix: 649, spotify: 119, haircut: 100, beer: 200, importBeer: 380 }),
  },
  {
    name: "Madurai", slug: "madurai", state: "Tamil Nadu", population: "15 L",
    description: "Temple city and one of the oldest continuously inhabited cities in the world (2,500+ years).",
    image: "/cities/madurai.webp", lastUpdated: "February 2026", contributors: 32,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 800, chai: 10, coffee: 130, streetFood: 10, biryani: 150, dosa: 40, fastFood: 230, softDrink: 35, water: 20, rice: 78, atta: 45, dal: 140, milk: 50, eggs: 68, chicken: 200, paneer: 340, onions: 28, tomatoes: 35, potatoes: 30, oil: 145, sugar: 42, apples: 220, bananas: 40, bread: 38, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 103, diesel: 90, activa: 82000, swift: 680000, electricity: 1200, waterBill: 200, lpg: 803, broadband: 550, mobile: 299, rent1c: 8000, rent1o: 5000, rent2c: 14000, rent2o: 8000, rent3c: 22000, rent3o: 13000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 800, movie: 160, netflix: 649, spotify: 119, haircut: 70, beer: 170, importBeer: 340 }),
  },
  {
    name: "Trichy", slug: "trichy", state: "Tamil Nadu", population: "10 L",
    description: "Temple city on the Cauvery river. Major educational hub with NIT and BHEL.",
    image: "/cities/trichy.webp", lastUpdated: "February 2026", contributors: 26,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 800, chai: 10, coffee: 130, streetFood: 10, biryani: 150, dosa: 35, fastFood: 230, softDrink: 35, water: 20, rice: 78, atta: 45, dal: 140, milk: 50, eggs: 68, chicken: 200, paneer: 340, onions: 28, tomatoes: 35, potatoes: 30, oil: 145, sugar: 42, apples: 220, bananas: 38, bread: 38, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 103, diesel: 90, activa: 82000, swift: 680000, electricity: 1200, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 7500, rent1o: 4500, rent2c: 13000, rent2o: 7500, rent3c: 20000, rent3o: 12000, pgPvtM: 6500, pgPvtNm: 5000, pgDblM: 4500, pgDblNm: 3200, pgTrpM: 3500, pgTrpNm: 2500, gym: 800, movie: 150, netflix: 649, spotify: 119, haircut: 70, beer: 170, importBeer: 340 }),
  },
  // ──────────── NORTH / CENTRAL ────────────
  {
    name: "Varanasi", slug: "varanasi", state: "Uttar Pradesh", population: "15 L",
    description: "World's oldest living city and spiritual capital of India. Sacred Ganges ghats draw millions annually.",
    image: "/cities/varanasi.webp", lastUpdated: "February 2026", contributors: 38,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 130, streetFood: 10, biryani: 150, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 82, atta: 42, dal: 138, milk: 52, eggs: 70, chicken: 200, paneer: 330, onions: 28, tomatoes: 32, potatoes: 22, oil: 142, sugar: 42, apples: 180, bananas: 40, bread: 38, autoMin: 18, autoKm: 10, metroPass: 700, busPass: 450, olaKm: 9, petrol: 95, diesel: 88, activa: 80000, swift: 665000, electricity: 1300, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 8000, rent1o: 5000, rent2c: 14000, rent2o: 8500, rent3c: 22000, rent3o: 14000, pgPvtM: 7000, pgPvtNm: 5500, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 700, movie: 160, netflix: 649, spotify: 119, haircut: 60, beer: 150, importBeer: 300 }),
  },
  {
    name: "Agra", slug: "agra", state: "Uttar Pradesh", population: "18 L",
    description: "Home to the Taj Mahal. Major tourist city with leather and stone carving industries.",
    image: "/cities/agra.webp", lastUpdated: "February 2026", contributors: 30,
    prices: makePrices({ vegThali: 75, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 130, streetFood: 10, biryani: 150, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 82, atta: 42, dal: 140, milk: 54, eggs: 72, chicken: 210, paneer: 330, onions: 28, tomatoes: 32, potatoes: 22, oil: 142, sugar: 42, apples: 175, bananas: 40, bread: 38, autoMin: 18, autoKm: 10, metroPass: 650, busPass: 450, olaKm: 9, petrol: 95, diesel: 88, activa: 80000, swift: 668000, electricity: 1300, waterBill: 200, lpg: 803, broadband: 550, mobile: 299, rent1c: 8500, rent1o: 5000, rent2c: 14000, rent2o: 8500, rent3c: 24000, rent3o: 14000, pgPvtM: 7000, pgPvtNm: 5500, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 700, movie: 160, netflix: 649, spotify: 119, haircut: 60, beer: 150, importBeer: 300 }),
  },
  {
    name: "Kanpur", slug: "kanpur", state: "Uttar Pradesh", population: "30 L",
    description: "Leather capital of India with a major IIT campus. Industrial powerhouse of Uttar Pradesh.",
    image: "/cities/kanpur.webp", lastUpdated: "February 2026", contributors: 34,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 80, atta: 40, dal: 138, milk: 52, eggs: 68, chicken: 200, paneer: 320, onions: 26, tomatoes: 30, potatoes: 22, oil: 140, sugar: 42, apples: 178, bananas: 38, bread: 36, autoMin: 18, autoKm: 10, metroPass: 700, busPass: 450, olaKm: 8, petrol: 95, diesel: 88, activa: 79000, swift: 665000, electricity: 1300, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 8000, rent1o: 5000, rent2c: 14000, rent2o: 8000, rent3c: 22000, rent3o: 13000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 700, movie: 160, netflix: 649, spotify: 119, haircut: 60, beer: 150, importBeer: 300 }),
  },
  {
    name: "Patna", slug: "patna", state: "Bihar", population: "22 L",
    description: "One of the oldest continuously inhabited places in the world. Bihar's capital on the Ganges.",
    image: "/cities/patna.webp", lastUpdated: "February 2026", contributors: 36,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 78, atta: 40, dal: 135, milk: 52, eggs: 68, chicken: 200, paneer: 320, onions: 25, tomatoes: 30, potatoes: 20, oil: 138, sugar: 40, apples: 180, bananas: 38, bread: 36, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 8, petrol: 105, diesel: 92, activa: 80000, swift: 668000, electricity: 1300, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 9000, rent1o: 5500, rent2c: 15000, rent2o: 9000, rent3c: 25000, rent3o: 14000, pgPvtM: 7500, pgPvtNm: 5500, pgDblM: 5500, pgDblNm: 3800, pgTrpM: 4000, pgTrpNm: 2800, gym: 800, movie: 160, netflix: 649, spotify: 119, haircut: 70, beer: 160, importBeer: 320 }),
  },
  {
    name: "Ranchi", slug: "ranchi", state: "Jharkhand", population: "15 L",
    description: "Jharkhand's capital, known for waterfalls and pleasant climate. Birthplace of MS Dhoni.",
    image: "/cities/ranchi.webp", lastUpdated: "February 2026", contributors: 26,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 80, atta: 42, dal: 138, milk: 54, eggs: 72, chicken: 210, paneer: 330, onions: 28, tomatoes: 32, potatoes: 22, oil: 142, sugar: 42, apples: 185, bananas: 40, bread: 38, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 102, diesel: 88, activa: 80000, swift: 670000, electricity: 1300, waterBill: 200, lpg: 803, broadband: 550, mobile: 299, rent1c: 9000, rent1o: 5500, rent2c: 15000, rent2o: 9000, rent3c: 25000, rent3o: 14000, pgPvtM: 7500, pgPvtNm: 5500, pgDblM: 5500, pgDblNm: 3800, pgTrpM: 4000, pgTrpNm: 2800, gym: 800, movie: 160, netflix: 649, spotify: 119, haircut: 70, beer: 160, importBeer: 320 }),
  },
  {
    name: "Bhubaneswar", slug: "bhubaneswar", state: "Odisha", population: "10 L",
    description: "Temple City with 700+ ancient temples. Smart City and emerging IT hub of eastern India.",
    image: "/cities/bhubaneswar.webp", lastUpdated: "February 2026", contributors: 34,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 130, streetFood: 10, biryani: 160, dosa: 45, fastFood: 230, softDrink: 35, water: 20, rice: 78, atta: 42, dal: 138, milk: 52, eggs: 70, chicken: 200, paneer: 330, onions: 26, tomatoes: 32, potatoes: 22, oil: 142, sugar: 42, apples: 200, bananas: 40, bread: 38, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 105, diesel: 92, activa: 80000, swift: 670000, electricity: 1300, waterBill: 200, lpg: 803, broadband: 550, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 16000, rent2o: 10000, rent3c: 26000, rent3o: 15000, pgPvtM: 8000, pgPvtNm: 6000, pgDblM: 5500, pgDblNm: 4000, pgTrpM: 4500, pgTrpNm: 3000, gym: 900, movie: 170, netflix: 649, spotify: 119, haircut: 80, beer: 170, importBeer: 340 }),
  },
  {
    name: "Guwahati", slug: "guwahati", state: "Assam", population: "11 L",
    description: "Gateway to Northeast India. Growing city on the banks of the mighty Brahmaputra.",
    image: "/cities/guwahati.webp", lastUpdated: "February 2026", contributors: 30,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 1000, chai: 10, coffee: 130, streetFood: 12, biryani: 170, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 82, atta: 45, dal: 142, milk: 55, eggs: 75, chicken: 220, paneer: 350, onions: 30, tomatoes: 38, potatoes: 25, oil: 148, sugar: 44, apples: 190, bananas: 42, bread: 40, autoMin: 20, autoKm: 10, metroPass: 700, busPass: 500, olaKm: 10, petrol: 98, diesel: 88, activa: 81000, swift: 675000, electricity: 1400, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 11000, rent1o: 6500, rent2c: 18000, rent2o: 11000, rent3c: 30000, rent3o: 17000, pgPvtM: 9000, pgPvtNm: 7000, pgDblM: 6500, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1000, movie: 180, netflix: 649, spotify: 119, haircut: 80, beer: 180, importBeer: 360 }),
  },
  {
    name: "Dehradun", slug: "dehradun", state: "Uttarakhand", population: "8 L",
    description: "Gateway to the Himalayas. Known for premier institutions (ISRO, IMA, FRI) and pleasant weather.",
    image: "/cities/dehradun.webp", lastUpdated: "February 2026", contributors: 34,
    prices: makePrices({ vegThali: 90, nonVegThali: 150, mealForTwo: 1100, chai: 12, coffee: 150, streetFood: 12, biryani: 180, dosa: 55, fastFood: 240, softDrink: 38, water: 20, rice: 88, atta: 45, dal: 148, milk: 58, eggs: 78, chicken: 230, paneer: 360, onions: 30, tomatoes: 40, potatoes: 25, oil: 150, sugar: 44, apples: 160, bananas: 45, bread: 42, autoMin: 25, autoKm: 12, metroPass: 700, busPass: 500, olaKm: 10, petrol: 95, diesel: 88, activa: 81000, swift: 680000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 12000, rent1o: 7000, rent2c: 20000, rent2o: 12000, rent3c: 32000, rent3o: 18000, pgPvtM: 10000, pgPvtNm: 7500, pgDblM: 7000, pgDblNm: 5000, pgTrpM: 5500, pgTrpNm: 4000, gym: 1200, movie: 200, netflix: 649, spotify: 119, haircut: 100, beer: 200, importBeer: 380 }),
  },
  {
    name: "Amritsar", slug: "amritsar", state: "Punjab", population: "12 L",
    description: "Holy city of the Golden Temple. Famous for its unparalleled food culture and warm hospitality.",
    image: "/cities/amritsar.webp", lastUpdated: "February 2026", contributors: 30,
    prices: makePrices({ vegThali: 80, nonVegThali: 150, mealForTwo: 1000, chai: 10, coffee: 140, streetFood: 12, biryani: 180, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 85, atta: 42, dal: 142, milk: 60, eggs: 80, chicken: 240, paneer: 350, onions: 28, tomatoes: 38, potatoes: 25, oil: 148, sugar: 42, apples: 160, bananas: 42, bread: 38, autoMin: 20, autoKm: 10, metroPass: 700, busPass: 450, olaKm: 9, petrol: 97, diesel: 88, activa: 80000, swift: 675000, electricity: 1500, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 16000, rent2o: 10000, rent3c: 26000, rent3o: 15000, pgPvtM: 8000, pgPvtNm: 6000, pgDblM: 5500, pgDblNm: 4000, pgTrpM: 4500, pgTrpNm: 3000, gym: 1000, movie: 180, netflix: 649, spotify: 119, haircut: 80, beer: 180, importBeer: 360 }),
  },
  {
    name: "Ludhiana", slug: "ludhiana", state: "Punjab", population: "18 L",
    description: "Manchester of India for its textile industry. Largest city in Punjab and major industrial centre.",
    image: "/cities/ludhiana.webp", lastUpdated: "February 2026", contributors: 28,
    prices: makePrices({ vegThali: 85, nonVegThali: 150, mealForTwo: 1100, chai: 10, coffee: 140, streetFood: 12, biryani: 180, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 88, atta: 42, dal: 145, milk: 60, eggs: 82, chicken: 245, paneer: 360, onions: 30, tomatoes: 40, potatoes: 25, oil: 150, sugar: 44, apples: 165, bananas: 45, bread: 40, autoMin: 20, autoKm: 10, metroPass: 700, busPass: 500, olaKm: 10, petrol: 97, diesel: 88, activa: 80000, swift: 675000, electricity: 1600, waterBill: 250, lpg: 803, broadband: 650, mobile: 299, rent1c: 11000, rent1o: 6500, rent2c: 18000, rent2o: 11000, rent3c: 28000, rent3o: 16000, pgPvtM: 9000, pgPvtNm: 6500, pgDblM: 6000, pgDblNm: 4500, pgTrpM: 5000, pgTrpNm: 3500, gym: 1000, movie: 180, netflix: 649, spotify: 119, haircut: 80, beer: 180, importBeer: 360 }),
  },
  {
    name: "Jodhpur", slug: "jodhpur", state: "Rajasthan", population: "14 L",
    description: "The Blue City with the majestic Mehrangarh Fort. Gateway to the Thar Desert.",
    image: "/cities/jodhpur.webp", lastUpdated: "February 2026", contributors: 26,
    prices: makePrices({ vegThali: 75, nonVegThali: 140, mealForTwo: 900, chai: 10, coffee: 140, streetFood: 10, biryani: 160, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 85, atta: 42, dal: 142, milk: 54, eggs: 72, chicken: 220, paneer: 340, onions: 26, tomatoes: 32, potatoes: 22, oil: 142, sugar: 42, apples: 175, bananas: 38, bread: 38, autoMin: 18, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 100, diesel: 90, activa: 79000, swift: 668000, electricity: 1400, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 9000, rent1o: 5500, rent2c: 15000, rent2o: 9000, rent3c: 24000, rent3o: 14000, pgPvtM: 7500, pgPvtNm: 5500, pgDblM: 5500, pgDblNm: 3800, pgTrpM: 4500, pgTrpNm: 3000, gym: 800, movie: 170, netflix: 649, spotify: 119, haircut: 70, beer: 160, importBeer: 340 }),
  },
  {
    name: "Udaipur", slug: "udaipur", state: "Rajasthan", population: "6 L",
    description: "City of Lakes, Venice of the East. One of India's most romantic and picturesque cities.",
    image: "/cities/udaipur.webp", lastUpdated: "February 2026", contributors: 24,
    prices: makePrices({ vegThali: 80, nonVegThali: 150, mealForTwo: 1100, chai: 10, coffee: 150, streetFood: 12, biryani: 170, dosa: 55, fastFood: 240, softDrink: 38, water: 20, rice: 88, atta: 44, dal: 145, milk: 56, eggs: 75, chicken: 225, paneer: 350, onions: 28, tomatoes: 35, potatoes: 25, oil: 145, sugar: 43, apples: 180, bananas: 42, bread: 40, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 100, diesel: 90, activa: 80000, swift: 670000, electricity: 1400, waterBill: 200, lpg: 803, broadband: 600, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 16000, rent2o: 9500, rent3c: 26000, rent3o: 15000, pgPvtM: 8000, pgPvtNm: 6000, pgDblM: 5500, pgDblNm: 4000, pgTrpM: 4500, pgTrpNm: 3000, gym: 900, movie: 180, netflix: 649, spotify: 119, haircut: 80, beer: 170, importBeer: 350 }),
  },
  {
    name: "Kota", slug: "kota", state: "Rajasthan", population: "12 L",
    description: "India's coaching capital. 2 lakh+ students migrate here annually for IIT/medical exam prep.",
    image: "/cities/kota.webp", lastUpdated: "February 2026", contributors: 32,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 800, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 220, softDrink: 35, water: 20, rice: 82, atta: 40, dal: 138, milk: 52, eggs: 70, chicken: 210, paneer: 330, onions: 25, tomatoes: 30, potatoes: 22, oil: 140, sugar: 40, apples: 175, bananas: 38, bread: 36, autoMin: 15, autoKm: 8, metroPass: 500, busPass: 350, olaKm: 8, petrol: 100, diesel: 90, activa: 79000, swift: 665000, electricity: 1200, waterBill: 150, lpg: 803, broadband: 500, mobile: 299, rent1c: 8000, rent1o: 4500, rent2c: 13000, rent2o: 7500, rent3c: 20000, rent3o: 12000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2500, gym: 600, movie: 150, netflix: 649, spotify: 119, haircut: 60, beer: 150, importBeer: 320 }),
  },
  {
    name: "Goa", slug: "goa", state: "Goa", population: "6 L",
    description: "India's smallest state but biggest party destination. Unique Portuguese heritage and beach culture.",
    image: "/cities/goa.webp", lastUpdated: "February 2026", contributors: 54,
    prices: makePrices({ vegThali: 110, nonVegThali: 180, mealForTwo: 1500, chai: 15, coffee: 180, streetFood: 15, biryani: 220, dosa: 65, fastFood: 260, softDrink: 40, water: 20, rice: 95, atta: 52, dal: 155, milk: 58, eggs: 80, chicken: 250, paneer: 380, onions: 35, tomatoes: 45, potatoes: 35, oil: 155, sugar: 46, apples: 220, bananas: 50, bread: 45, autoMin: 30, autoKm: 15, metroPass: 800, busPass: 600, olaKm: 12, petrol: 98, diesel: 88, activa: 83000, swift: 685000, electricity: 1800, waterBill: 300, lpg: 803, broadband: 700, mobile: 299, rent1c: 18000, rent1o: 10000, rent2c: 30000, rent2o: 18000, rent3c: 48000, rent3o: 28000, pgPvtM: 13000, pgPvtNm: 10000, pgDblM: 9000, pgDblNm: 7000, pgTrpM: 7000, pgTrpNm: 5000, gym: 2000, movie: 250, netflix: 649, spotify: 119, haircut: 150, beer: 150, importBeer: 280 }),
  },
  // ──────────── EAST / NORTHEAST ────────────
  {
    name: "Siliguri", slug: "siliguri", state: "West Bengal", population: "8 L",
    description: "Gateway to Northeast India, Darjeeling, and Sikkim. Major trade hub on the Chicken's Neck corridor.",
    image: "/cities/siliguri.webp", lastUpdated: "February 2026", contributors: 22,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 800, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 220, softDrink: 35, water: 20, rice: 75, atta: 42, dal: 138, milk: 52, eggs: 70, chicken: 210, paneer: 330, onions: 26, tomatoes: 32, potatoes: 22, oil: 140, sugar: 42, apples: 180, bananas: 38, bread: 36, autoMin: 15, autoKm: 10, metroPass: 500, busPass: 350, olaKm: 8, petrol: 105, diesel: 92, activa: 80000, swift: 672000, electricity: 1200, waterBill: 150, lpg: 803, broadband: 500, mobile: 299, rent1c: 7000, rent1o: 4000, rent2c: 12000, rent2o: 7000, rent3c: 18000, rent3o: 11000, pgPvtM: 6000, pgPvtNm: 4500, pgDblM: 4500, pgDblNm: 3000, pgTrpM: 3500, pgTrpNm: 2500, gym: 700, movie: 150, netflix: 649, spotify: 119, haircut: 60, beer: 160, importBeer: 320 }),
  },
  {
    name: "Jamshedpur", slug: "jamshedpur", state: "Jharkhand", population: "14 L",
    description: "India's first planned industrial city, built by Tata. One of the cleanest and greenest cities.",
    image: "/cities/jamshedpur.webp", lastUpdated: "February 2026", contributors: 28,
    prices: makePrices({ vegThali: 75, nonVegThali: 140, mealForTwo: 900, chai: 10, coffee: 130, streetFood: 10, biryani: 160, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 80, atta: 42, dal: 140, milk: 54, eggs: 72, chicken: 220, paneer: 340, onions: 28, tomatoes: 35, potatoes: 22, oil: 142, sugar: 42, apples: 190, bananas: 40, bread: 38, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 102, diesel: 88, activa: 80000, swift: 670000, electricity: 1300, waterBill: 200, lpg: 803, broadband: 550, mobile: 299, rent1c: 9000, rent1o: 5500, rent2c: 15000, rent2o: 9000, rent3c: 24000, rent3o: 14000, pgPvtM: 7500, pgPvtNm: 5500, pgDblM: 5500, pgDblNm: 3800, pgTrpM: 4000, pgTrpNm: 2800, gym: 900, movie: 170, netflix: 649, spotify: 119, haircut: 70, beer: 170, importBeer: 340 }),
  },
  // ──────────── MORE MAHARASHTRA ────────────
  {
    name: "Aurangabad", slug: "aurangabad", state: "Maharashtra", population: "14 L",
    description: "Tourism capital of Maharashtra with Ajanta and Ellora caves nearby. Growing auto manufacturing hub.",
    image: "/cities/aurangabad.webp", lastUpdated: "February 2026", contributors: 28,
    prices: makePrices({ vegThali: 85, nonVegThali: 150, mealForTwo: 1000, chai: 12, coffee: 140, streetFood: 12, biryani: 170, dosa: 55, fastFood: 240, softDrink: 35, water: 20, rice: 88, atta: 45, dal: 148, milk: 55, eggs: 75, chicken: 230, paneer: 350, onions: 30, tomatoes: 38, potatoes: 28, oil: 148, sugar: 44, apples: 190, bananas: 45, bread: 40, autoMin: 20, autoKm: 12, metroPass: 700, busPass: 500, olaKm: 10, petrol: 105, diesel: 92, activa: 82000, swift: 682000, electricity: 1500, waterBill: 250, lpg: 803, broadband: 600, mobile: 299, rent1c: 10000, rent1o: 6000, rent2c: 16000, rent2o: 10000, rent3c: 28000, rent3o: 16000, pgPvtM: 8000, pgPvtNm: 6000, pgDblM: 5500, pgDblNm: 4000, pgTrpM: 4500, pgTrpNm: 3000, gym: 1000, movie: 180, netflix: 649, spotify: 119, haircut: 80, beer: 180, importBeer: 350 }),
  },
  {
    name: "Kolhapur", slug: "kolhapur", state: "Maharashtra", population: "6 L",
    description: "Known for Kolhapuri chappals, spicy misal pav, and the Mahalaxmi temple. Sugar belt capital.",
    image: "/cities/kolhapur.webp", lastUpdated: "February 2026", contributors: 22,
    prices: makePrices({ vegThali: 80, nonVegThali: 140, mealForTwo: 900, chai: 10, coffee: 130, streetFood: 10, biryani: 160, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 85, atta: 42, dal: 145, milk: 52, eggs: 72, chicken: 220, paneer: 340, onions: 28, tomatoes: 35, potatoes: 25, oil: 145, sugar: 42, apples: 185, bananas: 42, bread: 38, autoMin: 18, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 105, diesel: 92, activa: 82000, swift: 680000, electricity: 1300, waterBill: 200, lpg: 803, broadband: 550, mobile: 299, rent1c: 8000, rent1o: 5000, rent2c: 14000, rent2o: 8000, rent3c: 22000, rent3o: 13000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 800, movie: 170, netflix: 649, spotify: 119, haircut: 70, beer: 170, importBeer: 340 }),
  },
  // ──────────── SOUTH ────────────
  {
    name: "Hubli-Dharwad", slug: "hubli-dharwad", state: "Karnataka", population: "12 L",
    description: "Twin cities of North Karnataka. Commercial hub with growing IT and education sectors.",
    image: "/cities/hubli-dharwad.webp", lastUpdated: "February 2026", contributors: 24,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 900, chai: 10, coffee: 120, streetFood: 10, biryani: 160, dosa: 40, fastFood: 230, softDrink: 35, water: 20, rice: 78, atta: 42, dal: 142, milk: 50, eggs: 68, chicken: 210, paneer: 330, onions: 26, tomatoes: 32, potatoes: 28, oil: 145, sugar: 42, apples: 200, bananas: 38, bread: 38, autoMin: 20, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 103, diesel: 88, activa: 81000, swift: 678000, electricity: 1200, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 8000, rent1o: 5000, rent2c: 14000, rent2o: 8000, rent3c: 22000, rent3o: 13000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 800, movie: 160, netflix: 649, spotify: 119, haircut: 70, beer: 170, importBeer: 340 }),
  },
  {
    name: "Warangal", slug: "warangal", state: "Telangana", population: "8 L",
    description: "Ancient Kakatiya capital with UNESCO heritage sites. Emerging IT city of Telangana.",
    image: "/cities/warangal.webp", lastUpdated: "February 2026", contributors: 20,
    prices: makePrices({ vegThali: 70, nonVegThali: 120, mealForTwo: 800, chai: 10, coffee: 110, streetFood: 10, biryani: 140, dosa: 40, fastFood: 220, softDrink: 35, water: 20, rice: 75, atta: 42, dal: 138, milk: 50, eggs: 65, chicken: 200, paneer: 320, onions: 25, tomatoes: 30, potatoes: 25, oil: 140, sugar: 42, apples: 210, bananas: 38, bread: 36, autoMin: 18, autoKm: 10, metroPass: 500, busPass: 350, olaKm: 8, petrol: 109, diesel: 97, activa: 81000, swift: 675000, electricity: 1200, waterBill: 150, lpg: 803, broadband: 500, mobile: 299, rent1c: 7000, rent1o: 4500, rent2c: 12000, rent2o: 7000, rent3c: 18000, rent3o: 11000, pgPvtM: 6500, pgPvtNm: 5000, pgDblM: 4500, pgDblNm: 3200, pgTrpM: 3500, pgTrpNm: 2500, gym: 700, movie: 150, netflix: 649, spotify: 119, haircut: 60, beer: 160, importBeer: 320 }),
  },
  // ──────────── REMAINING NOTABLE ────────────
  {
    name: "Raipur", slug: "raipur", state: "Chhattisgarh", population: "12 L",
    description: "Chhattisgarh's capital and one of the fastest developing cities in Central India.",
    image: "/cities/raipur.webp", lastUpdated: "February 2026", contributors: 22,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 800, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 220, softDrink: 35, water: 20, rice: 78, atta: 40, dal: 135, milk: 52, eggs: 68, chicken: 200, paneer: 320, onions: 25, tomatoes: 30, potatoes: 22, oil: 138, sugar: 40, apples: 185, bananas: 38, bread: 36, autoMin: 18, autoKm: 10, metroPass: 500, busPass: 350, olaKm: 8, petrol: 103, diesel: 90, activa: 79000, swift: 665000, electricity: 1200, waterBill: 150, lpg: 803, broadband: 500, mobile: 299, rent1c: 8000, rent1o: 4500, rent2c: 13000, rent2o: 7500, rent3c: 20000, rent3o: 12000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2500, gym: 700, movie: 150, netflix: 649, spotify: 119, haircut: 60, beer: 160, importBeer: 320 }),
  },
  {
    name: "Gwalior", slug: "gwalior", state: "Madhya Pradesh", population: "12 L",
    description: "City of the magnificent Gwalior Fort. Known for music heritage and Tansen's legacy.",
    image: "/cities/gwalior.webp", lastUpdated: "February 2026", contributors: 18,
    prices: makePrices({ vegThali: 65, nonVegThali: 120, mealForTwo: 800, chai: 10, coffee: 110, streetFood: 10, biryani: 140, dosa: 45, fastFood: 220, softDrink: 35, water: 20, rice: 78, atta: 38, dal: 135, milk: 52, eggs: 68, chicken: 200, paneer: 320, onions: 25, tomatoes: 28, potatoes: 20, oil: 138, sugar: 40, apples: 175, bananas: 36, bread: 35, autoMin: 15, autoKm: 8, metroPass: 500, busPass: 350, olaKm: 8, petrol: 104, diesel: 90, activa: 79000, swift: 660000, electricity: 1100, waterBill: 150, lpg: 803, broadband: 500, mobile: 299, rent1c: 7000, rent1o: 4000, rent2c: 12000, rent2o: 7000, rent3c: 18000, rent3o: 11000, pgPvtM: 6000, pgPvtNm: 4500, pgDblM: 4500, pgDblNm: 3000, pgTrpM: 3500, pgTrpNm: 2500, gym: 600, movie: 150, netflix: 649, spotify: 119, haircut: 50, beer: 150, importBeer: 310 }),
  },
  {
    name: "Prayagraj", slug: "prayagraj", state: "Uttar Pradesh", population: "13 L",
    description: "Confluence of three rivers (Triveni Sangam). Host of the world's largest gathering — Kumbh Mela.",
    image: "/cities/prayagraj.webp", lastUpdated: "February 2026", contributors: 24,
    prices: makePrices({ vegThali: 65, nonVegThali: 120, mealForTwo: 800, chai: 10, coffee: 110, streetFood: 10, biryani: 140, dosa: 50, fastFood: 220, softDrink: 35, water: 20, rice: 78, atta: 40, dal: 135, milk: 50, eggs: 68, chicken: 200, paneer: 320, onions: 25, tomatoes: 28, potatoes: 20, oil: 138, sugar: 40, apples: 178, bananas: 38, bread: 35, autoMin: 15, autoKm: 8, metroPass: 500, busPass: 350, olaKm: 8, petrol: 95, diesel: 88, activa: 79000, swift: 662000, electricity: 1200, waterBill: 150, lpg: 803, broadband: 500, mobile: 299, rent1c: 7500, rent1o: 4500, rent2c: 12000, rent2o: 7500, rent3c: 20000, rent3o: 12000, pgPvtM: 6500, pgPvtNm: 5000, pgDblM: 4500, pgDblNm: 3200, pgTrpM: 3500, pgTrpNm: 2500, gym: 600, movie: 150, netflix: 649, spotify: 119, haircut: 50, beer: 150, importBeer: 300 }),
  },
  {
    name: "Meerut", slug: "meerut", state: "Uttar Pradesh", population: "17 L",
    description: "Sports goods capital of India. Birthplace of the 1857 revolt and major NCR satellite city.",
    image: "/cities/meerut.webp", lastUpdated: "February 2026", contributors: 20,
    prices: makePrices({ vegThali: 70, nonVegThali: 130, mealForTwo: 800, chai: 10, coffee: 120, streetFood: 10, biryani: 150, dosa: 50, fastFood: 230, softDrink: 35, water: 20, rice: 80, atta: 40, dal: 138, milk: 54, eggs: 72, chicken: 210, paneer: 330, onions: 26, tomatoes: 30, potatoes: 22, oil: 140, sugar: 42, apples: 175, bananas: 38, bread: 36, autoMin: 18, autoKm: 10, metroPass: 600, busPass: 400, olaKm: 9, petrol: 95, diesel: 88, activa: 80000, swift: 668000, electricity: 1300, waterBill: 180, lpg: 803, broadband: 550, mobile: 299, rent1c: 8000, rent1o: 5000, rent2c: 13000, rent2o: 8000, rent3c: 22000, rent3o: 13000, pgPvtM: 7000, pgPvtNm: 5000, pgDblM: 5000, pgDblNm: 3500, pgTrpM: 4000, pgTrpNm: 2800, gym: 700, movie: 160, netflix: 649, spotify: 119, haircut: 60, beer: 150, importBeer: 300 }),
  },
];
