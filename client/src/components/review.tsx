"use client";

import React from "react";

interface ReviewCardProps {
  review: string;
  profilePic: React.ReactNode;
  name: string;
  date: string;
}

export default class ReviewCard extends React.Component<ReviewCardProps> {
  constructor(props: ReviewCardProps) {
    super(props);
  }

  render() {
    return (
      <div className="border h-52  flex flex-col justify-between shadow-lg px-6 py-4 rounded-lg">
        <div className="text-lg">
          {this.props.review.length > 140
            ? `${this.props.review.substring(0, 140)}...`
            : this.props.review}
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-[60px] h-[60px] flex items-center justify-center text-center rounded-full bg-blue-100">
            {this.props.profilePic}
          </div>
          <div>
            <div>{this.props.name}</div>
            <div className="text-gray-500">{this.props.date}</div>
          </div>
        </div>
      </div>
    );
  }
}
