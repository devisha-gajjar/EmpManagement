import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";
import type { Store } from "@reduxjs/toolkit";
import { showLoader, hideLoader } from "../features/shared/loaderSlice";
import { environment } from "../environment/environment.dev";
import { ACCESS_TOKEN_KEY } from "../utils/constant";

/* ---------------- Store Injection ---------------- */

let store: Store | null = null;

export const injectStore = (_store: Store) => {
    store = _store;
};

/* ---------------- Refresh State ---------------- */

let isRefreshing = false;

type RefreshSubscriber = (token: string) => void;
let refreshSubscribers: RefreshSubscriber[] = [];

const subscribeTokenRefresh = (callback: RefreshSubscriber) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

/* ---------------- Axios Instance ---------------- */

const axiosClient: AxiosInstance = axios.create({
    baseURL: environment.baseUrl,
    timeout: 30000,
    withCredentials: true, // REQUIRED for refresh token cookie
    headers: {
        "Content-Type": "application/json",
    },
});

/* ---------------- Request Interceptor ---------------- */

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        store?.dispatch(showLoader());

        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    error => {
        store?.dispatch(hideLoader());
        return Promise.reject(error);
    }
);

/* ---------------- Response Interceptor ---------------- */

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        store?.dispatch(hideLoader());
        return response;
    },
    async error => {
        store?.dispatch(hideLoader());

        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If refresh already running → queue request
            if (isRefreshing) {
                return new Promise(resolve => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosClient(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${environment.baseUrl}/auth/refresh`,
                    null,
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.accessToken;

                localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

                isRefreshing = false;
                onRefreshed(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];

                localStorage.removeItem(ACCESS_TOKEN_KEY);
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
