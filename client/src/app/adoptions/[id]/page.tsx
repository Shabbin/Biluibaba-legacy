import AdoptionProfile from "./adoption";

import AdoptionData from "@/src/app/demo.adoptions";

interface PageParams {
  id: string;
}

export function generateStaticParams(): { id: string }[] {
  return AdoptionData.map((adoption) => ({
    id: `${adoption.id}`,
  }));
}

interface PageProps {
  params: PageParams;
}

export default function Page({ params }: PageProps): JSX.Element {
  return <AdoptionProfile />;
}
