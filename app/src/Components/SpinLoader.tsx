// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="text-center p-8">
      <div className="border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10 animate-spin mx-auto"></div>
    </div>
  );
};

export default LoadingSpinner;