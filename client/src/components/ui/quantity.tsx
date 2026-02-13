import { HiPlusCircle, HiMinusCircle } from "react-icons/hi";

interface QuantityProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  id?: string;
}

const Quantity: React.FC<QuantityProps> = ({ value, onChange, className = "", id }) => {
  return (
    <div className={"flex flex-row gap-3 items-center " + className}>
      <HiMinusCircle
        size="2em"
        className={
          value != 1
            ? "cursor-pointer"
            : "cursor-not-allowed pointer-events-none text-zinc-200"
        }
        onClick={() => onChange(value - 1)}
      />
      <input
        min={0}
        value={value}
        id={id}
        readOnly={true}
        className="w-[30px] h-[30px] rounded-full mt-0 text-center mx-auto z-1 text-black border-zinc-900 border focus:border-black focus:ring-1 focus:outline-none focus:ring-zinc-400"
      />
      <HiPlusCircle
        size="2em"
        className="cursor-pointer"
        onClick={() => onChange(value + 1)}
      />
    </div>
  );
};

export default Quantity;
