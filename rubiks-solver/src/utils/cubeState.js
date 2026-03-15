export const FACES = ['U', 'R', 'F', 'D', 'L', 'B'];
export const COLORS = ['white', 'red', 'green', 'yellow', 'orange', 'blue'];

export const FACE_TO_COLOR = {
  U: 'white',
  R: 'red',
  F: 'green',
  D: 'yellow',
  L: 'orange',
  B: 'blue',
};

export const COLOR_TO_FACE = Object.fromEntries(
  Object.entries(FACE_TO_COLOR).map(([f, c]) => [c, f])
);

export const getInitialState = () => {
  return FACES.reduce((acc, face) => {
    acc[face] = Array(9).fill(FACE_TO_COLOR[face]);
    return acc;
  }, {});
};

export const generateCubeString = (cubeState) => {
  let result = '';
  // Order must strictly be U R F D L B for cubejs
  FACES.forEach(face => {
    cubeState[face].forEach(color => {
      result += COLOR_TO_FACE[color];
    });
  });
  return result;
};

// Cycle to the next color in the list
export const getNextColor = (currentColor) => {
  const currentIndex = COLORS.indexOf(currentColor);
  return COLORS[(currentIndex + 1) % COLORS.length];
};
