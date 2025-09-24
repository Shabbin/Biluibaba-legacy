import ProductUploadForm from "@/app/_components/products/upload";

export default function Page() {
  return (
    <div className="">
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
  );
}
