
import React from 'react';

interface GameObjectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    children: React.ReactNode;
}

export const GameObject: React.FC<GameObjectProps> = React.memo(({ x, y, width, height, children }) => {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      {children}
    </div>
  );
});
