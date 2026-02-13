import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ placeholder, value, onChange, className = "", ...props }) => {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={
        "px-4 md:px-6 py-3 md:py-4 my-3 rounded-3xl text-petzy-slate border-2 border-gray-200 focus:border-petzy-coral focus:ring-2 focus:outline-none focus:ring-petzy-coral/20 bg-white w-full resize-none shadow-soft transition-all duration-300 placeholder:text-petzy-slate-light/50 text-sm md:text-base " +
        className
      }
      {...props}
    ></textarea>
  );
};

export default Textarea;
