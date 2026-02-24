import React, { useState, useRef, useCallback } from "react";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ 
  onFilesSelected, 
  accept = "image/*",
  maxFiles 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    let newFiles = Array.from(fileList);
    if (maxFiles && newFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files.`);
        newFiles = newFiles.slice(0, maxFiles);
    }
    onFilesSelected(newFiles);
  }, [onFilesSelected, maxFiles]);

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`relative w-full h-64 border-4 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer group
        ${dragActive 
          ? "border-indigo-500 bg-indigo-50 scale-[1.02]" 
          : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        }`}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      onDrop={onDrop}
      onClick={onButtonClick}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      
      <div className="pointer-events-none flex flex-col items-center gap-4">
        <svg 
          className={`w-16 h-16 text-gray-400 transition-colors ${dragActive ? 'text-indigo-500' : 'group-hover:text-indigo-400'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div>
          <p className="text-xl font-medium text-gray-700">
            {dragActive ? "Drop files here" : "Drag & Drop files here"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            or click to browse
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;
