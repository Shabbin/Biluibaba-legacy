"use client";

const Card = ({ 
  children, 
  variant = "default", 
  hover = true,
  className = "" 
}) => {
  const variants = {
    default: "bg-white border-2 border-gray-100 shadow-soft",
    elevated: "bg-white shadow-soft-lg",
    outline: "bg-white border-2 border-petzy-periwinkle",
    gradient: "bg-gradient-to-br from-petzy-blue-light to-petzy-mint-light border-0",
    glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-soft",
  };

  const hoverEffect = hover 
    ? "hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300" 
    : "";

  return (
    <div
      className={`rounded-3xl p-6 ${variants[variant]} ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-xl md:text-2xl font-bold text-petzy-slate ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm md:text-base text-petzy-slate-light mt-2 ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export { Card };
export default Card;
