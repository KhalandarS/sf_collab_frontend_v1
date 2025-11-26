import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <div className="text-white text-xl font-semibold">Loading...</div>
        <div className="text-gray-400 text-sm">Please wait while we set things up</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
