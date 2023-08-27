// customHooks/useApi.ts

import { useUserData } from "@/src/providers/SessionProvider";
import axios from "axios";


type Cache = "force-cache" | "no-cache" | "no-store"

interface ApiConfig extends Api {
    method: string;
    cache: Cache;
}

interface Api {
    url: string;
    data?: {};
    headers?: any;
    cache?: Cache;
}


export const useApi = () => {
    const {user} = useUserData();

    const sendRequest = async <T>(config: ApiConfig): Promise<T | null> => {
        if (!user.idToken) return null;
        try {
            const res = await fetch(config.url, {
                cache: config.cache,
                method: config.method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.idToken}`,
                },
                body: JSON.stringify(config.data),
            });
            const data = await res.json()
            return data as T;
        } catch (error) {
            return null;
        }
    };

    const get = async <T>({ url, headers = {}, cache="no-cache" }: Api): Promise<T | null> => {
        const config = {
            method: "GET",
            headers: headers,
            url: url,
            cache: cache,
        };
        return await sendRequest<T>(config);
    };

    const post = async <T>({ url, data = {}, headers = {}, cache="no-cache" }: Api): Promise<T | null> => {
        const config = {
            method: "POST",
            headers: headers,
            url: url,
            data: data,
            cache: cache
        };

        return await sendRequest<T>(config);
    };

    const put = async <T>({ url, data = {}, headers = {}, cache="no-cache" }: Api): Promise<T | null> => {
        
        const config = {
            method: "PUT",
            headers: headers,
            url: url,
            data: data,
            cache: cache,
        };
        return await sendRequest<T>(config);
    };

    const del = async <T>({ url, headers = {}, cache="no-cache" }: Api): Promise<T | null> => {
        const config = {
            method: "DELETE",
            headers: headers,
            url: url,
            cache: cache,
        };
        return await sendRequest<T>(config);
    };

    return { get, post, put, del };
};
