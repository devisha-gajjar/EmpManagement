import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { hideLoader, showLoader } from "../features/shared/loaderSlice";
import { environment } from "../environment/environment.dev";
import type { Store } from '@reduxjs/toolkit';

let store: Store | null = null;

export const injectStore = (_store: Store) => {
    store = _store;
};

// Create axios instance
const axiosClient: AxiosInstance = axios.create({
    baseURL: environment.baseUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Show loader if store is available
        if (store) {
            store.dispatch(showLoader());
        }

        // Add auth token
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Hide loader on request error
        if (store) {
            store.dispatch(hideLoader());
        }
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Hide loader on successful response
        if (store) {
            store.dispatch(hideLoader());
        }
        return response;
    },
    (error) => {
        // Hide loader on response error
        if (store) {
            store.dispatch(hideLoader());
        }

        // Handle 401 Unauthorized (redirect to login)
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
