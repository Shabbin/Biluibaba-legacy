import React from "react";

export default function Select({
  data,
  placeholder,
  value,
  className,
  onChange,
  name,
  ...props
}) {
  const textColor = value ? "text-gray-700" : "text-gray-400";

  return (
    <div className="w-full">
      <div className="relative">
        <select
          defaultValue={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={`appearance-none w-full text-sm bg-white border border-gray-200 rounded px-4 my-3 py-3 ${textColor} focus:outline-none focus:ring-2 focus:ring-indigo-100`}
        >
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
    </div>
  );
}
