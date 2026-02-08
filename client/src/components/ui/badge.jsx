"use client";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "" 
}) => {
  const variants = {
    default: "bg-petzy-coral text-white",
    outline: "border-2 border-petzy-coral text-petzy-coral bg-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    secondary: "bg-petzy-periwinkle text-petzy-slate",
    gradient: "bg-gradient-to-r from-petzy-coral to-pink-400 text-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold rounded-pill whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
