// Wavy/scalloped SVG dividers for Petzy-style design

import React from "react";

interface DividerShapeProps {
  className?: string;
  flip?: boolean;
}

interface BlobShapeProps {
  className?: string;
}

export const WavyDivider: React.FC<DividerShapeProps> = ({ className = "", flip = false }) => {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C150,60 350,60 600,30 C850,0 1050,0 1200,30 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export const ScallopedDivider: React.FC<DividerShapeProps> = ({ className = "", flip = false }) => {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 Q50,60 100,0 T200,0 T300,0 T400,0 T500,0 T600,0 T700,0 T800,0 T900,0 T1000,0 T1100,0 T1200,0 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export const CloudDivider: React.FC<DividerShapeProps> = ({ className = "", flip = false }) => {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,50 C100,10 200,70 300,40 C400,10 500,70 600,30 C700,5 800,65 900,40 C1000,15 1100,60 1200,40 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

// Organic blob shape for background decorations
export const BlobShape: React.FC<BlobShapeProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.3C64.8,55.4,53.8,67,40.5,73.8C27.2,80.6,11.6,82.6,-3.9,89.5C-19.4,96.4,-34.8,108.2,-48.1,101.4C-61.4,94.6,-72.6,69.2,-80.5,44.8C-88.4,20.4,-93,0,-87.9,-17.8C-82.8,-35.6,-68,-50.8,-52.4,-57.6C-36.8,-64.4,-18.4,-62.8,-1.3,-60.5C15.8,-58.2,30.6,-83.6,44.7,-76.4Z"
        transform="translate(100 100)"
        opacity="0.1"
      />
    </svg>
  );
};
