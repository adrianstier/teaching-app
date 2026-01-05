import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';

interface FileUploadProps {
  sessionId?: string;
  onUploadSuccess?: (data: any) => void;
  onSuggestedIntake?: (suggestedIntake: any) => void;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
  extractedData?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
  sessionId,
  onUploadSuccess,
  onSuggestedIntake
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const acceptedTypes = ['.pdf', '.docx', '.txt', '.md', '.pptx'];
  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExt)) {
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'error',
        message: `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
      });
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'error',
        message: 'File size exceeds 20MB limit'
      });
      return;
    }

    // Set uploading status
    setUploadedFile({
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading'
    });
    setIsProcessing(true);

    // Upload file
    const formData = new FormData();
    formData.append('document', file);
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }

    try {
      const response = await fetch('http://localhost:5001/api/upload/analyze', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'success',
          message: 'Document analyzed successfully',
          extractedData: result.data
        });

        // Notify parent components
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }

        if (onSuggestedIntake && result.data.suggestedIntake) {
          onSuggestedIntake(result.data.suggestedIntake);
        }
      } else {
        setUploadedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'error',
          message: result.error || 'Failed to analyze document'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'error',
        message: 'Failed to upload document. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {!uploadedFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Upload a document
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
            </label>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOCX, TXT, MD, PPTX up to 20MB
          </p>
        </div>
      )}

      {uploadedFile && (
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <DocumentTextIcon className="h-6 w-6 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadedFile.size)}
                </p>

                {uploadedFile.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">Analyzing document...</span>
                    </div>
                  </div>
                )}

                {uploadedFile.status === 'success' && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-sm">{uploadedFile.message}</span>
                    </div>
                    {uploadedFile.extractedData && (
                      <div className="mt-2 text-xs text-gray-600 space-y-1">
                        {uploadedFile.extractedData.hints?.possibleTitle && (
                          <p>Detected title: {uploadedFile.extractedData.hints.possibleTitle}</p>
                        )}
                        {uploadedFile.extractedData.hints?.estimatedDuration && (
                          <p>Est. duration: {uploadedFile.extractedData.hints.estimatedDuration} min</p>
                        )}
                        {uploadedFile.extractedData.extractedContext?.confidence && (
                          <p>Confidence: {Math.round(uploadedFile.extractedData.extractedContext.confidence * 100)}%</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {uploadedFile.status === 'error' && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-1 text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      <span className="text-sm">{uploadedFile.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {uploadedFile.status !== 'uploading' && (
              <button
                onClick={removeFile}
                className="ml-2 text-gray-400 hover:text-gray-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {uploadedFile?.status === 'success' && uploadedFile.extractedData?.suggestedIntake && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> We've extracted information from your document.
            Click "Apply Suggestions" below to auto-fill the intake form with detected values.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;