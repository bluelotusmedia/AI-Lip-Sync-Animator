
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// Helper function to decode base64
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const generateSpeech = async (
  text: string,
  voiceName: string
): Promise<Uint8Array> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not set. Please select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("TTS generation failed: No audio data received.");
    }
    
    return decode(base64Audio);

  } catch (error) {
    console.error("Error generating speech:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        throw new Error("API key is invalid or not found. Please re-select your API key.");
    }
    throw new Error("Failed to generate speech preview. Please check the console for details.");
  }
};


export const generateVideo = async (
  prompt: string,
  imageFile: File,
  aspectRatio: AspectRatio
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not set. Please select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imageBase64 = await fileToBase64(imageFile);

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageBase64,
        mimeType: imageFile.type,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio,
      }
    });

    // Poll for the result
    while (!operation.done) {
      // It's recommended to wait for a few seconds between polling attempts.
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation failed: No download link found.");
    }

    // The download link is an API endpoint. We need to fetch the video data from it.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    
    const videoBlob = await videoResponse.blob();
    
    // Create an object URL from the blob, which can be used in a <video> src attribute
    const videoUrl = URL.createObjectURL(videoBlob);

    return videoUrl;

  } catch (error) {
    console.error("Error generating video:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        throw new Error("API key is invalid or not found. Please re-select your API key.");
    }
    throw new Error("Failed to generate video. Please check the console for details.");
  }
};
