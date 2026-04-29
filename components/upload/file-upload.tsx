'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  tenantId: string;
  category?: 'profile' | 'campaign' | 'asset' | 'contract';
  onUploadComplete?: (url: string, filename: string) => void;
  maxFiles?: number;
  acceptedTypes?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export default function FileUpload({
  tenantId,
  category = 'asset',
  onUploadComplete,
  maxFiles = 10,
  acceptedTypes = 'image/*,video/*,.pdf',
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const newFiles = Array.from(files).slice(0, maxFiles - uploadingFiles.length);

    const newUploadingFiles = newFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (const uploadingFile of newUploadingFiles) {
      try {
        await uploadFile(uploadingFile);
      } catch (error: any) {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === uploadingFile.file
              ? { ...f, status: 'error', error: error.message }
              : f
          )
        );
      }
    }
  };

  const uploadFile = async (uploadingFile: UploadingFile) => {
    const formData = new FormData();
    formData.append('file', uploadingFile.file);
    formData.append('tenantId', tenantId);
    formData.append('category', category);

    try {
      const xhr = new XMLHttpRequest();

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === uploadingFile.file
                ? { ...f, progress }
                : f
            )
          );
        }
      };

      // Handle completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === uploadingFile.file
                ? { ...f, status: 'success', progress: 100, url: response.url }
                : f
            )
          );
          onUploadComplete?.(response.url, response.filename);
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error');
      };

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (error: any) {
      throw error;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500">
          Support: Images (10MB), Videos (100MB), PDFs
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-gray-700">Uploads</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {uploadingFile.file.type.startsWith('image/') ? (
                    <Image className="text-blue-500" size={20} />
                  ) : uploadingFile.file.type.startsWith('video/') ? (
                    <Video className="text-purple-500" size={20} />
                  ) : (
                    <FileText className="text-gray-500" size={20} />
                  )}
                  <div>
                    <p className="font-medium text-sm">{uploadingFile.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {uploadingFile.status === 'success' && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                  {uploadingFile.status === 'error' && (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                  <button
                    onClick={() => removeFile(uploadingFile.file)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              {uploadingFile.status === 'uploading' && (
                <Progress value={uploadingFile.progress} className="h-2" />
              )}
              {uploadingFile.status === 'error' && (
                <p className="text-sm text-red-500">{uploadingFile.error}</p>
              )}
              {uploadingFile.status === 'success' && uploadingFile.url && (
                <a
                  href={uploadingFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View File
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
