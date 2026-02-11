const Input = ({
  type,
  value,
  placeholder,
  className,
  name,
  onChange,
  required,
  pattern,
  error,
  disabled,
  accept,
  ...props
}) => {
  return (
    <>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        required={required}
        pattern={pattern}
        disabled={disabled}
        accept={accept}
        className={
          "w-full px-4 md:px-6 my-3 py-3 md:py-4 rounded-3xl text-petzy-slate border-2 border-gray-200 focus:border-petzy-coral focus:ring-2 focus:outline-none focus:ring-petzy-coral/20 bg-white shadow-soft transition-all duration-300 placeholder:text-petzy-slate-light/50 text-sm md:text-base " +
          className
        }
        {...props}
      ></input>
    </>
  );
};

export { Input };
export default Input;
