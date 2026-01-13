import { SelectHTMLAttributes, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  text: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  data: SelectOption[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const Select = ({
  data,
  placeholder,
  value,
  className,
  onChange,
  name,
  error,
  ...props
}: SelectProps): JSX.Element => {
  const textColor = value ? 'text-gray-700' : 'text-gray-400';

  return (
    <div className="w-full">
      <div className="relative">
        <select
          defaultValue={value}
          onChange={onChange}
          name={name}
          className={cn(
            'appearance-none w-full text-sm bg-white border border-gray-200',
            'rounded px-4 my-3 py-3',
            'focus:outline-none focus:ring-2 focus:ring-indigo-100',
            textColor,
            error && 'border-red-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {data.map((d, i) => (
            <option key={i} value={d.value}>
              {d.text}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg
            className="w-3 h-3 text-black"
            viewBox="0 0 10 6"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M5 6L10 0H0L5 6Z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
