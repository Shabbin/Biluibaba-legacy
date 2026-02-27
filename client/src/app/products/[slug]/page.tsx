import DisplayProduct from "./product";

import ProductData from "@/src/app/demo.products";
import type { DemoProduct } from "@/src/types";

const typedProductData = ProductData as DemoProduct[];

export function generateStaticParams() {
  return typedProductData.map((product) => ({
    slug: `${product.slug}`,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const Product = async ({ params }: ProductPageProps) => {
  return <div className="mt-10"><DisplayProduct /></div>;
};

export default Product;
