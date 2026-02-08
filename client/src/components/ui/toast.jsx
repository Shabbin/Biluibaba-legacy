"use client";

import { useState } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  const types = {
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    error: "bg-gradient-to-r from-red-500 to-pink-500",
    info: "bg-gradient-to-r from-blue-500 to-cyan-500",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
  };

  return (
    <div
      className={`${types[type]} text-white px-6 py-4 rounded-pill shadow-soft-lg flex items-center gap-3 animate-slideIn`}
    >
      <span className="font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
