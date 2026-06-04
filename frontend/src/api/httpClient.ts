import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const httpClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

httpClient.interceptors.request.use((config) => {
  config.headers["X-Correlation-Id"] = crypto.randomUUID();
  return config;
});
