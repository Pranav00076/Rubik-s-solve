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

// 4x4 Grid - 16 squares
export const FaceGrid4x4 = ({ faceName, colors, onTileClick, className }) => {
  return (
    <div className={twMerge('grid grid-cols-4 grid-rows-4 gap-1 bg-cube-base p-1 rounded-md shadow-sm', className)}>
      {colors.map((color, idx) => {
        return (
          <div
            key={idx}
            onClick={() => onTileClick(faceName, idx)}
            className={clsx(
              'w-6 h-6 sm:w-8 sm:h-8 rounded-sm transition-colors duration-200 border border-black/20',
              colorMap[color],
              'cursor-pointer hover:brightness-110 active:scale-95'
            )}
          />
        );
      })}
    </div>
  );
};

export const CubeInput4x4 = ({ cubeState, onTileClick }) => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="cube-grid">
        <FaceGrid4x4
          className="face-u"
          faceName="U"
          colors={cubeState.U}
          onTileClick={onTileClick}
        />
        <FaceGrid4x4
          className="face-l"
          faceName="L"
          colors={cubeState.L}
          onTileClick={onTileClick}
        />
        <FaceGrid4x4
          className="face-f"
          faceName="F"
          colors={cubeState.F}
          onTileClick={onTileClick}
        />
        <FaceGrid4x4
          className="face-r"
          faceName="R"
          colors={cubeState.R}
          onTileClick={onTileClick}
        />
        <FaceGrid4x4
          className="face-b"
          faceName="B"
          colors={cubeState.B}
          onTileClick={onTileClick}
        />
        <FaceGrid4x4
          className="face-d"
          faceName="D"
          colors={cubeState.D}
          onTileClick={onTileClick}
        />
      </div>
    </div>
  );
};
