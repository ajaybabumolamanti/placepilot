import axios from 'axios';

// Resolve API base URL:
// In browser: if NEXT_PUBLIC_API_URL is explicitly set to an external domain, use it;
// otherwise use relative path '' which routes through Next.js rewrites to BACKEND_API_URL.
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '') : '';
  }
  return process.env.BACKEND_API_URL ? process.env.BACKEND_API_URL.replace(/\/+$/, '') : 'http://127.0.0.1:8000';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30s timeout to accommodate backend cold starts gracefully
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure global axios defaults so any legacy direct axios imports also benefit
if (typeof window !== 'undefined') {
  axios.defaults.timeout = 30000;
  if (process.env.NEXT_PUBLIC_API_URL) {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // If bearer token exists in localStorage, attach it
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with auto-retry for transient gateway errors (502, 503, 504)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) {
      return Promise.reject(error);
    }

    if (config.retryCount === undefined) {
      config.retry = 2;
      config.retryCount = 0;
    }

    const status = error.response ? error.response.status : null;
    const isGatewayError = status === 502 || status === 503 || status === 504 || error.code === 'ECONNABORTED';

    if (isGatewayError && config.retryCount < config.retry) {
      config.retryCount += 1;
      const delay = Math.pow(2, config.retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
