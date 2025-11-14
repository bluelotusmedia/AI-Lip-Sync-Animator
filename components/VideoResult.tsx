import React from 'react';

interface VideoResultProps {
  videoUrl: string | null;
  onStartOver: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, onStartOver }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Your Lip-Synced Portrait is Ready!</h2>
      
      <div className="w-full max-w-md mb-6 bg-black rounded-lg overflow-hidden shadow-lg">
        {videoUrl ? (
          <video src={videoUrl} controls className="w-full" autoPlay loop>
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="aspect-video flex items-center justify-center text-gray-400">
            Video could not be loaded.
          </div>
        )}
      </div>

      <button
        onClick={onStartOver}
        className="w-full max-w-md px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
      >
        Create Another Video
      </button>
    </div>
  );
};

export default VideoResult;