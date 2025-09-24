const Textarea = ({ placeholder, value, onChange, className, ...props }) => {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={
        "px-4 py-3 my-3 rounded-lg text-black border focus:border-2 focus:ring-1 focus:outline-none focus:ring-zinc-400 bg-neutral-100 w-full resize-none " +
        className
      }
      {...props}
    ></textarea>
  );
};

export default Textarea;
