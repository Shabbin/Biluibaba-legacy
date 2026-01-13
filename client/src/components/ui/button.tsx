'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type IconAlign = 'left' | 'right';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  iconAlign?: IconAlign;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-black text-white hover:bg-neutral-900 disabled:opacity-75 disabled:cursor-not-allowed',
  outline:
    'bg-transparent text-black border border-black hover:bg-black hover:text-white disabled:opacity-75 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-black hover:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed',
};

const Spinner = ({ variant }: { variant: ButtonVariant }): JSX.Element => {
  const spinnerStyle =
    variant === 'default'
      ? 'border-4 border-zinc-800 border-t-white rounded-full w-5 h-5 animate-spin'
      : 'border-3 border-gray-500 border-t-black rounded-full w-5 h-5 animate-spin';

  return <div className={spinnerStyle} />;
};

const Button = ({
  text,
  onClick,
  icon,
  className,
  variant = 'default',
  disabled,
  iconAlign = 'right',
  isLoading,
  type = 'button',
  ...props
}: ButtonProps): JSX.Element => {
  const baseStyles =
    'flex justify-center items-center whitespace-nowrap text-center px-12 py-4 font-medium rounded-lg transition-all ease-in-out duration-300 uppercase';

  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconAlign === 'left' && icon && <span className="mr-2">{icon}</span>}
      {text}
      {iconAlign === 'right' && icon && <span className="ml-2">{icon}</span>}
      {(disabled || isLoading) && (
        <span className="ml-2">
          <Spinner variant={variant} />
        </span>
      )}
    </button>
  );
};

export default Button;
