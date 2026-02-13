import React from "react";
import ShadcnButton from "./button";

interface ButtonLegacyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  className?: string;
  type?: "default" | "outline" | "custom" | "submit" | "reset" | "button";
  disabled?: boolean;
  iconAlign?: "left" | "right";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * Legacy Button wrapper for backward compatibility
 * Old API: <Button text="Click me" type="default|outline" onClick={...} />
 * New shadcn Button uses: <Button variant="default|outline">Click me</Button>
 */
const Button: React.FC<ButtonLegacyProps> = ({
  text,
  onClick,
  icon,
  className,
  type = "default",
  disabled,
  iconAlign = "right",
  ...props
}) => {
  // Map old "type" prop to new "variant" prop
  const variant = type === "default" ? "default" : type === "outline" ? "outline" : "default";

  return (
    <ShadcnButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {iconAlign === "left" && icon && <span className="mr-2">{icon}</span>}
      {text}
      {iconAlign !== "left" && icon && <span className="ml-2">{icon}</span>}
    </ShadcnButton>
  );
};

export { Button };
export default Button;
