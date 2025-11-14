
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Warming up the AI artists...",
  "Rendering digital pixels...",
  "Composing the virtual scene...",
  "Teaching the avatar its lines...",
  "Synchronizing audio and video streams...",
  "Adding a touch of digital magic...",
  "This can take a few minutes, please wait...",
];

const GenerationProgress: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
      <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-purple-500 mb-6"></div>
      <h2 className="text-2xl font-bold mb-2 text-white">Generating Your Video</h2>
      <p className="text-gray-300 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default GenerationProgress;
