import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

// Create an Axios instance
const baseURL = import.meta.env.VITE_APP_API_URL;
const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json', // Set default Content-Type to application/json
  },
});

// Add a request interceptor to set additional headers
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('access');
    config.headers = config.headers || {};
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    config.headers['partner-id'] = '3';
    config.headers['client-time-zone'] = clientTimeZone;
    
    // 🔹 Removed i18next reference — just hardcode "en" for now
    config.headers['lang-key'] = 'en';

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor if needed
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      localStorage.clear();
      localStorage.removeItem('redux-root');
      sessionStorage.clear();
      window.stop();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
