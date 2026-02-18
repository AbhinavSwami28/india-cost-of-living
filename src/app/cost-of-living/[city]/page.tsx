import { redirect } from "next/navigation";
import { getAllCitySlugs } from "@/lib/data";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }));
}

export default async function CityRedirect({ params }: PageProps) {
  const { city } = await params;
  redirect(`/cost-of-living/${city}/prices`);
}
