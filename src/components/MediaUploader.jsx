'use client'

import { useRef, useState } from "react";

const MediaUploader = ({ files, setFiles, multiple = true }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO'
    }));

    setFiles(prev => {
      if (multiple) {
        return [...prev, ...newFiles];
      } else {
        // Remove old URL
        prev.forEach(f => URL.revokeObjectURL(f.url));
        return newFiles.slice(0, 1); // Only allow one
      }
    });
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  const handleRemove = (index) => {
    const updated = [...files];
    URL.revokeObjectURL(updated[index].url);
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleTriggerClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*,video/*"
        multiple={multiple}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {
        (multiple === true || files?.length === 0) && (
          <div
            className={`text-center cursor-pointer p-12 border-2 rounded-lg transition
            ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-dashed border-primary/30 bg-primary/5'}`}
            onClick={handleTriggerClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <p className="text-base-content/50 mb-3 text-sm">Choose a file with a size up to 2MB.</p>
            <button type="button" className="btn btn-soft btn-sm btn-primary text-nowrap">
              <span className="icon-[tabler--file-upload] size-4.5 shrink-0 mr-2"></span>
              Drag & Drop to Upload
            </button>
            <p className="text-base-content/50 my-2 text-xs">or</p>
            <p className="link link-animated link-primary font-medium text-sm">Browse</p>
          </div>
        )
      }

      {files?.length > 0 && (
        <div className={`mt-3 ${multiple && 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'}`}>
          {files.map((media, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden shadow border hover:shadow-lg transition bg-white">
              {media.type === 'IMAGE' ? (
                <img src={media.url} loading='lazy' alt="Preview" className="max-w-xl max-h-52 object-cover mx-auto" />
              ) : (
                <video src={media.url} controls className="max-w-xl object-cover mx-auto" />
              )}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
