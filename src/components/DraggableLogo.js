import React, { useState } from 'react';
import './DraggableLogo.css';

const DraggableLogo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 64 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, offset]);

  return (
    <div
      className={`draggable-logo ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        className="logo-svg"
      >
        {/* Geometric shapes for modern design */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: '#0369a1', stopOpacity: 1 }}
            />
          </linearGradient>

          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0284c7', stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: '#0ea5e9', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* H shape with geometric style */}
        <path
          d="M 60 80 L 60 320 L 100 320 L 100 210 L 160 210 L 160 320 L 200 320 L 200 80 L 160 80 L 160 170 L 100 170 L 100 80 Z"
          fill="url(#grad1)"
        />

        {/* Stylized W - using geometric chevron pattern */}
        <path
          d="M 240 80 L 280 200 L 320 80 L 360 80 L 300 280 L 300 320 L 260 320 L 260 280 L 200 80 Z"
          fill="url(#grad2)"
        />

        {/* Accent circle */}
        <circle cx="330" cy="140" r="25" fill="#0ea5e9" opacity="0.3" />
        <circle cx="80" cy="280" r="20" fill="#1e40af" opacity="0.3" />
      </svg>

      <div className="logo-label">HEISWALKER_304</div>
      <div className="drag-hint">Drag to Move</div>
    </div>
  );
};

export default DraggableLogo;
