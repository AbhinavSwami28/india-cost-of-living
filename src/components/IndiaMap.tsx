"use client";

import Link from "next/link";
import { useState } from "react";
import { CityData } from "@/lib/types";
import { calculateCostIndex, formatPrice } from "@/lib/data";

// Lat/lng for cities
const CITY_COORDS: Record<string, [number, number]> = {
  mumbai: [19.076, 72.878], delhi: [28.614, 77.209], bangalore: [12.972, 77.595],
  chennai: [13.083, 80.271], hyderabad: [17.385, 78.487], pune: [18.520, 73.857],
  kolkata: [22.573, 88.364], ahmedabad: [23.023, 72.571], jaipur: [26.912, 75.787],
  lucknow: [26.847, 80.946], chandigarh: [30.733, 76.779], amritsar: [31.634, 74.872],
  surat: [21.170, 72.831], indore: [22.720, 75.858], bhopal: [23.260, 77.413],
  nagpur: [21.146, 79.088], coimbatore: [11.017, 76.956], kochi: [9.931, 76.267],
  thiruvananthapuram: [8.524, 76.937], visakhapatnam: [17.687, 83.219],
  vijayawada: [16.506, 80.648], mysuru: [12.296, 76.639], mangalore: [12.914, 74.856],
  madurai: [9.925, 78.120], varanasi: [25.318, 83.007], agra: [27.177, 78.008],
  kanpur: [26.450, 80.332], patna: [25.609, 85.138], ranchi: [23.344, 85.310],
  bhubaneswar: [20.296, 85.825], guwahati: [26.145, 91.736], dehradun: [30.317, 78.032],
  jodhpur: [26.239, 73.024], udaipur: [24.585, 73.713],   goa: [15.491, 73.828],
  raipur: [21.251, 81.630], siliguri: [26.727, 88.395],
};

// Affine transform derived from SVG state capital circle positions
// Fitted from: Delhi (344.1,320), Kolkata (637.1,485.8), Trivandrum (325.5,848.9)
// with verification against Chandigarh, J&K, Gujarat, Goa, Assam, Rajasthan
function latLngToSvg(lat: number, lng: number): [number, number] {
  const cx = 26.586 * lng + 0.569 * lat - 1724.88;
  const cy = 0.604 * lng - 26.335 * lat + 1026.84;
  return [cx / 10, cy / 10]; // convert to percentage of 1000x1000 viewBox
}

export default function IndiaMap({ cities }: { cities: CityData[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredCity = hovered ? cities.find((c) => c.slug === hovered) : null;

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/india-map.svg"
        alt="Map of India"
        className="w-full h-auto opacity-25 dark:opacity-15"
        draggable={false}
      />

      {cities.map((city) => {
        const coords = CITY_COORDS[city.slug];
        if (!coords) return null;
        const [xPct, yPct] = latLngToSvg(coords[0], coords[1]);
        if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return null;
        const isHovered = hovered === city.slug;

        return (
          <Link
            key={city.slug}
            href={`/cost-of-living/${city.slug}`}
            className="absolute"
            style={{ left: `${xPct}%`, top: `${yPct}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHovered(city.slug)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className={`block rounded-full transition-all duration-150 ${
                isHovered
                  ? "w-3.5 h-3.5 bg-orange-500 ring-2 ring-orange-300 ring-offset-1 dark:ring-offset-[#0a0a0a]"
                  : "w-2 h-2 bg-orange-500 hover:w-3 hover:h-3 hover:bg-orange-400"
              }`}
            />
          </Link>
        );
      })}

      {hoveredCity && (() => {
        const coords = CITY_COORDS[hoveredCity.slug];
        if (!coords) return null;
        const [xPct, yPct] = latLngToSvg(coords[0], coords[1]);
        const index = calculateCostIndex(hoveredCity);
        const rent = hoveredCity.prices.find((p) => p.item === "1 BHK in City Centre");
        const onLeft = xPct > 50;

        return (
          <div
            className="absolute z-20 pointer-events-none bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: `translate(${onLeft ? "calc(-100% - 12px)" : "12px"}, -50%)`,
            }}
          >
            <div className="font-bold text-sm">{hoveredCity.name}</div>
            <div className="text-gray-400">{hoveredCity.state}</div>
            <div className="mt-1 flex gap-3">
              <span>COL: <strong className="text-orange-400">{index}</strong></span>
              {rent && <span>1BHK: <strong className="text-orange-400">{formatPrice(rent.price)}</strong></span>}
            </div>
          </div>
        );
      })()}

      <div className="absolute bottom-1 right-2 text-[8px] text-gray-400">
        Map: simplemaps.com
      </div>
    </div>
  );
}
