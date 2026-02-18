import ProductUploadForm from "@/app/_components/products/upload";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h2>Upload New Product</h2>
        <p>Add a new product to your catalog</p>
        <div className="header-accent" />
      </div>
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
        <ProductUploadForm
          product={{
            name: "",
            categories: [{ parent: "", category: "", sub: "" }],
            description: "",
            price: "",
            discount: "",
            quantity: "",
            size: "",
            tags: [],
          }}
        />
      </div>
    </div>
  );
}
