import DisplayProduct from './product';

import ProductData from '@/src/app/demo.products';

interface Params {
  slug: string;
}

interface ProductPageProps {
  params: Params;
}

export function generateStaticParams(): Params[] {
  return ProductData.map((product) => ({
    slug: `${product.slug}`,
  }));
}

const Product = ({ params }: ProductPageProps): JSX.Element => {
  return <DisplayProduct params={params} />;
};

export default Product;
