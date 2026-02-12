"use client";

import React from "react";
import { FaShieldHalved, FaFileContract, FaRotateLeft, FaMoneyBillWave } from "react-icons/fa6";

type PolicyType = "privacy" | "terms" | "return" | "refund";

const iconMap: Record<PolicyType, React.ReactNode> = {
  privacy: <FaShieldHalved />,
  terms: <FaFileContract />,
  return: <FaRotateLeft />,
  refund: <FaMoneyBillWave />,
};

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  type?: PolicyType;
  children: React.ReactNode;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, lastUpdated, type = "privacy", children }) => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* --- HERO HEADER --- */}
      <div className="bg-petzy-periwinkle-light/30 border-b border-petzy-slate/5 py-16 md:py-24 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-petzy-blue-light/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-petzy-coral/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-5 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-petzy-coral text-3xl shadow-soft mb-6">
            {iconMap[type] || <FaFileContract />}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-petzy-slate mb-4">
            {title}
          </h1>
          <p className="text-petzy-slate-light font-medium text-sm md:text-base uppercase tracking-widest opacity-80">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-5 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-petzy-slate/5 border border-gray-100 p-8 md:p-14 max-w-4xl mx-auto">
          <article className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-petzy-slate 
            prose-p:text-petzy-slate-light prose-p:leading-relaxed 
            prose-a:text-petzy-coral prose-a:no-underline hover:prose-a:underline
            prose-li:text-petzy-slate-light marker:text-petzy-coral
            prose-strong:text-petzy-slate prose-strong:font-bold">
            
            {children}

          </article>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;