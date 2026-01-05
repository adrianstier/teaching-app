import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SyllabusAnalysis {
  overallScore: number;
  improvementPriority: string[];
  parsedData: {
    courseTitle: string;
    term: string;
    instructor?: string;
    learningOutcomes: string[];
    weeklySchedule: WeekPlan[];
  };
  workloadAnalysis: {
    weeklyBreakdown: Array<{
      week: number;
      topics: number;
      totalLoad: number;
      status: string;
    }>;
    gaps: Array<{
      description: string;
      severity: string;
    }>;
    recommendations: Array<{
      type: string;
      description: string;
    }>;
  };
  conceptMap: {
    nodes: Array<{
      id: string;
      concept: string;
      week: number;
    }>;
  };
}

interface WeekPlan {
  weekNumber: number;
  topics: string[];
  estimatedStudentHours: number;
}

const SyllabusAnalyzer: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [syllabusContent, setSyllabusContent] = useState('');
  const [analysis, setAnalysis] = useState<SyllabusAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx'];

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      alert('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    setUploadedFile(file);
    setIsProcessingFile(true);

    try {
      let content = '';

      if (file.type === 'text/plain' || fileExtension === '.txt') {
        content = await file.text();
      } else {
        // For PDF/DOC files, send to backend for parsing
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/syllabus/${sessionId}/parse-file`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to parse file');
        }

        const result = await response.json();
        content = result.content;
      }

      setSyllabusContent(content);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try pasting the content manually.');
      setUploadedFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  }, [sessionId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setSyllabusContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!syllabusContent.trim()) {
      alert('Please enter or paste your syllabus content');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch(`http://localhost:5001/api/syllabus/${sessionId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabusContent })
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.data);
      } else {
        alert('Failed to analyze syllabus: ' + result.error);
      }
    } catch (error) {
      console.error('Error analyzing syllabus:', error);
      alert('Failed to analyze syllabus');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!analysis) return;

    setIsOptimizing(true);

    try {
      const response = await fetch(`http://localhost:5001/api/syllabus/${sessionId}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        alert('Optimized syllabus generated! Check the console for details.');
        console.log('Optimized Syllabus:', result.data);
      } else {
        alert('Failed to optimize: ' + result.error);
      }
    } catch (error) {
      console.error('Error optimizing:', error);
      alert('Failed to optimize syllabus');
    } finally {
      setIsOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getWorkloadColor = (status: string) => {
    switch (status) {
      case 'light':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-blue-500';
      case 'heavy':
        return 'bg-yellow-500';
      case 'overloaded':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <DocumentMagnifyingGlassIcon className="h-8 w-8 mr-3 text-green-600" />
          Syllabus Analyzer
        </h1>
        <p className="text-gray-600">
          Transform your syllabus into an intelligent course map with workload optimization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Upload Syllabus</h2>

            <div className="space-y-4">
              {/* File Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : uploadedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {isProcessingFile ? (
                  <div className="py-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Processing file...</p>
                  </div>
                ) : uploadedFile ? (
                  <div className="py-2">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <DocumentTextIcon className="h-8 w-8 text-green-600" />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {uploadedFile.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                    <p className="text-xs text-green-600">
                      File loaded - content extracted below
                    </p>
                  </div>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag & drop your syllabus here
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      or click to browse
                    </p>
                    <p className="text-xs text-gray-400">
                      Supports PDF, DOC, DOCX, TXT
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-sm text-gray-500">or paste content</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syllabus Content
                </label>
                <textarea
                  value={syllabusContent}
                  onChange={(e) => setSyllabusContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={10}
                  placeholder="Paste your complete syllabus here including:&#10;- Course title and info&#10;- Learning outcomes&#10;- Weekly schedule&#10;- Assignments and readings"
                />
                <p className="mt-2 text-xs text-gray-500">
                  {syllabusContent.length} characters
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Analyze Syllabus
                  </>
                )}
              </button>

              {analysis && (
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isOptimizing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                      Generate Optimization
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-2">
          {!analysis ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <DocumentMagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No analysis yet</p>
              <p className="text-sm text-gray-400">Paste your syllabus and click "Analyze"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Overall Quality Score</h2>
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/100
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      analysis.overallScore >= 80 ? 'bg-green-600' :
                      analysis.overallScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${analysis.overallScore}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className={`p-3 rounded-lg ${getScoreBg(analysis.overallScore)}`}>
                    <div className="font-semibold">Course: {analysis.parsedData.courseTitle}</div>
                    <div className="text-gray-600">{analysis.parsedData.term}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <div className="font-semibold">Weeks: {analysis.parsedData.weeklySchedule.length}</div>
                    <div className="text-gray-600">{analysis.parsedData.learningOutcomes.length} outcomes</div>
                  </div>
                </div>
              </motion.div>

              {/* Priority Improvements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-orange-600" />
                  Priority Improvements
                </h2>

                <div className="space-y-2">
                  {analysis.improvementPriority.map((priority, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        priority.startsWith('CRITICAL') ? 'bg-red-50 border-red-200' :
                        priority.startsWith('HIGH') ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start">
                        {priority.startsWith('EXCELLENT') ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
                        )}
                        <span className="text-sm">{priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Workload Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Weekly Workload
                </h2>

                <div className="space-y-3">
                  {analysis.workloadAnalysis.weeklyBreakdown.map((week) => (
                    <div key={week.week} className="flex items-center space-x-3">
                      <div className="w-16 text-sm font-medium text-gray-600">
                        Week {week.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {week.topics} topics • {week.totalLoad}hrs
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                            week.status === 'overloaded' ? 'bg-red-100 text-red-700' :
                            week.status === 'heavy' ? 'bg-yellow-100 text-yellow-700' :
                            week.status === 'moderate' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {week.status}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getWorkloadColor(week.status)}`}
                            style={{ width: `${Math.min(100, (week.totalLoad / 20) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gaps & Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Gaps & Recommendations</h2>

                {analysis.workloadAnalysis.gaps.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Coverage Gaps:</h3>
                    <div className="space-y-2">
                      {analysis.workloadAnalysis.gaps.map((gap, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${getSeverityColor(gap.severity)}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{gap.description}</span>
                            <span className="text-xs font-medium capitalize">{gap.severity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.workloadAnalysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Recommendations:</h3>
                    <div className="space-y-2">
                      {analysis.workloadAnalysis.recommendations.map((rec, i) => (
                        <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded mr-3">
                              {rec.type}
                            </span>
                            <span className="text-sm text-gray-700">{rec.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Concept Map Preview */}
              {analysis.conceptMap && analysis.conceptMap.nodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Concept Map</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {analysis.conceptMap.nodes.slice(0, 9).map((node) => (
                      <div
                        key={node.id}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="text-xs text-green-600 mb-1">Week {node.week}</div>
                        <div className="text-sm font-medium text-gray-900">{node.concept}</div>
                      </div>
                    ))}
                  </div>
                  {analysis.conceptMap.nodes.length > 9 && (
                    <p className="mt-3 text-sm text-gray-500 text-center">
                      +{analysis.conceptMap.nodes.length - 9} more concepts
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyllabusAnalyzer;