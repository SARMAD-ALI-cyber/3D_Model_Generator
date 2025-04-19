import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Image } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!isImageFile(file)) {
        alert('Please upload an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      onImageUpload(file);
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (!isImageFile(file)) {
        alert('Please upload an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      onImageUpload(file);
    }
  };
  
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div
      className={`file-drop-area ${isDragging ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <Image className="text-primary-500 mb-4" size={48} />
      
      <p className="text-lg font-medium mb-2">Drop your image here</p>
      <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
      
      <p className="text-gray-500 text-xs">
        Supported formats: JPEG, PNG, GIF, WebP, BMP
        {isDragging && <span className="text-primary-400"> (Release to upload)</span>}
      </p>
    </div>
  );
};

export default ImageUploader;