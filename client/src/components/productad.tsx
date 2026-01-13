'use client';

import React from 'react';
import Button from '@/src/components/ui/button';

interface ProductAdProps {
  title: string;
  desc: string;
  buttonText: string;
  onClick?: () => void;
}

const ProductAd: React.FC<ProductAdProps> = ({ title, desc, buttonText, onClick }) => {
  return (
    <div className="flex md:flex-row flex-col md:px-0 px-5">
      <div className="basis-1/2 bg-gray-300 h-full min-h-[400px] rounded-tl-xl rounded-bl-xl" />
      <div className="basis-1/2 border rounded-tr-xl rounded-br-xl p-10">
        <div className="flex flex-row items-center">
          <div className="inline-flex items-center gap-2 w-full">
            <div className="border w-6 h-6 rounded" />
            <div className="font-bold">Biluibaba.com</div>
          </div>
          <div className="bg-gray-300 rounded-full px-2 py-1 text-lg font-bold">AD</div>
        </div>
        <div className="my-5">
          <div className="text-4xl font-extrabold my-5">{title}</div>
          <div className="my-10 text-lg">{desc}</div>
        </div>
        <Button type="default" text={buttonText} className="w-1/2" onClick={onClick} />
      </div>
    </div>
  );
};

export default ProductAd;
