import React from 'react';

const CompassLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg 
        width="100" 
        height="100" 
        viewBox="0 0 100 100" 
        className="animate-spin duration-1000"
      >
        {/* Outer circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="#2563eb" 
          strokeWidth="2" 
          fill="none" 
        />
        
        {/* Cardinal directions */}
        <text x="50" y="15" textAnchor="middle" fill="#2563eb" fontSize="14">N</text>
        <text x="85" y="53" textAnchor="middle" fill="#2563eb" fontSize="14">E</text>
        <text x="50" y="90" textAnchor="middle" fill="#2563eb" fontSize="14">S</text>
        <text x="15" y="53" textAnchor="middle" fill="#2563eb" fontSize="14">W</text>
        
        {/* Compass needle */}
        <line 
          x1="50" 
          y1="50" 
          x2="50" 
          y2="20" 
          stroke="#dc2626" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <line 
          x1="50" 
          y1="50" 
          x2="50" 
          y2="80" 
          stroke="#1f2937" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        
        {/* Center dot */}
        <circle 
          cx="50" 
          cy="50" 
          r="4" 
          fill="#2563eb" 
        />
      </svg>
    </div>
  );
}

export default CompassLoader;
