// src/services/api.ts
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      console.error('❌ Error de red');
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    }
    
    if (error.response.status === 401) {
      console.warn('🔒 Sesión expirada');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Si es 404 en desarrollo, devolver datos mock
    if (error.response.status === 404 && import.meta.env.DEV) {
      console.warn(`📦 Endpoint no encontrado: ${error.config?.url} - Usando mock`);
      return Promise.resolve({
        data: { data: [] },
        status: 200,
        statusText: 'OK',
        config: error.config,
        headers: {},
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;