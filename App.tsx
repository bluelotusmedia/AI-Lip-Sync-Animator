import React, { useState, useEffect, useCallback } from 'react';
import { Step, VoiceOption, AspectRatio } from './types';
import ApiKeySelector from './components/ApiKeySelector';
import StepIndicator from './components/StepIndicator';
import ImageUploader from './components/ImageUploader';
import AvatarCustomization from './components/AvatarCustomization';
import GenerationProgress from './components/GenerationProgress';
import VideoResult from './components/VideoResult';
import { generateVideo } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.API_KEY);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    setIsLoading(true);
    try {
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            setApiKeySelected(true);
            setStep(Step.IMAGE_UPLOAD);
        } else {
            setApiKeySelected(false);
            setStep(Step.API_KEY);
        }
    } catch(e) {
        console.error("Error checking API key", e);
        setApiKeySelected(false);
        setStep(Step.API_KEY);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleApiKeySelected = () => {
    setApiKeySelected(true);
    setStep(Step.IMAGE_UPLOAD);
  };
  
  const resetApiKey = () => {
      setApiKeySelected(false);
      setStep(Step.API_KEY);
      setError("Your API Key was not found or is invalid. Please select it again.");
  }

  const handleImageUploadComplete = (file: File, ar: AspectRatio) => {
    setImageFile(file);
    setAspectRatio(ar);
    setStep(Step.CUSTOMIZATION);
  };

  const handleGenerationStart = async (scriptText: string, background: string, voice: VoiceOption) => {
    setStep(Step.GENERATING);
    setError(null);
    setIsLoading(true);

    if (!imageFile) {
      setError("No image file provided.");
      setStep(Step.IMAGE_UPLOAD);
      setIsLoading(false);
      return;
    }

    const fullPrompt = `A close-up video of a person who looks like the person in the provided image. They are speaking the following words: "${scriptText}". They are speaking in ${voice.description}. ${background ? `The background is ${background}.` : ''} The speech should be clear and the lip movements should be synchronized with the audio.`;

    try {
      const url = await generateVideo(fullPrompt, imageFile, aspectRatio);
      setGeneratedVideoUrl(url);
      setStep(Step.RESULT);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      if (errorMessage.includes("API key")) {
          resetApiKey();
      } else {
          setStep(Step.CUSTOMIZATION);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setImageFile(null);
    setAspectRatio('16:9');
    setGeneratedVideoUrl(null);
    setError(null);
    setStep(Step.IMAGE_UPLOAD);
  };

  const renderContent = () => {
    if (isLoading && step === Step.API_KEY) {
      return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div></div>;
    }
    
    switch (step) {
      case Step.API_KEY:
        return <ApiKeySelector onApiKeySelected={handleApiKeySelected} />;
      case Step.IMAGE_UPLOAD:
        return <ImageUploader onComplete={handleImageUploadComplete} />;
      case Step.CUSTOMIZATION:
        return <AvatarCustomization onGenerate={handleGenerationStart} />;
      case Step.GENERATING:
        return <GenerationProgress />;
      case Step.RESULT:
        return <VideoResult videoUrl={generatedVideoUrl} onStartOver={handleStartOver} />;
      default:
        return <ApiKeySelector onApiKeySelected={handleApiKeySelected} />;
    }
  };
  
  const currentStepIndex = step > Step.API_KEY ? step - 1 : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            AI Lip-Sync Animator
          </h1>
          <p className="text-gray-400 mt-2">Bring your photos to life with text-to-speech and perfect lip-syncing.</p>
        </header>

        {step > Step.API_KEY && step < Step.GENERATING && <StepIndicator currentStep={currentStepIndex} />}
        
        {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>}

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 md:p-8 min-h-[400px] flex flex-col justify-center transition-all duration-300">
          {renderContent()}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
            Powered by Google Gemini
        </footer>
      </div>
    </div>
  );
};

export default App;