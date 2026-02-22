"use client";

import Link from "next/link";
import { FaArrowLeft, FaPaw } from "react-icons/fa6";
import { Button } from "@/src/components/ui/button";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

/**
 * [FUTURE] This component is used as a placeholder for features not yet launched.
 * When the feature is ready, remove this component from the page and restore the original content.
 */
const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Coming Soon", 
  description = "We're working hard to bring this feature to you. Stay tuned!" 
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        {/* Animated Paw Icon */}
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 bg-petzy-coral/10 rounded-full flex items-center justify-center animate-pulse">
            <FaPaw className="text-petzy-coral text-4xl" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-petzy-slate mb-4">
          {title}
        </h1>
        <p className="text-petzy-slate-light text-lg mb-8 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button className="gap-2">
              <FaArrowLeft />
              Back to Home
            </Button>
          </Link>
          <Link href="/products">
            <Button className="gap-2 bg-white text-petzy-slate border border-gray-200 hover:bg-gray-50">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
