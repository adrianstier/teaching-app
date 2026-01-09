import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Lecture Session APIs
export const lectureAPI = {
  createSession: async () => {
    const response = await api.post('/lectures/create');
    return response.data;
  },

  submitIntake: async (sessionId: string, intakeData: any) => {
    const response = await api.post(`/lectures/${sessionId}/intake`, intakeData);
    return response.data;
  },

  getSessionStatus: async (sessionId: string) => {
    const response = await api.get(`/lectures/${sessionId}/status`);
    return response.data;
  },

  getSessionContext: async (sessionId: string) => {
    const response = await api.get(`/lectures/${sessionId}/context`);
    return response.data;
  },

  updatePhaseData: async (sessionId: string, phase: number, data: any) => {
    const response = await api.post(`/lectures/${sessionId}/phase/${phase}`, data);
    return response.data;
  },

  approveCheckpoint: async (sessionId: string, checkpointId: string, approved: boolean, feedback?: string) => {
    const response = await api.post(`/lectures/${sessionId}/checkpoint/${checkpointId}/approve`, {
      approved,
      feedback,
    });
    return response.data;
  },

  getPackage: async (sessionId: string) => {
    const response = await api.get(`/lectures/${sessionId}/package`);
    return response.data;
  },

  updatePackage: async (sessionId: string, updates: any) => {
    const response = await api.patch(`/lectures/${sessionId}/package`, updates);
    return response.data;
  },

  getAllSessions: async () => {
    const response = await api.get('/lectures');
    return response.data;
  },

  deleteSession: async (sessionId: string) => {
    const response = await api.delete(`/lectures/${sessionId}`);
    return response.data;
  },
};

// Agent APIs
export const agentAPI = {
  executeAgent: async (sessionId: string, agentType: string, context?: any, input?: any) => {
    const response = await api.post(`/agents/${sessionId}/execute/${agentType}`, {
      context,
      input,
    });
    return response.data;
  },

  executeAgentsInParallel: async (sessionId: string, agentTypes: string[], context?: any, input?: any) => {
    const response = await api.post(`/agents/${sessionId}/execute-parallel`, {
      agentTypes,
      context,
      input,
    });
    return response.data;
  },

  getAgentInfo: async () => {
    const response = await api.get('/agents/info');
    return response.data;
  },

  getAgentStatus: async (sessionId: string) => {
    const response = await api.get(`/agents/${sessionId}/status`);
    return response.data;
  },
};

// Export APIs
export const exportAPI = {
  getExportPreview: async (sessionId: string) => {
    const response = await api.get(`/export/${sessionId}/preview`);
    return response.data;
  },

  downloadPackage: async (sessionId: string, format: 'zip' | 'json', packageData?: any) => {
    const response = await api.post(
      `/export/${sessionId}/download`,
      packageData ? { format, package: packageData } : { format },
      {
        responseType: format === 'zip' ? 'blob' : 'json',
        params: { format },
      }
    );

    if (format === 'zip') {
      // Create download link for zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lecture-${sessionId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    return response.data;
  },

  downloadJSON: async (sessionId: string) => {
    const response = await api.get(`/lectures/${sessionId}/package`);
    const packageData = response.data.package;

    // Create download link for JSON file
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lecture-${sessionId}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return packageData;
  },
};

// Exercise APIs
export const exerciseAPI = {
  generate: async (content: string, options: any) => {
    const response = await api.post('/exercises/generate', { content, options });
    return response.data;
  },

  getTypes: async () => {
    const response = await api.get('/exercises/types');
    return response.data;
  },
};

// Learning Outcomes APIs
export const learningOutcomesAPI = {
  generate: async (topic: string, level: string, count: number) => {
    const response = await api.post('/learning-outcomes/generate', { topic, level, count });
    return response.data;
  },

  refine: async (outcomes: any[], feedback: string) => {
    const response = await api.post('/learning-outcomes/refine', { outcomes, feedback });
    return response.data;
  },
};

// Syllabus APIs
export const syllabusAPI = {
  analyze: async (content: string) => {
    const response = await api.post('/syllabus/analyze', { content });
    return response.data;
  },

  extractObjectives: async (content: string) => {
    const response = await api.post('/syllabus/extract-objectives', { content });
    return response.data;
  },
};

// Active Learning APIs
export const activeLearningAPI = {
  generateActivities: async (topic: string, duration: number, classSize: number) => {
    const response = await api.post('/active-learning/generate', { topic, duration, classSize });
    return response.data;
  },

  getActivityTypes: async () => {
    const response = await api.get('/active-learning/types');
    return response.data;
  },
};

// Pedagogical Feature APIs
export const pedagogicalAPI = {
  getSpacedRepetition: async (content: string, schedule: string) => {
    const response = await api.post('/pedagogical/spaced-repetition', { content, schedule });
    return response.data;
  },

  getFormativeAssessment: async (topic: string, objectives: string[]) => {
    const response = await api.post('/pedagogical/formative-assessment', { topic, objectives });
    return response.data;
  },

  getCognitiveLoad: async (content: string) => {
    const response = await api.post('/pedagogical/cognitive-load', { content });
    return response.data;
  },

  getMisconceptions: async (topic: string, level: string) => {
    const response = await api.post('/pedagogical/misconceptions', { topic, level });
    return response.data;
  },
};

export default api;
