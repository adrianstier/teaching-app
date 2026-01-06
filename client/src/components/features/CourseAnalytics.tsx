import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';

interface Props {
  sessionId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CourseAnalytics: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'outcomes' | 'engagement'>('overview');

  // Mock data for demonstration
  const mockData = {
    overview: {
      totalStudents: 45,
      averageGrade: 78,
      completionRate: 89,
      atRiskStudents: 5,
    },
    outcomesMastery: [
      { outcome: 'Apply critical analysis to primary sources', mastery: 82 },
      { outcome: 'Construct evidence-based arguments', mastery: 68 },
      { outcome: 'Evaluate historical interpretations', mastery: 75 },
      { outcome: 'Synthesize multiple perspectives', mastery: 61 },
    ],
    engagementMetrics: [
      { week: 'Week 1', attendance: 95, participation: 45, assignments: 100 },
      { week: 'Week 2', attendance: 92, participation: 52, assignments: 95 },
      { week: 'Week 3', attendance: 88, participation: 48, assignments: 92 },
      { week: 'Week 4', attendance: 85, participation: 55, assignments: 88 },
      { week: 'Week 5', attendance: 82, participation: 60, assignments: 85 },
    ],
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-scholarly-slate/10 rounded-lg">
            <ChartBarIcon className="h-7 w-7 text-scholarly-slate" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Course Analytics</h1>
            <p className="text-brand-text mt-1">Data-driven insights for continuous improvement</p>
          </div>
        </div>

        <div className="bg-scholarly-slate/5 rounded-xl p-4 border border-scholarly-slate/20">
          <p className="text-sm text-brand-text">
            <strong className="text-brand-navy">Note:</strong> This dashboard shows sample data for demonstration. Connect your
            LMS to see real course analytics and receive AI-powered recommendations.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6">
        {[
          { id: 'overview', name: 'Overview', icon: ChartBarIcon },
          { id: 'outcomes', name: 'Learning Outcomes', icon: AcademicCapIcon },
          { id: 'engagement', name: 'Engagement', icon: ArrowTrendingUpIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-brand-text hover:bg-brand-bg border border-brand-border-subtle'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-light">Total Students</p>
                  <p className="text-3xl font-bold text-brand-navy">{mockData.overview.totalStudents}</p>
                </div>
                <div className="p-3 bg-scholarly-slate/10 rounded-full">
                  <AcademicCapIcon className="h-6 w-6 text-scholarly-slate" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-light">Average Grade</p>
                  <p className="text-3xl font-bold text-green-600">{mockData.overview.averageGrade}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-light">Completion Rate</p>
                  <p className="text-3xl font-bold text-scholarly-slate">{mockData.overview.completionRate}%</p>
                </div>
                <div className="p-3 bg-scholarly-slate/10 rounded-full">
                  <ClockIcon className="h-6 w-6 text-scholarly-slate" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-light">At-Risk Students</p>
                  <p className="text-3xl font-bold text-red-600">{mockData.overview.atRiskStudents}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="text-xl font-semibold text-brand-navy mb-4">AI-Powered Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-brand-gold/5 rounded-xl border-l-4 border-brand-gold">
                <h3 className="font-medium text-brand-navy">Attention Needed</h3>
                <p className="text-sm text-brand-navy mt-1">
                  5 students have missed 2+ assignments in the past week. Consider reaching out
                  with a check-in message.
                </p>
              </div>
              <div className="p-4 bg-scholarly-sage/5 rounded-xl border-l-4 border-scholarly-sage">
                <h3 className="font-medium text-scholarly-sage">What's Working</h3>
                <p className="text-sm text-brand-navy mt-1">
                  Peer discussion activities show 23% higher engagement than traditional lectures.
                  Consider expanding this format.
                </p>
              </div>
              <div className="p-4 bg-scholarly-slate/5 rounded-xl border-l-4 border-scholarly-slate">
                <h3 className="font-medium text-scholarly-slate">Recommendation</h3>
                <p className="text-sm text-brand-navy mt-1">
                  Based on assessment patterns, adding a low-stakes quiz before Week 6's exam
                  could improve outcomes by ~15%.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="text-xl font-semibold text-brand-navy mb-6">Learning Outcome Mastery</h2>
            <div className="space-y-4">
              {mockData.outcomesMastery.map((outcome, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-navy flex-1">{outcome.outcome}</span>
                    <span className={`text-sm font-medium ${
                      outcome.mastery >= 80 ? 'text-green-600' :
                      outcome.mastery >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {outcome.mastery}%
                    </span>
                  </div>
                  <div className="w-full bg-brand-border-subtle rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        outcome.mastery >= 80 ? 'bg-scholarly-sage/50' :
                        outcome.mastery >= 70 ? 'bg-brand-gold/50' : 'bg-red-500'
                      }`}
                      style={{ width: `${outcome.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-scholarly-slate/5 rounded-xl">
              <h3 className="font-medium text-scholarly-slate mb-2">AI Analysis</h3>
              <p className="text-sm text-brand-navy">
                "Synthesize multiple perspectives" has the lowest mastery (61%). Consider adding
                scaffolded activities that explicitly teach comparison and synthesis skills.
                The elaborative interrogation and connection-making tools can help.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="text-xl font-semibold text-brand-navy mb-4">Outcome-Assessment Alignment</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border-subtle">
                    <th className="text-left py-3 font-medium text-brand-navy">Outcome</th>
                    <th className="text-center py-3 font-medium text-brand-navy">Assessed</th>
                    <th className="text-center py-3 font-medium text-brand-navy">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.outcomesMastery.map((outcome, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 text-brand-navy">{outcome.outcome}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Yes</span>
                      </td>
                      <td className="py-3 text-center text-brand-text">
                        {Math.floor(Math.random() * 3) + 2} assessments
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="text-xl font-semibold text-brand-navy mb-6">Engagement Trends</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border-subtle">
                    <th className="text-left py-3 font-medium text-brand-navy">Week</th>
                    <th className="text-center py-3 font-medium text-brand-navy">Attendance</th>
                    <th className="text-center py-3 font-medium text-brand-navy">Participation</th>
                    <th className="text-center py-3 font-medium text-brand-navy">Assignments</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.engagementMetrics.map((week, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-brand-navy">{week.week}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          week.attendance >= 90 ? 'bg-green-100 text-green-700' :
                          week.attendance >= 80 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {week.attendance}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          week.participation >= 50 ? 'bg-green-100 text-green-700' :
                          week.participation >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {week.participation}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          week.assignments >= 90 ? 'bg-green-100 text-green-700' :
                          week.assignments >= 80 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {week.assignments}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-brand-gold/5 rounded-xl">
              <h3 className="font-medium text-brand-navy mb-2">Trend Alert</h3>
              <p className="text-sm text-brand-navy">
                Attendance has declined 13% over 5 weeks. This is a common mid-semester pattern.
                Consider adding more interactive elements or checking in with students about barriers.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="text-xl font-semibold text-brand-navy mb-4">Activity Impact Analysis</h2>
            <div className="space-y-4">
              {[
                { activity: 'Peer Discussion', engagement: '+23%', learning: '+15%' },
                { activity: 'Practice Quizzes', engagement: '+12%', learning: '+28%' },
                { activity: 'Case Studies', engagement: '+18%', learning: '+21%' },
                { activity: 'Traditional Lecture', engagement: 'baseline', learning: 'baseline' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-lg">
                  <span className="font-medium text-brand-navy">{item.activity}</span>
                  <div className="flex space-x-4 text-sm">
                    <span className={item.engagement === 'baseline' ? 'text-brand-text-light' : 'text-green-600'}>
                      Engagement: {item.engagement}
                    </span>
                    <span className={item.learning === 'baseline' ? 'text-brand-text-light' : 'text-scholarly-slate'}>
                      Learning: {item.learning}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Connect LMS CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-2xl p-8 text-white text-center"
      >
        <h3 className="text-2xl font-bold mb-3">Connect Your LMS</h3>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Get real-time analytics by connecting your Learning Management System.
          We support Canvas, Blackboard, Moodle, and more.
        </p>
        <button className="px-6 py-3 bg-white text-brand-navy rounded-xl font-medium hover:bg-brand-bg transition-colors">
          Connect LMS
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CourseAnalytics;
