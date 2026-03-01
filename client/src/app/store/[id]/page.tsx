import StorePage from "@/src/app/store/[id]/store";


interface StorePageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: StorePageProps) {
  const resolvedParams = await params;
  return <div className="mt-10">
  <StorePage/>
  </div>
}
