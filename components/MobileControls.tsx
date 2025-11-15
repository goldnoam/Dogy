
import React from 'react';

interface MobileControlsProps {
  onTouchStart: (keyCode: string) => void;
  onTouchEnd: (keyCode: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onTouchStart, onTouchEnd }) => {
  // Prevents default touch behaviors like scrolling or zooming
  const handleContainerTouch = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const dPadButtonBaseClasses = "w-full h-full bg-gray-800 bg-opacity-80 text-3xl sm:text-5xl text-white flex items-center justify-center select-none active:bg-gray-700 active:scale-95 transition-transform border-2 sm:border-4 border-gray-600 shadow-inner";
  const actionButtonClasses = "w-20 h-20 sm:w-24 sm:h-24 bg-red-600 bg-opacity-80 rounded-full text-white flex flex-col items-center justify-center select-none active:bg-red-500 active:scale-95 transition-transform border-2 sm:border-4 border-red-800 shadow-xl";

  return (
    <div 
      className="w-full h-auto mt-2 p-2 sm:p-4 flex justify-between items-center"
      onTouchStart={handleContainerTouch}
      onTouchMove={handleContainerTouch} // Prevent scrolling while dragging finger
    >
      {/* D-Pad using Grid for a classic look */}
      <div className="grid grid-cols-3 grid-rows-3 pointer-events-auto w-36 h-36 sm:w-52 sm:h-52 shadow-2xl">
        {/* Up (Jump) */}
        <div className="col-start-2 row-start-1">
            <button
              onTouchStart={() => onTouchStart('ArrowUp')}
              className={`${dPadButtonBaseClasses} rounded-t-xl`}
              aria-label="Jump"
            >
              ▲
            </button>
        </div>
        {/* Left */}
        <div className="col-start-1 row-start-2">
            <button
              onTouchStart={() => onTouchStart('ArrowLeft')}
              onTouchEnd={() => onTouchEnd('ArrowLeft')}
              className={`${dPadButtonBaseClasses} rounded-l-xl`}
              aria-label="Move Left"
            >
              ◀
            </button>
        </div>
        {/* Center */}
        <div className="col-start-2 row-start-2 bg-gray-800 bg-opacity-80 border-x-2 sm:border-x-4 border-gray-600"></div>
        {/* Right */}
        <div className="col-start-3 row-start-2">
            <button
              onTouchStart={() => onTouchStart('ArrowRight')}
              onTouchEnd={() => onTouchEnd('ArrowRight')}
              className={`${dPadButtonBaseClasses} rounded-r-xl`}
              aria-label="Move Right"
            >
              ▶
            </button>
        </div>
        {/* Down (not used) */}
        <div className="col-start-2 row-start-3 bg-gray-800 bg-opacity-80 rounded-b-xl border-2 sm:border-4 border-gray-600 border-t-0"></div>
      </div>
      
      {/* Action Buttons (A/B) */}
      <div className="flex items-center space-x-3 sm:space-x-5 pointer-events-auto">
        <button
          onTouchStart={() => onTouchStart('Space')}
          className={actionButtonClasses}
          aria-label="Shoot"
        >
          <span className="font-bold text-3xl sm:text-4xl">B</span>
          <span className="text-xs sm:text-sm">Shoot</span>
        </button>
        <button
          onTouchStart={() => onTouchStart('ArrowUp')}
          className={`${actionButtonClasses} bg-green-600 border-green-800 active:bg-green-500`}
          aria-label="Jump"
        >
          <span className="font-bold text-3xl sm:text-4xl">A</span>
          <span className="text-xs sm:text-sm">Jump</span>
        </button>
      </div>
    </div>
  );
};
