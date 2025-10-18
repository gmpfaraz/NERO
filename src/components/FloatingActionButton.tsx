import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position: 'bottom-left' | 'bottom-right';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'purple';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  position,
  color = 'secondary',
}) => {
  const positionClasses = {
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  const colorClasses = {
    primary: 'bg-primary hover:bg-primary-dark',
    secondary: 'bg-secondary hover:bg-secondary-dark',
    accent: 'bg-accent hover:bg-accent-dark',
    success: 'bg-success hover:bg-green-600',
    warning: 'bg-warning hover:bg-yellow-600',
    danger: 'bg-danger hover:bg-red-600',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} ${colorClasses[color]} text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 hover:scale-110 z-30 group`}
      aria-label={label}
      title={label}
    >
      {icon}
      
      {/* Tooltip */}
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </button>
  );
};

export default FloatingActionButton;

