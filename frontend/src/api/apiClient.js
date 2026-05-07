import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8080`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;

// ----- Auth -----
export const signup = (data) => apiClient.post('/api/auth/signup', data);
export const login = (data) => apiClient.post('/api/auth/login', data);

// ----- Interview -----
export const generateQuestions = (topic, companies = []) =>
  apiClient.post('/interview-questions/api/interview/generate', { topic, companies });

export const getSupportedTopics = () =>
  apiClient.get('/interview-questions/api/interview/topics');
