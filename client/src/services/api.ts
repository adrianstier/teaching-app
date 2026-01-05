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
  executeAgent: async (sessionId: string, agentType: string, context: any, input?: any) => {
    const response = await api.post(`/agents/${sessionId}/execute/${agentType}`, {
      context,
      input,
    });
    return response.data;
  },

  getAgentInfo: async () => {
    const response = await api.get('/agents/info');
    return response.data;
  },
};

// Export APIs
export const exportAPI = {
  downloadPackage: async (sessionId: string, format: 'zip' | 'json', packageData: any) => {
    const response = await api.post(`/export/${sessionId}/download`, {
      format,
      package: packageData,
    }, {
      responseType: format === 'zip' ? 'blob' : 'json',
    });

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
};

export default api;