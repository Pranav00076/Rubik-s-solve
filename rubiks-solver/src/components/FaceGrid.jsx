import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const colorMap = {
  white: 'bg-cube-white',
  red: 'bg-cube-red',
  green: 'bg-cube-green',
  yellow: 'bg-cube-yellow',
  orange: 'bg-cube-orange',
  blue: 'bg-cube-blue',
};

export const FaceGrid = ({ faceName, colors, onTileClick, className }) => {
  return (
    <div className={twMerge('grid grid-cols-3 grid-rows-3 gap-1 bg-cube-base p-1 rounded-md shadow-sm', className)}>
      {colors.map((color, idx) => {
        const isCenter = idx === 4;
        return (
          <div
            key={idx}
            onClick={() => !isCenter && onTileClick(faceName, idx)}
            className={clsx(
              'w-8 h-8 sm:w-12 sm:h-12 rounded-sm transition-colors duration-200 border border-black/20',
              colorMap[color],
              !isCenter && 'cursor-pointer hover:brightness-110 active:scale-95'
            )}
          />
        );
      })}
    </div>
  );
};