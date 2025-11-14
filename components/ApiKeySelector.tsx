import React from 'react';

interface ApiKeySelectorProps {
  onApiKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
        try {
            await window.aistudio.openSelectKey();
            // Assume success and let the main component re-verify.
            onApiKeySelected();
        } catch (e) {
            console.error("Error opening API key selector:", e);
        }
    }
  };

  return (
    <div className="text-center flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Welcome to AI Lip-Sync Animator</h2>
      <p className="text-gray-300 mb-6 max-w-md">
        To generate videos using Google's Veo model, you need to select an API key. 
        Your key is stored securely and used only for API requests.
      </p>
      <p className="text-xs text-gray-400 mb-6 max-w-md">
        Please note that using this service may incur costs. For more information, please review the 
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline ml-1">
          billing documentation
        </a>.
      </p>
      <button
        onClick={handleSelectKey}
        className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
      >
        Select API Key
      </button>
    </div>
  );
};

export default ApiKeySelector;