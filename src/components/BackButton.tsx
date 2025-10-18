import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ to, label = 'Back', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center text-secondary hover:text-secondary-dark transition-colors duration-200 font-medium"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </button>
  );
};

export default BackButton;

