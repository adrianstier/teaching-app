import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LectureProvider } from './context/LectureContext';
import Navigation from './components/Navigation';

// Existing components
import Dashboard from './components/Dashboard';
import LectureWorkflow from './components/LectureWorkflow';
import SyllabusAnalyzer from './components/SyllabusAnalyzer';
import LearningOutcomes from './components/LearningOutcomes';
import ExerciseGenerator from './components/ExerciseGenerator';
import ActiveLearning from './components/ActiveLearning';
import Footer from './components/Footer';

// New pedagogical feature components (lazy loaded)
const SpacedRepetition = lazy(() => import('./components/features/SpacedRepetition'));
const FormativeAssessment = lazy(() => import('./components/features/FormativeAssessment'));
const Metacognition = lazy(() => import('./components/features/Metacognition'));
const CollaborativeLearning = lazy(() => import('./components/features/CollaborativeLearning'));
const AdaptivePathways = lazy(() => import('./components/features/AdaptivePathways'));
const CaseBasedLearning = lazy(() => import('./components/features/CaseBasedLearning'));
const MisconceptionTracker = lazy(() => import('./components/features/MisconceptionTracker'));
const InclusiveDesign = lazy(() => import('./components/features/InclusiveDesign'));
const CognitiveLoad = lazy(() => import('./components/features/CognitiveLoad'));
const GrowthMindset = lazy(() => import('./components/features/GrowthMindset'));
const DesirableDifficulties = lazy(() => import('./components/features/DesirableDifficulties'));
const Elaborative = lazy(() => import('./components/features/Elaborative'));
const TransferLearning = lazy(() => import('./components/features/TransferLearning'));
const LearningScience = lazy(() => import('./components/features/LearningScience'));
const StudentPerspective = lazy(() => import('./components/features/StudentPerspective'));
const CourseAnalytics = lazy(() => import('./components/features/CourseAnalytics'));

// Loading component for suspense
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy border-t-transparent mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  // Generate or retrieve session ID
  useEffect(() => {
    const sessionId = sessionStorage.getItem('teachingAppSessionId') ||
                     `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('teachingAppSessionId', sessionId);
    setCurrentSessionId(sessionId);
  }, []);

  return (
    <Router>
      <LectureProvider>
        <div className="min-h-screen bg-brand-bg">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<LectureWorkflow />} />

                {/* Course Planning */}
                <Route path="/syllabus-analyzer" element={<SyllabusAnalyzer sessionId={currentSessionId} />} />
                <Route path="/learning-outcomes" element={<LearningOutcomes sessionId={currentSessionId} />} />
                <Route path="/adaptive-pathways" element={<AdaptivePathways sessionId={currentSessionId} />} />
                <Route path="/spaced-repetition" element={<SpacedRepetition sessionId={currentSessionId} />} />
                <Route path="/cognitive-load" element={<CognitiveLoad sessionId={currentSessionId} />} />
                <Route path="/inclusive-design" element={<InclusiveDesign sessionId={currentSessionId} />} />

                {/* Teaching Delivery */}
                <Route path="/active-learning" element={<ActiveLearning sessionId={currentSessionId} />} />
                <Route path="/case-based" element={<CaseBasedLearning sessionId={currentSessionId} />} />
                <Route path="/collaborative" element={<CollaborativeLearning sessionId={currentSessionId} />} />
                <Route path="/elaborative" element={<Elaborative sessionId={currentSessionId} />} />
                <Route path="/desirable-difficulties" element={<DesirableDifficulties sessionId={currentSessionId} />} />

                {/* Assessment & Feedback */}
                <Route path="/exercise-generator" element={<ExerciseGenerator sessionId={currentSessionId} />} />
                <Route path="/formative-assessment" element={<FormativeAssessment sessionId={currentSessionId} />} />
                <Route path="/misconceptions" element={<MisconceptionTracker sessionId={currentSessionId} />} />
                <Route path="/metacognition" element={<Metacognition sessionId={currentSessionId} />} />
                <Route path="/transfer" element={<TransferLearning sessionId={currentSessionId} />} />

                {/* Improvement & Analytics */}
                <Route path="/growth-mindset" element={<GrowthMindset sessionId={currentSessionId} />} />
                <Route path="/student-perspective" element={<StudentPerspective sessionId={currentSessionId} />} />
                <Route path="/learning-science" element={<LearningScience sessionId={currentSessionId} />} />
                <Route path="/course-analytics" element={<CourseAnalytics sessionId={currentSessionId} />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </LectureProvider>
    </Router>
  );
}

export default App;
