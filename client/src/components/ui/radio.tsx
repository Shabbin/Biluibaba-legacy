import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, className, onChange, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          value={value}
          className={cn(
            'appearance-none h-4 w-4 cursor-pointer',
            'checked:border-8 rounded-full border-black border',
            'transition-all duration-200',
            className
          )}
          onChange={onChange}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="cursor-pointer text-sm">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
