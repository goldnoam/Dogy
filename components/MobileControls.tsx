
import React from 'react';

interface MobileControlsProps {
  onTouchStart: (keyCode: string) => void;
  onTouchEnd: (keyCode: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onTouchStart, onTouchEnd }) => {
  // Prevents the default touch behavior (like scrolling or zooming)
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
  };
    
  return (
    <div className="absolute bottom-0 left-0 w-full h-full z-30" onTouchStart={handleTouch} onTouchEnd={handleTouch}>
      {/* Left and Right Movement */}
      <div className="absolute bottom-4 left-4 flex gap-4">
        <button
          onTouchStart={() => onTouchStart('ArrowLeft')}
          onTouchEnd={() => onTouchEnd('ArrowLeft')}
          className="w-20 h-20 bg-black bg-opacity-40 rounded-full text-4xl text-white flex items-center justify-center select-none"
          aria-label="Move Left"
        >
          ◀️
        </button>
        <button
          onTouchStart={() => onTouchStart('ArrowRight')}
          onTouchEnd={() => onTouchEnd('ArrowRight')}
          className="w-20 h-20 bg-black bg-opacity-40 rounded-full text-4xl text-white flex items-center justify-center select-none"
          aria-label="Move Right"
        >
          ▶️
        </button>
      </div>

      {/* Action Buttons (Jump and Shoot) */}
      <div className="absolute bottom-4 right-4 flex gap-4">
        <button
          onTouchStart={() => onTouchStart('Space')}
          onTouchEnd={() => onTouchEnd('Space')}
          className="w-20 h-20 bg-black bg-opacity-40 rounded-full text-4xl text-white flex items-center justify-center select-none"
          aria-label="Shoot"
        >
          🦴
        </button>
         <button
          onTouchStart={() => onTouchStart('ArrowUp')}
          onTouchEnd={() => onTouchEnd('ArrowUp')}
          className="w-20 h-20 bg-black bg-opacity-40 rounded-full text-4xl text-white flex items-center justify-center select-none"
          aria-label="Jump"
        >
          🔼
        </button>
      </div>
    </div>
  );
};
