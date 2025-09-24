import DisplayProduct from "./product";

import ProductData from "@/src/app/demo.products";

export function generateStaticParams() {
  return ProductData.map((product) => ({
    slug: `${product.slug}`,
  }));
}

const Product = ({ params }) => {
  return <DisplayProduct params={params} />;
};

export default Product;
