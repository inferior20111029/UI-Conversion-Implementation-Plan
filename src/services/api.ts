import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

const BASE_URLS = [
  "http://pet-health-os.test/api",
  "http://localhost:8000/api",
  "http://127.0.0.1:8000/api"
];

const api = axios.create({
  baseURL: configuredBaseUrl || BASE_URLS[0],
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

// Inject JWT token into every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Handling & Unwrapping
api.interceptors.response.use(
  (response) => {
    // Return response.data.data if backend follows {success, data} wrapper
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    console.error("[API Error]", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Prevent infinite loop if already on login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error.response?.data ?? { message: "Network error" });
  }
);

export default api;
