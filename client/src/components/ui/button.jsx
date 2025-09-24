"use client";

const Button = ({
  text,
  onClick,
  icon,
  className,
  type,
  disabled,
  iconAlign,
}) => {
  let buttonStyle =
    type === "default"
      ? "flex justify-center items-center whitespace-nowrap text-center bg-black px-12 py-4 font-medium rounded-lg text-white hover:bg-neutral-900 transition-all ease-in-out duration-300 uppercase disabled:opacity-75 disabled:cursor-not-allowed "
      : type === "outline"
      ? "flex justify-center items-center whitespace-nowrap text-center bg-transparent px-12 py-3 font-medium rounded-lg text-black border border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out uppercase disabled:opacity-75 disabled:cursor-not-allowed "
      : " ";

  let spinnerType = type === "default" ? "light" : "dark";

  return (
    <button
      className={buttonStyle + className}
      onClick={onClick}
      disabled={disabled}
    >
      {iconAlign === "left" && <span className="mr-2">{icon}</span>}
      {text} {iconAlign !== "left" && <span className="ml-2">{icon}</span>}
      <span className={disabled ? "block ml-2" : "hidden"}>
        {disabled ? <Spinner type={spinnerType} /> : null}
      </span>
    </button>
  );
};

const Spinner = (type) => {
  let style =
    type === "light"
      ? "border-4  border-zinc-800 rounded-xl w-7 h-7 animate-spin"
      : "border-3 border-gray-500 border-t-white rounded-full w-6 h-6 animate-spin";
  return <div className={style}></div>;
};

export default Button;
