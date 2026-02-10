const Radio = ({ value, className, onChange, ...props }) => {
  return (
    <input
      type="checkbox"
      value={value}
      className={
        "appearance-none h-4 w-4 cursor-pointer checked:border-8 rounded-full border-black border " +
        className
      }
      onChange={onChange}
      {...props}
    ></input>
  );
};

export default Radio;
