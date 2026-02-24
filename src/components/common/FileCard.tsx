import React, { useMemo } from 'react';

interface FileCardProps {
  file: File;
  onRemove: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onRemove }) => {
const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(file.name);

  return (
    <div className="relative group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative w-full aspect-video bg-gray-50 overflow-hidden">
        {isImage && imageUrl ? (
            <img 
              src={imageUrl} 
              alt={file.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        ) : (
             <div className="flex items-center justify-center w-full h-full text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
             </div>
        )}
       
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white transform scale-90 hover:scale-100 shadow-sm"
          title="Remove file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-800 truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs font-medium text-gray-400 mt-1">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};

export default FileCard;
