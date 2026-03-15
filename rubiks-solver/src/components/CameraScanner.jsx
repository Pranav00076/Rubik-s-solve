import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Check, X } from 'lucide-react';
import { FaceGrid } from './FaceGrid';
import { extractColorsFromImage } from '../utils/colorDetector';
import { getNextColor } from '../utils/cubeState';

export const CameraScanner = ({ onScanComplete, onCancel }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedColors, setCapturedColors] = useState(null);

  const capture = useCallback(() => {
    const videoSource = webcamRef.current.video;
    if (videoSource.readyState === videoSource.HAVE_ENOUGH_DATA) {
      const colors = extractColorsFromImage(videoSource, canvasRef.current);
      setCapturedColors(colors);
    }
  }, [webcamRef]);

  const handleTileClick = (faceName, index) => {
    // Only center cannot be changed in standard mode, but for camera scanning,
    // let's assume they are scanning any face, so they can correct anything,
    // though the center technically dictates the face.
    setCapturedColors(prevColors => {
      const newColors = [...prevColors];
      newColors[index] = getNextColor(newColors[index]);
      return newColors;
    });
  };

  const handleConfirm = () => {
    // The center tile color determines which face was scanned
    const finalFaceColor = capturedColors[4];
    onScanComplete(finalFaceColor, capturedColors);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700/50 p-6 rounded-2xl w-full max-w-md flex flex-col items-center shadow-2xl relative">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Camera Scanner</h2>
        
        {!capturedColors ? (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 border-2 border-zinc-700/50">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'environment', aspectRatio: 1 }}
                className="w-full h-full object-cover"
              />
              {/* Overlay Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-50">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="border-2 border-white/50 m-2 rounded-sm" />
                ))}
              </div>
            </div>
            
            <button 
              onClick={capture}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg shadow-lg"
            >
              <Camera size={20} />
              Capture Face
            </button>
            <p className="text-zinc-400 text-sm mt-4 text-center">
              Align a single face within the grid. Center tile determines the face.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <p className="text-zinc-300 mb-4 text-center">
              Review and correct colors by clicking them.
            </p>
            
            <div className="mb-8 scale-150 transform origin-center">
              <FaceGrid 
                colors={capturedColors} 
                onTileClick={handleTileClick} 
                faceName="scanned"
              />
            </div>

            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setCapturedColors(null)}
                className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-bold transition"
              >
                Retake
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition"
              >
                <Check size={20} />
                Confirm
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
