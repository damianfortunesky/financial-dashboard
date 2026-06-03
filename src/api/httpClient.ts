import axios, { AxiosError } from "axios";
import { v4 as uuid } from "uuid";
import type { ApiErrorResponse } from "@/types/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers.set("X-Correlation-Id", uuid());
  return config;
});

export function cleanParams<T extends object>(params?: T) {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

export function getApiErrorMessage(error: unknown) {
  const fallback = "No se pudo completar la operación. Revisá el backend o intentá nuevamente.";
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? axiosError.message ?? fallback;
}
