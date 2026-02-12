"use client";

import React from "react";

interface DividerProps {
  className?: string;
  text?: string | null;
}

const Divider: React.FC<DividerProps> = ({ className = "", text = null }) => {
  if (text) {
    return (
      <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-petzy-periwinkle to-transparent" />
        <span className="text-sm font-semibold text-petzy-slate-light uppercase tracking-wider">
          {text}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-petzy-periwinkle via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`h-px bg-gradient-to-r from-transparent via-petzy-periwinkle to-transparent my-6 ${className}`}
    />
  );
};

export default Divider;
