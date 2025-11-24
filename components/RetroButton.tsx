import React from 'react';

interface RetroButtonProps {
  label: string;
  onClick: () => void;
  color?: 'gray' | 'blue' | 'red' | 'green';
  disabled?: boolean;
  className?: string;
}

const RetroButton: React.FC<RetroButtonProps> = ({ label, onClick, color = 'gray', disabled = false, className = '' }) => {
  const baseClasses = "relative px-2 py-3 md:px-4 md:py-2 font-bold uppercase text-xs md:text-lg border-2 shadow-md active:translate-y-1 active:shadow-none transition-all w-full truncate";
  
  let colorClasses = "";
  switch (color) {
    case 'blue':
      colorClasses = "bg-blue-300 border-blue-900 text-blue-900 shadow-blue-900";
      break;
    case 'red':
      colorClasses = "bg-red-300 border-red-900 text-red-900 shadow-red-900";
      break;
    case 'green':
      colorClasses = "bg-green-300 border-green-900 text-green-900 shadow-green-900";
      break;
    default: // gray/beige
      colorClasses = "bg-[#dcdcdc] border-[#555] text-[#222] shadow-[#333]";
  }

  if (disabled) {
    colorClasses = "bg-gray-500 border-gray-700 text-gray-400 cursor-not-allowed shadow-none";
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${colorClasses} ${className}`}>
      {label}
    </button>
  );
};

export default RetroButton;