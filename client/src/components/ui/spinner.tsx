"use client";

import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerColor = "coral" | "white" | "slate" | "periwinkle";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = "md", 
  color = "coral",
  className = "" 
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colors = {
    coral: "border-petzy-coral border-t-transparent",
    white: "border-white border-t-transparent",
    slate: "border-petzy-slate border-t-transparent",
    periwinkle: "border-petzy-periwinkle border-t-transparent",
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-petzy-blue-light">
      <Spinner size="xl" color="coral" />
      <p className="mt-6 text-lg font-semibold text-petzy-slate animate-pulse">
        {message}
      </p>
    </div>
  );
};

export const ButtonSpinner = () => {
  return <Spinner size="sm" color="white" />;
};

export default Spinner;
