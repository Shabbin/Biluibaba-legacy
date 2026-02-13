"use client";

import React from "react";

// --- Types ---

interface ButtonProps {
  text?: string | React.ReactNode;
  icon?: React.ReactNode;
  /**
   * Visual variant of the button.
   * Note: This is NOT the HTML type attribute (submit/reset).
   */
  type?: "default" | "outline" | "custom" | string; 
  iconAlign?: "left" | "right";
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface SpinnerProps {
  type: "light" | "dark";
}

// --- Components ---

const Spinner: React.FC<SpinnerProps> = ({ type }) => {
  const style =
    type === "light"
      ? "border-4 border-zinc-800 rounded-xl w-7 h-7 animate-spin"
      : "border-3 border-gray-500 border-t-white rounded-full w-6 h-6 animate-spin";
  
  return <div className={style}></div>;
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  icon,
  className = "",
  type = "default",
  disabled = false,
  iconAlign = "right", // Default alignment
  ...props // Capture other standard HTML button props (id, style, etc.)
}) => {
  
  const buttonStyle =
    type === "default"
      ? "flex justify-center items-center whitespace-nowrap text-center bg-petzy-coral px-6 md:px-10 lg:px-12 py-3 md:py-4 font-bold rounded-pill text-sm md:text-base text-white hover:bg-petzy-coral-dark transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg disabled:opacity-75 disabled:cursor-not-allowed "
      : type === "outline"
      ? "flex justify-center items-center whitespace-nowrap text-center bg-transparent px-6 md:px-10 lg:px-12 py-2 md:py-3 font-bold rounded-pill text-sm md:text-base text-petzy-coral border-2 border-petzy-coral hover:bg-petzy-coral hover:text-white transition-all duration-300 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed "
      : " ";

  const spinnerType: "light" | "dark" = type === "default" ? "light" : "dark";

  return (
    <button
      className={`${buttonStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      // We set default HTML type to button to prevent accidental form submits unless specified in ...props
      type="button" 
      {...props}
    >
      {/* Left Icon */}
      {iconAlign === "left" && icon && (
        <span className="mr-2 flex items-center">{icon}</span>
      )}
      
      {/* Text */}
      {text}

      {/* Right Icon */}
      {iconAlign !== "left" && icon && (
        <span className="ml-2 flex items-center">{icon}</span>
      )}

      {/* Loading Spinner */}
      {disabled && (
        <span className="block ml-2">
          <Spinner type={spinnerType} />
        </span>
      )}
    </button>
  );
};

export { Button };
export default Button;