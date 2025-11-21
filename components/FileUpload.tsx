import React, { useCallback, useState } from 'react';
import { FileUp, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (fileData: { base64: string, mimeType: string }) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const corporateTheme = {
    primary: '#09122B',
    secondary: '#14B87C',
    surface: '#F5F7FA',
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    const validTypes = ['application/pdf', 'text/plain'];
    
    // Simple check for mime type, can extend to check extension if mime is empty
    let mimeType = file.type;
    if (!mimeType) {
       if (file.name.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
       else if (file.name.toLowerCase().endsWith('.txt')) mimeType = 'text/plain';
    }

    if (!validTypes.includes(mimeType)) {
      setError('Please upload a valid PDF or TXT file.');
      return;
    }

    // Limit size to 10MB to be safe with base64 in browser memory
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      onFileSelect({ base64, mimeType });
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative group cursor-pointer transition-all duration-300 border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white shadow-sm hover:shadow-md"
        style={{
          borderColor: isDragging ? corporateTheme.primary : '#d1d5db',
          backgroundColor: isDragging ? corporateTheme.surface : 'white',
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.borderColor = corporateTheme.primary + '80';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
      >
        <input
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div 
          className={`p-4 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}
          style={{
            backgroundColor: corporateTheme.surface,
            color: corporateTheme.primary,
          }}
        >
          <FileUp size={32} />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Upload Document
        </h3>
        <p className="text-gray-500 mb-6">
          Drag & drop PDF or TXT. Max size 10MB.
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
          <FileText size={14} />
          <span>Supported: PDF, TXT</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};