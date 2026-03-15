import { FACES, FACE_TO_COLOR, COLOR_TO_FACE } from './cubeState';

// 4x4 has 16 tiles per face
export const getInitialState4x4 = () => {
  return FACES.reduce((acc, face) => {
    acc[face] = Array(16).fill(FACE_TO_COLOR[face]);
    return acc;
  }, {});
};

export const generateCubeString4x4 = (cubeState) => {
  let result = '';
  // Order must strictly be U R F D L B
  FACES.forEach(face => {
    cubeState[face].forEach(color => {
      result += COLOR_TO_FACE[color];
    });
  });
  return result;
};

// Validates that there are exactly 16 tiles of each of the 6 colors
export const validateCubeColors4x4 = (cubeState) => {
  const colorCounts = {};
  
  Object.values(cubeState).forEach(faceColors => {
    faceColors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
  });

  const isValidCounts = Object.values(colorCounts).every(count => count === 16);
  const totalColors = Object.keys(colorCounts).length;
  
  if (!isValidCounts || totalColors !== 6) {
    return {
      valid: false,
      message: 'Invalid number of colors. A 4x4 must have exactly 16 of each color.'
    };
  }

  return { valid: true };
};
