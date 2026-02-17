import React, { useRef, useState } from "react";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  accept,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    onFileSelect(file);
  };

  return (
    <div
      className={`border rounded p-4 text-center ${
        isDragging ? "bg-light" : ""
      }`}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="d-none"
        accept={accept}
        onChange={(e) =>
          e.target.files && handleFile(e.target.files[0])
        }
      />

      <i className="bi bi-cloud-upload fs-2 text-primary"></i>
      <p className="mt-2 mb-0 small text-muted">
        Click or Drag file to upload
      </p>
    </div>
  );
};

export default FileUploadZone;
