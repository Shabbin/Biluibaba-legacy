// [FUTURE] Adoption detail page — uncomment below and remove ComingSoon export to restore
/*
import AdoptionProfile from "./adoption";

import AdoptionData from "@/src/app/demo.adoptions";

export function generateStaticParams() {
  return AdoptionData.map((adoption) => ({
    id: `${adoption.id}`,
  }));
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  await params; // Await params to satisfy Next.js 15 requirements
  return <AdoptionProfile />;
};

export default Page;
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Pet Adoption — Coming Soon" description="Adoption profiles will be available soon!" />;
}
