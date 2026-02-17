import React, { useRef, useState } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
  accept?: string;
  loading?: boolean;
}

export const FileUploadZone: React.FC<Props> = ({ onFileSelect, accept, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`border border-2 border-dashed rounded-3 p-4 text-center transition-all ${isDragging ? 'bg-light border-primary' : 'bg-white'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{ cursor: 'pointer' }}
    >
      <input 
        type="file" 
        className="d-none" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept={accept}
      />
      <i className="bi bi-cloud-arrow-up fs-2 text-muted"></i>
      <p className="mb-0 mt-2 fw-bold small">
        {loading ? 'Uploading...' : 'Click or drag file to upload'}
      </p>
      <p className="xsmall text-muted mb-0">PDF, DOCX, PNG, JPG (Max 10MB)</p>
    </div>
  );
};