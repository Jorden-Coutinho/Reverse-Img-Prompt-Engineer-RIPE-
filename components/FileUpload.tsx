import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, Image as ImageIcon, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  onFileSelect: (file: UploadedFile) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    
    // Basic validation
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Please upload a valid image or video file.');
      return;
    }

    if (file.size > 9 * 1024 * 1024) { // 9MB limit for safety in browser base64
       setError('File is too large. Please keep it under 9MB for this demo.');
       return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        // Extract base64 part
        const base64Data = result.split(',')[1];
        
        onFileSelect({
          data: base64Data,
          mimeType: file.type,
          previewUrl: result,
          type: file.type.startsWith('video/') ? 'video' : 'image',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-veo-400 bg-veo-900/20' 
            : 'border-zinc-700 hover:border-veo-500/50 hover:bg-zinc-800/30'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept="image/*,video/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileInput}
          disabled={disabled}
        />
        
        <div className="p-4 rounded-full bg-zinc-900/80 border border-zinc-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-8 h-8 text-veo-300" />
        </div>
        
        <div className="text-center px-4">
          <h3 className="text-lg font-medium text-zinc-100 mb-1">
            Upload Image or Video
          </h3>
          <p className="text-sm text-zinc-400">
            Drag & drop or click to browse
          </p>
          <div className="flex gap-4 justify-center mt-3 text-xs text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1"><ImageIcon size={12} /> JPG, PNG, WEBP</span>
            <span className="flex items-center gap-1"><FileVideo size={12} /> MP4, MOV (Max 9MB)</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-200 text-sm">
           <X size={16} /> {error}
        </div>
      )}
    </div>
  );
};
