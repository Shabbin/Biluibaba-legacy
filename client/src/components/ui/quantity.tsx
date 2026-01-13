'use client';

import { HiPlusCircle, HiMinusCircle } from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface QuantityProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  id?: string;
  min?: number;
  max?: number;
}

const Quantity = ({
  value,
  onChange,
  className,
  id,
  min = 1,
  max = 999,
}: QuantityProps): JSX.Element => {
  const handleDecrement = (): void => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (): void => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn('flex flex-row gap-3 items-center', className)}>
      <HiMinusCircle
        size="2em"
        className={cn(
          value > min
            ? 'cursor-pointer hover:opacity-70 transition-opacity'
            : 'cursor-not-allowed pointer-events-none text-zinc-200'
        )}
        onClick={handleDecrement}
        aria-label="Decrease quantity"
      />
      <input
        min={min}
        max={max}
        value={value}
        id={id}
        readOnly
        className="w-[30px] h-[30px] rounded-full text-center mx-auto z-1 text-black border-zinc-900 border focus:border-black focus:ring-1 focus:outline-none focus:ring-zinc-400"
        aria-label="Quantity"
      />
      <HiPlusCircle
        size="2em"
        className={cn(
          value < max
            ? 'cursor-pointer hover:opacity-70 transition-opacity'
            : 'cursor-not-allowed pointer-events-none text-zinc-200'
        )}
        onClick={handleIncrement}
        aria-label="Increase quantity"
      />
    </div>
  );
};

export default Quantity;
