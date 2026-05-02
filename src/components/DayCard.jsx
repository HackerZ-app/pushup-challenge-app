"use client";
import React from 'react';
import { motion } from 'framer-motion';

// DayCard component to render each individual day in the grid.
// Uses framer-motion for hover/tap micro-interactions and vibrant gradients.
const DayCard = ({ day, target, isCompleted, onDayClick }) => (
  <motion.div
    onClick={() => onDayClick(day)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`
      flex flex-col items-center justify-center p-4 m-1
      rounded-lg cursor-pointer
      shadow-lg hover:shadow-xl
      select-none
      ${isCompleted
        ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white'
        : 'bg-white text-gray-800 hover:bg-gray-100'}
    `}
    style={{
      transition: 'box-shadow 0.3s ease',
    }}
  >
    <span className="text-xl md:text-2xl font-bold">Day {day}</span>
    <span className="text-sm md:text-base">Target: {target}</span>
    {isCompleted && (
      <svg
        className="w-6 h-6 mt-1 text-white drop-shadow-md"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    )}
  </motion.div>
);

export default DayCard;
