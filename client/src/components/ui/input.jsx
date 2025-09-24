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
          "w-full px-4 my-3 py-3 rounded-lg text-black border focus:border-2 focus:ring-1 focus:outline-none focus:ring-zinc-400 bg-neutral-100 " +
          className
        }
        {...props}
      ></input>
    </>
  );
};

export default Input;
