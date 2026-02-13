import AdoptionProfile from "./adoption";

import AdoptionData from "@/src/app/demo.adoptions";

export function generateStaticParams() {
  return AdoptionData.map((adoption) => ({
    id: `${adoption.id}`,
  }));
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  return <AdoptionProfile params={resolvedParams} />;
};

export default Page;
