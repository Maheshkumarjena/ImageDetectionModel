// components/AnalysisResult.tsx
import React from 'react';

interface AnalysisResultProps {
  result: {
    aiProbability: number;
    photoshopProbability: number;
    originalProbability: number;
    extraData?: string;
  } | null;
}

const formatProbability = (value: number) => `${value.toFixed(1)}%`;

const ProbabilityBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="w-full mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">{formatProbability(value)}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  if (!result) return null;
  console.log('result-------------------->', result);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md text-gray-800">

      {result.originalProbability===0 && result.aiProbability===0 && result.photoshopProbability===0 ?
      <h2 className="mb-6 text-2xl font-bold text-green-400 text-center">Analyzing Image.....</h2> :
      <h2 className="mb-6 text-2xl font-bold text-blue-400 text-center">Analysis Result</h2>

       }
      <div className="space-y-4">
        <ProbabilityBar
          label="AI-Generated"
          value={result.aiProbability}
          color="bg-red-500"
        />
        <ProbabilityBar
          label="Photoshop"
          value={result.photoshopProbability}
          color="bg-yellow-500"
        />
        <ProbabilityBar
          label="Original"
          value={result.originalProbability}
          color="bg-green-500"
        />
      </div>
      {result.extraData && (
        <div className="mt-6 text-sm text-gray-600 text-center border-t pt-4">
          {result.extraData}
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
