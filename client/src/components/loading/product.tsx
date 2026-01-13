import React from 'react';

const Loading: React.FC = () => {
  return <div className="flex"></div>;
};

export const ProductLoading: React.FC = () => {
  return (
    <div className="max-w-[350px] w-full h-full border rounded-2xl shadow-sm">
      <div className="w-[500px] h-full"></div>
    </div>
  );
};

export default Loading;
