export const RUBIKS_COLORS_RGB = {
  white: [255, 255, 255],
  red: [183, 18, 52],
  green: [0, 155, 72],
  blue: [0, 70, 173],
  orange: [255, 88, 0],
  yellow: [255, 213, 0],
};

// Calculate Euclidean distance between two RGB colors
function colorDistance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

// Map a captured RGB pixel to the closest Rubik's color
export function getClosestColor(r, g, b) {
  let minDistance = Infinity;
  let closestColor = 'white';

  for (const [colorName, rgb] of Object.entries(RUBIKS_COLORS_RGB)) {
    const distance = colorDistance([r, g, b], rgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorName;
    }
  }

  return closestColor;
}

export function extractColorsFromImage(imageElement, canvasElement) {
  const ctx = canvasElement.getContext('2d');
  
  // Assuming the camera frame is square to make things easier,
  // we divide it into a 3x3 grid and sample the center of each cell.
  const width = imageElement.width || imageElement.videoWidth;
  const height = imageElement.height || imageElement.videoHeight;
  
  // Handle edge cases
  if (!width || !height) return Array(9).fill('white');

  canvasElement.width = width;
  canvasElement.height = height;
  ctx.drawImage(imageElement, 0, 0, width, height);

  const cellSizeX = width / 3;
  const cellSizeY = height / 3;
  
  const colors = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // Find the center of the cell
      const centerX = Math.floor(col * cellSizeX + cellSizeX / 2);
      const centerY = Math.floor(row * cellSizeY + cellSizeY / 2);
      
      const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
      const detectedColor = getClosestColor(pixel[0], pixel[1], pixel[2]);
      colors.push(detectedColor);
    }
  }

  return colors;
}
