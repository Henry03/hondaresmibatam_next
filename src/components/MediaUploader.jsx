'use client'

import { useRef, useState } from "react";

const MediaUploader = ({
  files,
  setFiles,
  multiple = true,
  accept = ['image', 'video'],
  cover = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const getAcceptString = () => {
    const mapping = {
      image: 'image/*',
      video: 'video/*'
    };
    return accept.map(type => mapping[type]).join(',');
  };

  const processFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles)
      // Filter only accepted types
      .filter(file => {
        if (accept.includes('image') && file.type.startsWith('image')) return true;
        if (accept.includes('video') && file.type.startsWith('video')) return true;
        return false;
      })
      .map(file => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO'
      }));

    setFiles(prev => {
      if (multiple) {
        return [...prev, ...newFiles];
      } else {
        prev.forEach(f => URL.revokeObjectURL(f.url));
        return newFiles.slice(0, 1);
      }
    });
  };

  const handleSetCover = (index) => {
    setFiles(prev =>
      prev.map((file, i) => ({
        ...file,
        isCover: i === index
      }))
    );
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
        accept={getAcceptString()}
        multiple={multiple}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {(multiple || files?.length === 0) && (
        <div
          className={`text-center cursor-pointer p-12 border-2 rounded-lg transition
          ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-dashed border-primary/30 bg-primary/5'}`}
          onClick={handleTriggerClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <p className="text-base-content/50 mb-3 text-sm">
            {accept.includes('image') && accept.includes('video') && "Unggah gambar atau video hingga 2MB."}
            {accept.includes('image') && !accept.includes('video') && "Unggah gambar hingga 2MB."}
            {accept.includes('video') && !accept.includes('image') && "Unggah video hingga 2MB."}
          </p>
          <button type="button" className="btn btn-soft btn-sm btn-primary text-nowrap">
            <span className="icon-[tabler--file-upload] size-4.5 shrink-0 mr-2"></span>
            Drag & Drop to Upload
          </button>
          <p className="text-base-content/50 my-2 text-xs">atau</p>
          <p className="link link-animated link-primary font-medium text-sm">Browse</p>
        </div>
      )}

      {files?.length > 0 && (
        <div className={`mt-3 ${multiple && 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'}`}>
          {files.map((media, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden shadow border hover:shadow-lg transition h-52 bg-white">
              {media.type === 'IMAGE' ? (
                <img
                  src={media.url}
                  loading="lazy"
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  className="w-full h-52 object-cover"
                  style={{ display: 'block' }}
                />
              )}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow"
                title="Remove"
              >
                &times;
              </button>
              {
                cover && (
                  <button
                    onClick={() => handleSetCover(index)}
                    className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded 
                      ${media.isCover ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {media.isCover ? 'Cover' : 'Set as Cover'}
                  </button>
                )
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;