import React from 'react';
import { FaceGrid } from './FaceGrid';

export const CubeInput = ({ cubeState, onTileClick }) => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="cube-grid">
        <FaceGrid
          className="face-u"
          faceName="U"
          colors={cubeState.U}
          onTileClick={onTileClick}
        />
        <FaceGrid
          className="face-l"
          faceName="L"
          colors={cubeState.L}
          onTileClick={onTileClick}
        />
        <FaceGrid
          className="face-f"
          faceName="F"
          colors={cubeState.F}
          onTileClick={onTileClick}
        />
        <FaceGrid
          className="face-r"
          faceName="R"
          colors={cubeState.R}
          onTileClick={onTileClick}
        />
        <FaceGrid
          className="face-b"
          faceName="B"
          colors={cubeState.B}
          onTileClick={onTileClick}
        />
        <FaceGrid
          className="face-d"
          faceName="D"
          colors={cubeState.D}
          onTileClick={onTileClick}
        />
      </div>
    </div>
  );
};
