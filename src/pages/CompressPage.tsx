import React, { useState } from 'react';
import UploadDropzone from '../components/UploadDropzone';
import FileCard from '../components/common/FileCard';
import ActionButton from '../components/common/ActionButton';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { compressImage } from '../services/api';

const CompressPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<{ original: number, compressed: number } | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setCompressionResult(null); // Reset result on new upload
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) setCompressionResult(null);
  };

  const handleCompressAndDownload = async () => {
     if (files.length === 0) return;
    
    setIsProcessing(true);
    // Approximate original size logic (simple sum for demo, ideally we track detailed per-file)
    const originalSize = files.reduce((acc, f) => acc + f.size, 0);

    try {
      let downloadFilename = "compressed-files";
      const blob = await compressImage(files, (name) => {
        downloadFilename = name;
      });
      
      const compressedSize = blob.size;
      setCompressionResult({
          original: originalSize,
          compressed: compressedSize
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
      console.error("Compression failed", error);
      alert("Failed to compress images. Please check the backend or your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h1 className="text-3xl font-extrabold text-emerald-900 mb-2">Compress Images</h1>
          <p className="text-gray-500">Reduce file size without losing quality.</p>
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

           {/* Results Section */}
           {compressionResult && (
               <section className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 animate-fade-in">
                   <div className="flex justify-between items-center">
                       <div>
                           <p className="text-sm text-gray-600">Original Size</p>
                           <p className="text-lg font-bold text-gray-800">{formatSize(compressionResult.original)}</p>
                       </div>
                       <div className="text-emerald-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                           </svg>
                       </div>
                       <div>
                           <p className="text-sm text-gray-600">Compressed Size</p>
                           <p className="text-lg font-bold text-emerald-600">{formatSize(compressionResult.compressed)}</p>
                       </div>
                       <div className="text-right">
                           <span className="inline-block bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold">
                               Saved {((1 - compressionResult.compressed / compressionResult.original) * 100).toFixed(0)}%
                           </span>
                       </div>
                   </div>
               </section>
           )}

          {/* Action Section */}
          <section className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-end gap-6">
             <div className="w-full md:w-auto">
               <ActionButton 
                  disabled={files.length === 0} 
                  onClick={handleCompressAndDownload}
                  fullWidth
                  className="min-w-[200px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  {isProcessing ? 'Compressing...' : 'Compress Image'}
                </ActionButton>
             </div>
          </section>
        </div>
      </div>
      <LoadingOverlay isLoading={isProcessing} message="Compressing images..." />
    </div>
  );
};

export default CompressPage;
