import axios from "axios";
import { environment } from "../environment/environment.dev";

const axiosClient = axios.create({
    baseURL: environment.baseUrl,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        // 401 (Unauthorized)
        if (response && response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;