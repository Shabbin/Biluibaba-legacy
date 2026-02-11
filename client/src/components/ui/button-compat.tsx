import { Button as ShadcnButton } from "./button";

/**
 * Legacy Button wrapper for backward compatibility
 * Old API: <Button text="Click me" type="default|outline" onClick={...} />
 * New shadcn Button uses: <Button variant="default|outline">Click me</Button>
 */
const Button = ({
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

export default Button;
