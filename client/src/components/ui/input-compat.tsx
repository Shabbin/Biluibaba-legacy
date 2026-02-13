import React from "react";
import { Input as ShadcnInput } from "../ui/input";

interface InputCompatProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * Legacy Input wrapper for backward compatibility
 * Maintains the same API as the old custom input component
 */
const Input: React.FC<InputCompatProps> = ({
  type,
  value,
  placeholder,
  className,
  name,
  onChange,
  required,
  pattern,
  error,
  disabled,
  accept,
  ...props
}) => {
  return (
    <ShadcnInput
      type={type}
      value={value}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      required={required}
      pattern={pattern}
      disabled={disabled}
      accept={accept}
      error={error}
      className={className}
      {...props}
    />
  );
};

export default Input;
