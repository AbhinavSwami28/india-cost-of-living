"use client";

import Link from "next/link";
import { useState } from "react";
import { CityData } from "@/lib/types";
import { calculateCostIndex, formatPrice } from "@/lib/data";

// SVG positions manually placed using the SVG state capital circles as anchors
// Each city is positioned relative to its state's capital marker in the SVG
const CITY_SVG: Record<string, [number, number]> = {
  // Maharashtra: state center at (305.7, 597.9)
  mumbai: [267, 590], pune: [272, 618], nagpur: [410, 552],
  // Delhi NCR: Delhi at (344.1, 320)
  delhi: [344, 320],
  // Karnataka: center at (302.1, 728.1)
  bangalore: [318, 738], mysuru: [296, 760], mangalore: [262, 758],
  // Tamil Nadu: center at (379.6, 835.6)
  chennai: [402, 788], coimbatore: [320, 820], madurai: [350, 860],
  // Telangana: center at (396.7, 641.9)
  hyderabad: [388, 642],
  // West Bengal: center at (637.1, 485.8)
  kolkata: [637, 486], siliguri: [636, 360],
  // Gujarat: center at (199.2, 481)
  ahmedabad: [199, 480], surat: [216, 540], vadodara: [210, 510],
  // Rajasthan: center at (256.7, 375.8)
  jaipur: [275, 378], jodhpur: [220, 382], udaipur: [233, 430],
  // UP: center at (438.7, 375.5)
  lucknow: [438, 376], varanasi: [498, 398], agra: [366, 355], kanpur: [426, 390],
  // Punjab: center at (300.5, 254.4)
  amritsar: [278, 232], chandigarh: [335, 255],
  // MP: center at (378.4, 494.2)
  indore: [320, 500], bhopal: [360, 494],
  // Bihar: center at (575.8, 411)
  patna: [576, 411],
  // Jharkhand: center at (563.9, 475.8)
  ranchi: [564, 476],
  // Odisha: center at (549.9, 559.3)
  bhubaneswar: [550, 559],
  // Assam: center at (775.9, 393.9)
  guwahati: [744, 394],
  // Uttarakhand: center at (401.4, 272.1)
  dehradun: [380, 270],
  // AP: center at (392.3, 730.7)
  visakhapatnam: [468, 638], vijayawada: [406, 700],
  // Kerala: center at (325.5, 848.9)
  kochi: [308, 840], thiruvananthapuram: [322, 876],
  // Chhattisgarh: center at (473.5, 533.4)
  raipur: [474, 533],
  // Goa: center at (261.6, 713.9)
  goa: [262, 714],
};

function toPercent(svgX: number, svgY: number): [number, number] {
  return [(svgX / 1000) * 100, (svgY / 1000) * 100];
}

export default function IndiaMap({ cities }: { cities: CityData[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredCity = hovered ? cities.find((c) => c.slug === hovered) : null;

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/india-map.svg" alt="Map of India" className="w-full h-auto opacity-25 dark:opacity-15" draggable={false} />

      {cities.map((city) => {
        const pos = CITY_SVG[city.slug];
        if (!pos) return null;
        const [xPct, yPct] = toPercent(pos[0], pos[1]);
        const isHovered = hovered === city.slug;

        return (
          <Link key={city.slug} href={`/cost-of-living/${city.slug}`} className="absolute"
            style={{ left: `${xPct}%`, top: `${yPct}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHovered(city.slug)} onMouseLeave={() => setHovered(null)}>
            <span className={`block rounded-full transition-all duration-150 ${
              isHovered ? "w-3.5 h-3.5 bg-orange-500 ring-2 ring-orange-300 ring-offset-1 dark:ring-offset-[#0a0a0a]"
                       : "w-2 h-2 bg-orange-500 hover:w-3 hover:h-3 hover:bg-orange-400"
            }`} />
          </Link>
        );
      })}

      {hoveredCity && (() => {
        const pos = CITY_SVG[hoveredCity.slug];
        if (!pos) return null;
        const [xPct, yPct] = toPercent(pos[0], pos[1]);
        const index = calculateCostIndex(hoveredCity);
        const rent = hoveredCity.prices.find((p) => p.item === "1 BHK in City Centre");
        const onLeft = xPct > 50;

        return (
          <div className="absolute z-20 pointer-events-none bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap"
            style={{ left: `${xPct}%`, top: `${yPct}%`, transform: `translate(${onLeft ? "calc(-100% - 12px)" : "12px"}, -50%)` }}>
            <div className="font-bold text-sm">{hoveredCity.name}</div>
            <div className="text-gray-400">{hoveredCity.state}</div>
            <div className="mt-1 flex gap-3">
              <span>COL: <strong className="text-orange-400">{index}</strong></span>
              {rent && <span>1BHK: <strong className="text-orange-400">{formatPrice(rent.price)}</strong></span>}
            </div>
          </div>
        );
      })()}

      <div className="absolute bottom-1 right-2 text-[8px] text-gray-400">Map: simplemaps.com</div>
    </div>
  );
}
