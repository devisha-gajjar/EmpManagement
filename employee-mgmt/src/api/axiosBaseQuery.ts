import axiosClient from "./axiosClient";

export const axiosBaseQuery =
    ({ baseUrl = "" } = {}) =>
        async ({ url, method, data, params }: any) => {
            try {
                const result = await axiosClient({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                });
                return { data: result.data };
            } catch (error: any) {
                return {
                    error: {
                        status: error.response?.status,
                        data: error.response?.data || error.message,
                    },
                };
            }
        };
