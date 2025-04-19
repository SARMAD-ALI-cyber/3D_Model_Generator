import React, { useState } from 'react';
import { Box, Cuboid as Cube } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ModelViewer from './components/ModelViewer';
import ProgressBar from './components/ProgressBar';
import { convertToPNG } from './utils/imageUtils';
import { generate3DModel } from './services/api';

type AppState = 'upload' | 'processing' | 'viewing';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setError(null);
      setOriginalFile(file);
      
      // Create image preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      
      // Move to processing state
      setAppState('processing');
      setProgress(0);
      
      // Check if the file needs conversion
      let processedFile = file;
      if (file.type !== 'image/png') {
        setProgress(10);
        processedFile = await convertToPNG(file);
        setProgress(20);
      } else {
        setProgress(20);
      }
      
      // Generate 3D model
      const modelBlob = await generate3DModel(processedFile, (progress) => {
        // Map API progress (0-100) to our range (20-90)
        setProgress(20 + (progress * 0.7));
      });
      
      // Create object URL for the model
      const modelUrl = URL.createObjectURL(modelBlob);
      setModel(modelUrl);
      setProgress(100);
      
      // Move to viewing state
      setTimeout(() => {
        setAppState('viewing');
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAppState('upload');
      setProgress(0);
    }
  };

  const handleReset = () => {
    // Clean up URLs
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (model) URL.revokeObjectURL(model);
    
    // Reset state
    setAppState('upload');
    setImagePreview(null);
    setOriginalFile(null);
    setModel(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-center mb-10">
          <Box className="text-primary-500 mr-2" size={32} />
          <h1 className="text-3xl font-bold">3D Model Generator</h1>
        </header>
        
        <main>
          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-200 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {appState === 'upload' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Cube className="text-primary-500 mr-2" size={24} />
                Upload an Image
              </h2>
              <p className="text-gray-400 mb-6">
                Upload an image to generate a 3D model.
              </p>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
          )}
          
          {appState === 'processing' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Processing Image</h2>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/2">
                  {imagePreview && (
                    <div className="rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded preview" 
                        className="max-h-[300px] max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">
                    <ProgressBar progress={progress} />
                  </div>
                  <p className="text-gray-300 text-sm">
                    {progress < 20 && "Preparing image..."}
                    {progress >= 20 && progress < 90 && "Generating 3D model..."}
                    {progress >= 90 && "Finalizing your model..."}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {appState === 'viewing' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Original Image</h2>
                  {imagePreview && (
                    <div className="rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center h-[300px]">
                      <img 
                        src={imagePreview} 
                        alt="Original image" 
                        className="max-h-[300px] max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="mt-3 text-sm text-gray-400">
                    {originalFile && (
                      <p>File: {originalFile.name} ({Math.round(originalFile.size / 1024)} KB)</p>
                    )}
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Generated 3D Model</h2>
                  <div className="rounded-lg overflow-hidden bg-gray-700 h-[300px]">
                    {model && <ModelViewer modelUrl={model} />}
                  </div>
                  <div className="mt-4 flex justify-end">
                    {model && (
                      <a 
                        href={model} 
                        download="3d-model.glb"
                        className="btn btn-accent flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15L12 3M12 15L8 11M12 15L16 11M21 15V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download Model
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  Generate Another Model
                </button>
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 WALEE 3D Model Generator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;