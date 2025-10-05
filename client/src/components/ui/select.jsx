const Select = ({
  data,
  placeholder,
  value,
  className,
  onChange,
  name,
  ...props
}) => {
  return (
    <select
      defaultValue={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      className={
        "w-full px-4 my-3 py-4 rounded-md text-black text-sm border focus:border-2 focus:ring-1 focus:outline-none focus:ring-zinc-400 shadow-none bg-neutral-100  " +
        className
      }
      {...props}
    >
      {data.map((d, i) => (
        <option value={d.value} key={i}>
          {d.text}
        </option>
      ))}
    </select>
  );
};

export default Select;
