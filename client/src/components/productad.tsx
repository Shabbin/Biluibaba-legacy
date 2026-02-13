import React from "react";
import Button from "@/src/components/ui/button";

interface ProductAdProps {
  title: string;
  desc: string;
  buttonText: string;
}

const ProductAd: React.FC<ProductAdProps> = ({ title, desc, buttonText }) => {
  return (
    <div className="flex md:flex-row flex-col md:px-0 px-5">
      <div className="basis-1/2 bg-petzy-periwinkle h-full md:min-h-[400px] min-h-[250px] rounded-tl-3xl md:rounded-bl-3xl rounded-tr-3xl md:rounded-tr-none"></div>
      <div className="basis-1/2 border-2 border-petzy-periwinkle rounded-br-3xl md:rounded-tr-3xl rounded-bl-3xl md:rounded-bl-none p-6 md:p-10">
        <div className="flex flex-row items-center">
          <div className="inline-flex items-center gap-2 w-full">
            <div className="border w-5 h-5 md:w-6 md:h-6 rounded"></div>
            <div className="font-bold text-sm md:text-base">Biluibaba.com</div>
          </div>
          <div className="bg-petzy-coral text-white rounded-pill px-3 py-1 text-xs md:text-sm font-bold">
            AD
          </div>
        </div>
        <div className="my-5">
          <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold my-4 md:my-5">{title}</div>
          <div className="my-6 md:my-10 text-sm md:text-base">{desc}</div>
        </div>
        <Button type="default" text={buttonText} className="w-full md:w-2/3 lg:w-1/2" />
      </div>
    </div>
  );
};

export default ProductAd;
