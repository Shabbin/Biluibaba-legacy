import { ProductSkeleton, CardSkeleton } from "../../components/ui";

// Legacy loading component - use CardSkeleton or ProductSkeleton directly instead
const Loading = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <CardSkeleton count={8} type="product" />
    </div>
  );
};

const ProductLoading = () => {
  return <ProductSkeleton />;
};

export default Loading;
export { ProductLoading };
