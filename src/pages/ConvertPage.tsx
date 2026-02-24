import React, { useState } from 'react';
import UploadDropzone from '../components/UploadDropzone';
import FileCard from '../components/common/FileCard';
import ActionButton from '../components/common/ActionButton';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { convertImage } from '../services/api';

const ConvertPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<string>('png');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvertAndDownload = async () => {
     if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      let downloadFilename = "converted-files";
      const blob = await convertImage(files, format, (name) => {
        downloadFilename = name;
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Conversion failed", error);
      alert("Failed to convert images. Please check the backend or your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-3xl font-extrabold text-indigo-900 mb-2">Convert Images</h1>
          <p className="text-gray-500">Transform your images to different formats instantly.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Upload Section */}
          <section>
            <UploadDropzone onFilesSelected={handleFilesSelected} />
          </section>

          {/* Selected Files Grid */}
          {files.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Selected Files ({files.length})</h3>
                <button 
                  onClick={() => setFiles([])}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file, idx) => (
                  <FileCard key={`${file.name}-${idx}`} file={file} onRemove={() => removeFile(idx)} />
                ))}
              </div>
            </section>
          )}

          {/* Controls & Action */}
          <section className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col gap-2 w-full md:w-auto">
                <label className="text-sm font-medium text-gray-700">Target Format</label>
                <div className="flex flex-wrap gap-2">
                  {['png', 'jpg', 'webp'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                        format === fmt 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
             </div>

             <div className="w-full md:w-auto">
               <ActionButton 
                  disabled={files.length === 0} 
                  onClick={handleConvertAndDownload}
                  fullWidth
                  className="min-w-[200px]"
                >
                  {isProcessing ? 'Converting...' : `Convert to ${format.toUpperCase()}`}
                </ActionButton>
             </div>
          </section>
        </div>
      </div>
      <LoadingOverlay isLoading={isProcessing} message="Converting images..." />
    </div>
  );
};

export default ConvertPage;
