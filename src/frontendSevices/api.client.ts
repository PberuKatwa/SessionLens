import axios from "axios";

const API_URL:string = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const authorizedApiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


export const setAuthTokenInterceptor = (getToken: () => string | null) => {
  authorizedApiClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token.replace(/["']/g, '')}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const initializeApiClient = function (getToken: () => string | null) {
  try {
    setAuthTokenInterceptor(getToken);
  } catch (error) {
    console.error(`Error in initializing api client`, error)
  }
};
