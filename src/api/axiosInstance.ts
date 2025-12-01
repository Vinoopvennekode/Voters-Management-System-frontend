import axios from "axios";
import { loader } from "../../src/components/LoaderManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL // your backend base URL
});

// ✅ Request Interceptor - attach token + show loader
api.interceptors.request.use(
  (config) => {
    loader.show();

    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // If token exists, attach to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    loader.hide();
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - hide loader
api.interceptors.response.use(
  (response) => {
    loader.hide();
    return response;
  },
  (error) => {
    loader.hide();
    return Promise.reject(error);
  }
);

export default api;
