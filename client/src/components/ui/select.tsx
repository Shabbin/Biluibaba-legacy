import React from "react";

interface SelectOption {
  value: string;
  text: string;
}

interface SelectProps {
  data: SelectOption[];
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  name?: string;
}

export default function Select({
  data,
  placeholder,
  value,
  className,
  onChange,
  name,
  ...props
}: SelectProps) {
  const textColor = value ? "text-petzy-slate" : "text-petzy-slate-light/50";

  return (
    <div className="w-full">
      <div className="relative">
        <select
          defaultValue={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={`appearance-none w-full bg-white border-2 border-gray-200 rounded-3xl px-4 md:px-6 my-3 py-3 md:py-4 ${textColor} focus:outline-none focus:ring-2 focus:ring-petzy-coral/20 focus:border-petzy-coral shadow-soft transition-all duration-300 text-xs md:text-sm`}
        >
          {data.map((d, i) => (
            <option key={i} value={d.value}>
              {d.text}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center">
          <svg
            className="w-3 h-3 text-petzy-slate"
            viewBox="0 0 10 6"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M5 6L10 0H0L5 6Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
