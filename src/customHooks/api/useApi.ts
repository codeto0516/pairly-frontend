// customHooks/useApi.ts

import axios from "axios";

interface ApiMethod {
    url: string;
    data?: any;
    headers?: any;
}

interface ApiConfig extends ApiMethod {
    method: string;
}

export const useApi = () => {
    const sendRequest = async <T>(config: ApiConfig): Promise<T | null> => {
        try {
            const response = await axios(config);
            return response as T;
        } catch (error) {
            console.error("API request error:", error);
            return null;
        }
    };

    const get = async <T>({ url, headers = {} }: ApiMethod): Promise<T | null> => {
        const config = {
            method: "GET",
            url: url,
            headers: headers,
        };
        return await sendRequest<T>(config);
    };

    const post = async <T>({ url, data, headers = {} }: ApiMethod): Promise<T | null> => {
        const config = {
            method: "POST",
            url: url,
            data: data,
            headers: headers,
        };
        return await sendRequest<T>(config);
    };

    const put = async <T>({ url, data, headers = {} }: ApiMethod): Promise<T | null> => {
        const config = {
            method: "PUT",
            url: url,
            headers: headers,
        };
        return await sendRequest<T>(config);
    };

    const del = async <T>({ url, headers = {} }: ApiMethod): Promise<T | null> => {
        const config = {
            method: "DELETE",
            url: url,
            headers: headers,
        };
        return await sendRequest<T>(config);
    };

    return { get, post, put, del };
};
