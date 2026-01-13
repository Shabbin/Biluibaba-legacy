'use client';

import React from 'react';

interface ReviewCardProps {
  review: string;
  profilePic: React.ReactNode;
  name: string;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, profilePic, name, date }) => {
  return (
    <div className="border h-52 flex flex-col justify-between shadow-lg px-6 py-4 rounded-lg">
      <div className="text-lg">
        {review.length > 140 ? `${review.substring(0, 140)}...` : review}
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="w-[60px] h-[60px] flex items-center justify-center text-center rounded-full bg-blue-100">
          {profilePic}
        </div>
        <div>
          <div>{name}</div>
          <div className="text-gray-500">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
