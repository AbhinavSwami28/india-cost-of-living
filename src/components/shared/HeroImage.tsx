
"use client";

import Image from "next/image";

export default function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className="object-cover"
      priority
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}
