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

  const dPadButtonClasses = "w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 bg-opacity-60 text-3xl sm:text-4xl text-white flex items-center justify-center select-none active:bg-opacity-80 active:scale-95 transition-transform rounded-md";
  const actionButtonClasses = "w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 bg-opacity-60 rounded-full text-white flex flex-col items-center justify-center select-none active:bg-opacity-80 active:scale-95 transition-transform";

  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-auto p-4 sm:p-6 flex justify-between items-end z-30 pointer-events-none"
      onTouchStart={handleContainerTouch}
      onTouchMove={handleContainerTouch} // Prevent scrolling while dragging finger
    >
      {/* D-Pad using Grid for a classic look */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 pointer-events-auto w-48 h-48 sm:w-60 sm:h-60">
        {/* Up (Jump) */}
        <div className="col-start-2 row-start-1 flex justify-center items-center">
            <button
              onTouchStart={() => onTouchStart('ArrowUp')}
              className={dPadButtonClasses}
              aria-label="Jump"
            >
              ▲
            </button>
        </div>
        {/* Left */}
        <div className="col-start-1 row-start-2 flex justify-center items-center">
            <button
              onTouchStart={() => onTouchStart('ArrowLeft')}
              onTouchEnd={() => onTouchEnd('ArrowLeft')}
              className={dPadButtonClasses}
              aria-label="Move Left"
            >
              ◀
            </button>
        </div>
        {/* Right */}
        <div className="col-start-3 row-start-2 flex justify-center items-center">
            <button
              onTouchStart={() => onTouchStart('ArrowRight')}
              onTouchEnd={() => onTouchEnd('ArrowRight')}
              className={dPadButtonClasses}
              aria-label="Move Right"
            >
              ▶
            </button>
        </div>
        {/* Down (inactive) */}
        <div className="col-start-2 row-start-3 flex justify-center items-center">
            <button
              className={`${dPadButtonClasses} opacity-50 cursor-not-allowed`}
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
            <span className="text-3xl sm:text-4xl font-bold">B</span>
            <span className="text-xs tracking-wider">SHOOT</span>
        </button>
        <button
          onTouchStart={() => onTouchStart('ArrowUp')}
          className={actionButtonClasses}
          aria-label="Jump"
        >
          <span className="text-3xl sm:text-4xl font-bold">A</span>
          <span className="text-xs tracking-wider">JUMP</span>
        </button>
      </div>
    </div>
  );
};
