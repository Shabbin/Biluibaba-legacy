import React from "react";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

const SafeImg: React.FC<Props> = ({ src, ...props }) => {
  if (!src || typeof src !== "string" || src.trim() === "") return null;
  return <img src={src} {...props} />;
};

export default SafeImg;