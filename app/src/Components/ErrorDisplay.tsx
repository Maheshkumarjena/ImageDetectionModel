// components/ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  errorMessage: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;
  return (
    <div className="text-center p-4 text-red-600">
      {errorMessage}
    </div>
  );
};

export default ErrorDisplay;