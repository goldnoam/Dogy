
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

  const dPadButtonBaseClasses = "w-full h-full bg-gray-800 bg-opacity-90 text-4xl sm:text-5xl text-white flex items-center justify-center select-none active:bg-gray-700 active:scale-95 transition-transform border-4 border-gray-600 shadow-inner";
  const actionButtonClasses = "w-24 h-24 sm:w-28 sm:h-28 bg-red-600 bg-opacity-90 rounded-full text-white flex flex-col items-center justify-center select-none active:bg-red-500 active:scale-95 transition-transform border-4 border-red-800 shadow-xl";

  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-auto p-4 sm:p-6 flex justify-between items-end z-30 pointer-events-none"
      onTouchStart={handleContainerTouch}
      onTouchMove={handleContainerTouch} // Prevent scrolling while dragging finger
    >
      {/* D-Pad using Grid for a classic look */}
      <div className="grid grid-cols-3 grid-rows-3 pointer-events-auto w-52 h-52 sm:w-64 sm:h-64 shadow-2xl">
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
        <div className="col-start-2 row-start-2 bg-gray-800 bg-opacity-90 border-y-4 border-x-4 border-gray-600 shadow-inner"></div>
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
        {/* Down (inactive) */}
        <div className="col-start-2 row-start-3">
            <button
              className={`${dPadButtonBaseClasses} rounded-b-xl opacity-60 cursor-not-allowed`}
              aria-label="Down (no action)"
            >
              ▼
            </button>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <button
          onTouchStart={() => onTouchStart('Space')}
          className={actionButtonClasses}
          aria-label="Shoot"
        >
            <span className="text-4xl sm:text-5xl font-bold">B</span>
            <span className="text-sm tracking-wider">SHOOT</span>
        </button>
        <button
          onTouchStart={() => onTouchStart('ArrowUp')}
          className={actionButtonClasses}
          aria-label="Jump"
        >
          <span className="text-4xl sm:text-5xl font-bold">A</span>
          <span className="text-sm tracking-wider">JUMP</span>
        </button>
      </div>
    </div>
  );
};
