import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';

interface FileUploadProps {
  sessionId?: string;
  onUploadSuccess?: (data: any) => void;
  onSuggestedIntake?: (suggestedIntake: any) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
  extractedData?: any;
}

const MultiFileUpload: React.FC<FileUploadProps> = ({
  sessionId,
  onUploadSuccess,
  onSuggestedIntake
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedSuggestions, setMergedSuggestions] = useState<any>(null);

  const acceptedTypes = ['.pdf', '.docx', '.txt', '.md', '.pptx'];
  const maxFileSize = 20 * 1024 * 1024; // 20MB per file
  const maxFiles = 10;

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
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsProcessing(true);

    // Process each file
    for (const file of files) {
      await handleSingleFile(file);
    }

    setIsProcessing(false);

    // Merge suggestions from all successfully uploaded files
    await mergeSuggestions();
  };

  const handleSingleFile = async (file: File): Promise<void> => {
    const fileId = `${Date.now()}-${Math.random()}`;

    // Validate file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExt)) {
      setUploadedFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'error',
        message: `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
      }]);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setUploadedFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'error',
        message: 'File size exceeds 20MB limit'
      }]);
      return;
    }

    // Set uploading status
    setUploadedFiles(prev => [...prev, {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading'
    }]);

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
        setUploadedFiles(prev => prev.map(f =>
          f.id === fileId ? {
            ...f,
            status: 'success',
            message: 'Analyzed successfully',
            extractedData: result.data
          } : f
        ));

        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        setUploadedFiles(prev => prev.map(f =>
          f.id === fileId ? {
            ...f,
            status: 'error',
            message: result.error || 'Failed to analyze document'
          } : f
        ));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => prev.map(f =>
        f.id === fileId ? {
          ...f,
          status: 'error',
          message: 'Failed to upload document. Please try again.'
        } : f
      ));
    }
  };

  const mergeSuggestions = async () => {
    const successfulFiles = uploadedFiles.filter(f => f.status === 'success' && f.extractedData);

    if (successfulFiles.length === 0) return;

    if (successfulFiles.length === 1) {
      // Single file - use its suggestions directly
      const suggestions = successfulFiles[0].extractedData.suggestedIntake;
      setMergedSuggestions(suggestions);
      if (onSuggestedIntake && suggestions) {
        onSuggestedIntake(suggestions);
      }
      return;
    }

    // Multiple files - merge intelligently
    const allTopics = new Set<string>();
    const allPrereqs = new Set<string>();
    const allGoals = new Set<string>();
    let totalDuration = 0;
    let titleCandidates: string[] = [];

    successfulFiles.forEach(file => {
      const intake = file.extractedData?.suggestedIntake;
      if (!intake) return;

      if (intake.title) titleCandidates.push(intake.title);
      if (intake.topic) allTopics.add(intake.topic);
      if (intake.duration) totalDuration += intake.duration;

      intake.prerequisites?.forEach((p: string) => allPrereqs.add(p));
      intake.mainGoals?.forEach((g: string) => allGoals.add(g));
      intake.keyTopics?.forEach((t: string) => allTopics.add(t));
    });

    const merged = {
      title: titleCandidates[0] || 'Multi-Document Lecture',
      topic: Array.from(allTopics).join(', '),
      duration: Math.round(totalDuration / successfulFiles.length) || 60,
      prerequisites: Array.from(allPrereqs),
      mainGoals: Array.from(allGoals),
      keyTopics: Array.from(allTopics)
    };

    setMergedSuggestions(merged);
    if (onSuggestedIntake) {
      onSuggestedIntake(merged);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setTimeout(() => mergeSuggestions(), 100);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const successCount = uploadedFiles.filter(f => f.status === 'success').length;

  return (
    <div className="space-y-4">
      {uploadedFiles.length < maxFiles && (
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
            <label htmlFor="file-upload-multi" className="cursor-pointer">
              <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Upload documents
              </span>
              <input
                id="file-upload-multi"
                name="file-upload-multi"
                type="file"
                className="sr-only"
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                disabled={isProcessing}
                multiple
              />
            </label>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOCX, TXT, MD, PPTX up to 20MB each (max {maxFiles} files)
          </p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FolderIcon className="h-5 w-5" />
              <span>{uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded</span>
              {successCount > 0 && (
                <span className="text-green-600">({successCount} analyzed)</span>
              )}
            </div>
            {uploadedFiles.length > 0 && (
              <button
                onClick={() => setUploadedFiles([])}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            )}
          </div>

          {uploadedFiles.map(file => (
            <div key={file.id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>

                    {file.status === 'uploading' && (
                      <div className="mt-1">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          <span className="text-xs text-gray-600">Analyzing...</span>
                        </div>
                      </div>
                    )}

                    {file.status === 'success' && (
                      <div className="mt-1 flex items-center space-x-1 text-green-600">
                        <CheckCircleIcon className="h-3 w-3" />
                        <span className="text-xs">{file.message}</span>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="mt-1 flex items-center space-x-1 text-red-600">
                        <ExclamationCircleIcon className="h-3 w-3" />
                        <span className="text-xs">{file.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {file.status !== 'uploading' && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-2 text-gray-400 hover:text-gray-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {successCount > 1 && mergedSuggestions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Combined Analysis:</strong> AI has merged content from {successCount} documents.
            Topics, goals, and prerequisites have been intelligently combined.
          </p>
        </div>
      )}

      {successCount === 1 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Analysis Complete:</strong> Document content has been extracted and is ready to use.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;