import React, { useState, useCallback, ChangeEvent } from 'react';
import UploadIcon from './icons/UploadIcon';
import { AspectRatio } from '../types';

interface ImageUploaderProps {
  onComplete: (file: File, aspectRatio: AspectRatio) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onComplete }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    if (imageFile) {
      onComplete(imageFile, aspectRatio);
    }
  };
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       setImageFile(file);
       setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  return (
    <div className="flex flex-col items-center text-center p-4">
      <h2 className="text-2xl font-bold mb-2">Upload Your Portrait Image</h2>
      <p className="text-gray-400 mb-6">Choose a clear, front-facing photo.</p>

      <div className="w-full max-w-md mb-6">
        <label
            htmlFor="file-upload"
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="relative block w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <UploadIcon className="w-12 h-12 mb-2" />
              <span className="font-semibold">Click to upload or drag and drop</span>
              <span className="text-sm">PNG, JPG, or WEBP</span>
            </div>
          )}
          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
      </div>

      <div className="w-full max-w-md mb-6">
        <label className="block text-lg font-medium text-gray-200 mb-2">Video Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`p-4 border-2 rounded-lg transition-colors ${aspectRatio === '16:9' ? 'border-purple-500 bg-purple-900/50' : 'border-gray-600 hover:border-gray-500'}`}
          >
            <div className="w-full bg-gray-600 rounded" style={{ aspectRatio: '16/9' }}></div>
            <p className="mt-2 font-semibold">16:9 (Landscape)</p>
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`p-4 border-2 rounded-lg transition-colors ${aspectRatio === '9:16' ? 'border-purple-500 bg-purple-900/50' : 'border-gray-600 hover:border-gray-500'}`}
          >
            <div className="w-full bg-gray-600 rounded" style={{ aspectRatio: '9/16' }}></div>
            <p className="mt-2 font-semibold">9:16 (Portrait)</p>
          </button>
        </div>
      </div>
      
      <button
        onClick={handleNext}
        disabled={!imageFile}
        className="w-full max-w-md px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default ImageUploader;