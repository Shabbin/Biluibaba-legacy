interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Radio: React.FC<RadioProps> = ({ value, className, onChange, ...props }) => {
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
