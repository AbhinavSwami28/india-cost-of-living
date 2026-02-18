"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { CityData } from "@/lib/types";
import { calculateCostIndex, formatPrice } from "@/lib/data";

const INDIA_TOPO = "/india.topo.json";

// City coordinates [lng, lat]
const CITY_MARKERS: Record<string, [number, number]> = {
  mumbai: [72.878, 19.076], delhi: [77.209, 28.614], bangalore: [77.595, 12.972],
  chennai: [80.271, 13.083], hyderabad: [78.487, 17.385], pune: [73.857, 18.520],
  kolkata: [88.364, 22.573], ahmedabad: [72.571, 23.023], jaipur: [75.787, 26.912],
  lucknow: [80.946, 26.847], chandigarh: [76.779, 30.733], amritsar: [74.872, 31.634],
  surat: [72.831, 21.170], indore: [75.858, 22.720], bhopal: [77.413, 23.260],
  nagpur: [79.088, 21.146], coimbatore: [76.956, 11.017], kochi: [76.267, 9.931],
  thiruvananthapuram: [76.937, 8.524], visakhapatnam: [83.219, 17.687],
  vijayawada: [80.648, 16.506], mysuru: [76.639, 12.296], mangalore: [74.856, 12.914],
  madurai: [78.120, 9.925], varanasi: [83.007, 25.318], agra: [78.008, 27.177],
  kanpur: [80.332, 26.450], patna: [85.138, 25.609], ranchi: [85.310, 23.344],
  bhubaneswar: [85.825, 20.296], guwahati: [91.736, 26.145], dehradun: [78.032, 30.317],
  jodhpur: [73.024, 26.239], udaipur: [73.713, 24.585], goa: [73.828, 15.491],
  raipur: [81.630, 21.251], siliguri: [88.395, 26.727],
};

export default function IndiaMap({ cities }: { cities: CityData[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hoveredCity = hovered ? cities.find((c) => c.slug === hovered) : null;

  return (
    <div className="relative" onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ rotate: [-83, 0, 0] as [number, number, number], scale: 850, center: [0, 23] as [number, number] }}
        width={550}
        height={580}
        className="w-full h-auto max-w-lg mx-auto"
      >
        <Geographies geography={INDIA_TOPO}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e8ede8"
                stroke="#bbb"
                strokeWidth={0.4}
                className="outline-none dark:fill-[#1a1a1a] dark:stroke-[#333]"
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#fde68a", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {cities.map((city) => {
          const coords = CITY_MARKERS[city.slug];
          if (!coords) return null;
          const isHovered = hovered === city.slug;

          return (
            <Marker key={city.slug} coordinates={coords}>
              <Link href={`/cost-of-living/${city.slug}`}>
                <circle
                  r={isHovered ? 5 : 2.5}
                  fill={isHovered ? "#f97316" : "#ea580c"}
                  stroke="#fff"
                  strokeWidth={isHovered ? 1.5 : 0.8}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHovered(city.slug)}
                  onMouseLeave={() => setHovered(null)}
                />
              </Link>
            </Marker>
          );
        })}
      </ComposableMap>

      {hoveredCity && (() => {
        const index = calculateCostIndex(hoveredCity);
        const rent = hoveredCity.prices.find((p) => p.item === "1 BHK in City Centre");
        return (
          <div className="absolute z-20 bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
            style={{ left: mousePos.x + 16, top: mousePos.y - 10 }}>
            <div className="font-bold text-sm">{hoveredCity.name}</div>
            <div className="text-gray-400">{hoveredCity.state}</div>
            <div className="mt-1.5 space-y-0.5">
              <div>COL Index: <strong className="text-orange-400">{index}</strong></div>
              {rent && <div>1BHK: <strong className="text-orange-400">{formatPrice(rent.price)}/mo</strong></div>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
