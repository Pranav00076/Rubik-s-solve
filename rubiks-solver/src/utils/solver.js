import Cube from 'cubejs';

// Pre-initialize basic generic solver
Cube.initSolver();

export const solveCube = (cubeString) => {
  try {
    const cube = Cube.fromString(cubeString);
    const solution = cube.solve();
    return {
      success: true,
      solution: solution,
      steps: solution.split(' ').filter(Boolean)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Invalid cube configuration'
    };
  }
};

export const validateCubeColors = (cubeState) => {
  // A standard Rubik's cube has exactly 9 tiles of each of the 6 colors
  const colorCounts = {};
  
  Object.values(cubeState).forEach(faceColors => {
    faceColors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
  });

  const isValidCounts = Object.values(colorCounts).every(count => count === 9);
  const totalColors = Object.keys(colorCounts).length;
  
  if (!isValidCounts || totalColors !== 6) {
    return {
      valid: false,
      message: 'Invalid number of colors. Each color must appear exactly 9 times.'
    };
  }

  return { valid: true };
};
