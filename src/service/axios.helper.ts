// helpers/axios.ts
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

const baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api/v1"; 
const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const axiosInstance: AxiosInstance = axios.create({
  baseURL, // ✅ ab yaha /api/v1 hai
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("access");
    config.headers = config.headers || {};
    config.headers["Authorization"] = token ? `Bearer ${token}` : "";
    config.headers["partner-id"] = "3";
    config.headers["client-time-zone"] = clientTimeZone;
    config.headers["lang-key"] = "en"; // ye backend CORS me allow karna hoga

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      localStorage.clear();
      localStorage.removeItem("redux-root");
      sessionStorage.clear();
      window.stop();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
