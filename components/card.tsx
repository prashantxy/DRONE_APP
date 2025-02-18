"use client"

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white rounded-xl shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
};
