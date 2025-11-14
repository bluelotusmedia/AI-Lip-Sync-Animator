import React, { useState, useRef } from 'react';
import { VoiceOption } from '../types';
import { generateSpeech } from '../services/geminiService';
import PlayIcon from './icons/PlayIcon';
import SparklesIcon from './icons/SparklesIcon';

interface AvatarCustomizationProps {
  onGenerate: (script: string, backgroundPrompt: string, voice: VoiceOption) => void;
}

// Helper function to decode raw PCM audio data for playback.
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const sampleRate = 24000; // Gemini TTS output sample rate is 24kHz
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  
  return buffer;
}

const voiceOptions: VoiceOption[] = [
  { id: 'Kore', name: 'Kore', description: 'a friendly and clear female voice' },
  { id: 'Puck', name: 'Puck', description: 'a deep and resonant male voice' },
  { id: 'Zephyr', name: 'Zephyr', description: 'a warm and engaging female voice' },
  { id: 'Charon', name: 'Charon', description: 'a calm and professional male voice' },
  { id: 'Fenrir', name: 'Fenrir', description: 'a strong and authoritative male voice' },
  { id: 'alnilam', name: 'Alnilam', description: 'a calm and soothing female voice' },
  { id: 'gacrux', name: 'Gacrux', description: 'a clear and professional male voice' },
  { id: 'umbriel', name: 'Umbriel', description: 'a gentle and warm female voice' },
  { id: 'rasalgethi', name: 'Rasalgethi', description: 'a deep and authoritative male voice' },
  { id: 'vindemiatrix', name: 'Vindemiatrix', description: 'a bright and energetic female voice' },
];

const AvatarCustomization: React.FC<AvatarCustomizationProps> = ({ onGenerate }) => {
  const [script, setScript] = useState('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handlePreview = async (voice: VoiceOption) => {
    if (!script.trim()) {
      setError("Please write a script before previewing a voice.");
      return;
    }
    
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }

    if (previewingVoiceId === voice.id) {
      setPreviewingVoiceId(null);
      return;
    }

    setPreviewingVoiceId(voice.id);
    setError(null);
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioData = await generateSpeech(script, voice.id);
      
      const audioContext = audioContextRef.current;
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const audioBuffer = await decodeAudioData(audioData, audioContext);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      
      audioSourceRef.current = source;
      
      source.onended = () => {
        if (previewingVoiceId === voice.id) setPreviewingVoiceId(null);
        if (audioSourceRef.current === source) audioSourceRef.current = null;
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preview.");
      setPreviewingVoiceId(null);
    }
  };

  const handleGenerateClick = () => {
    if (script.trim() && selectedVoice) {
      onGenerate(script, backgroundPrompt, selectedVoice);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Customize Your Portrait</h2>
      <p className="text-gray-400 mb-6 text-center">Write a script, describe the scene, and choose a voice.</p>
      
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg relative mb-4 text-sm w-full max-w-lg text-center" role="alert">{error}</div>}

      <div className="w-full max-w-lg space-y-4 mb-6">
        <div>
          <label htmlFor="script" className="block text-left text-lg font-medium text-gray-200 mb-2">Portrait's Script</label>
          <textarea id="script" rows={4} value={script} onChange={(e) => setScript(e.target.value)} placeholder="e.g., Hello, world! Welcome to the future." className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"/>
        </div>
        <div>
          <label htmlFor="background" className="block text-left text-lg font-medium text-gray-200 mb-2">Background (Optional)</label>
          <input id="background" type="text" value={backgroundPrompt} onChange={(e) => setBackgroundPrompt(e.target.value)} placeholder="e.g., a futuristic cityscape at night" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"/>
        </div>
      </div>

      <div className="w-full max-w-lg mb-6">
        <h3 className="text-lg font-medium text-gray-200 mb-2 text-left">Select a Voice</h3>
        <div className="space-y-3">
          {voiceOptions.map(voice => (
            <div key={voice.id} onClick={() => setSelectedVoice(voice)} role="radio" aria-checked={selectedVoice?.id === voice.id} className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedVoice?.id === voice.id ? 'border-purple-500 bg-purple-900/50' : 'border-gray-700 hover:border-gray-600'}`}>
              <div>
                <p className="font-semibold text-lg text-left">{voice.name}</p>
                <p className="text-sm text-gray-400 text-left capitalize">{voice.description}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handlePreview(voice); }} disabled={previewingVoiceId === voice.id} className="p-2 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-purple-500" aria-label={`Preview voice ${voice.name}`}>
                {previewingVoiceId === voice.id ? <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div> : <PlayIcon className="w-6 h-6" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleGenerateClick} disabled={!script.trim() || !selectedVoice} className="w-full max-w-lg px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all transform hover:scale-105 flex items-center justify-center">
        <SparklesIcon className="w-5 h-5 mr-2" />
        Generate Video
      </button>
    </div>
  );
};

export default AvatarCustomization;