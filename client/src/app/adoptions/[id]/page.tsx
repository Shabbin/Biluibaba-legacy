import AdoptionProfile from "./adoption";

import AdoptionData from "@/src/app/demo.adoptions";

export function generateStaticParams() {
  return AdoptionData.map((adoption) => ({
    id: `${adoption.id}`,
  }));
}

const Page = ({ params }) => {
  return <AdoptionProfile params={params} />;
};

export default Page;
