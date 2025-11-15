
import React from 'react';

interface UnityAnswerProps {
    answer: string;
    isLoading: boolean;
}

export const UnityAnswer: React.FC<UnityAnswerProps> = ({ answer, isLoading }) => {
  return (
    <div className="w-full max-w-4xl mt-8 p-6 bg-gray-800 border border-yellow-300 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-3 text-yellow-300">A Note on Game Engines</h3>
      {isLoading ? (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300"></div>
            <p className="ml-3">Fetching insights from our AI assistant...</p>
        </div>
      ) : (
        <p className="text-gray-300 whitespace-pre-wrap">{answer}</p>
      )}
    </div>
  );
};
