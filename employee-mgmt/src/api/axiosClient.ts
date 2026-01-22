import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { hideLoader, showLoader } from "../features/shared/loaderSlice";
import { environment } from "../environment/environment.dev";
import type { Store } from '@reduxjs/toolkit';
import { ACCESS_TOKEN_KEY, TEMP_TOKEN_KEY } from "../utils/constant";

let store: Store | null = null;

export const injectStore = (_store: Store) => {
    store = _store;
};

let isRefreshing = false;

type RefreshSubscriber = (token: string) => void;

let refreshSubscribers: RefreshSubscriber[] = [];

const subscribeTokenRefresh = (callback: RefreshSubscriber) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

// axios instance
const axiosClient: AxiosInstance = axios.create({
    baseURL: environment.baseUrl,
    timeout: 30000,
    withCredentials: true,
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

        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const tempToken = localStorage.getItem(TEMP_TOKEN_KEY);

        // Add auth token
        const token = accessToken ?? tempToken;
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
// axiosClient.interceptors.response.use(
//     (response: AxiosResponse) => {
//         // Hide loader on successful response
//         if (store) {
//             store.dispatch(hideLoader());
//         }
//         return response;
//     },
//     (error) => {
//         // Hide loader on response error
//         if (store) {
//             store.dispatch(hideLoader());
//         }
//         console.log("interceptor", error);
//         // Handle 401 Unauthorized (redirect to login)
//         if (error.response?.status == 401) {
//             localStorage.removeItem(ACCESS_TOKEN_KEY);
//             globalThis.location.href = '/login';
//         }

//         return Promise.reject(error);
//     }
// );

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Hide loader on successful response
        if (store) {
            store.dispatch(hideLoader());
        }
        return response;
    },
    async error => {
        store?.dispatch(hideLoader());

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

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
                globalThis.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
