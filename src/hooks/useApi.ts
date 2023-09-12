// customHooks/useApi.ts

import { auth } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import { useUserData } from "@/src/providers/SessionProvider";

type Cache = "force-cache" | "no-cache" | "no-store";

interface ApiConfig extends Api {
    method: string;
}

interface Api {
    url: string;
    data?: any;
    headers?: any;
    cache?: Cache;
}

export const useApi = () => {
    const { currentUser } = useUserData();
    const sendRequest = async <T>(config: ApiConfig): Promise<T | null> => {
        if (!currentUser) return null;
        try {
            const headers: Record<string, string> = {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser.accessToken}`,
            };

            // オブジェクト型の場合にのみ JSON.stringify を適用
            if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
                headers["Content-Type"] = "application/json";
                config.data = JSON.stringify(config.data);
            }

            const res = await fetch(config.url, {
                cache: config.cache,
                method: config.method,
                headers,
                body: config.data as BodyInit | null | undefined, // オブジェクトをそのまま送信
            });
            const data = await res.json();
            return data as T;
        } catch (error) {
            return null;
        }
    };

    const get = async <T>({ url, headers = {}, cache = "no-cache" }: Api): Promise<T | null> => {
        const config = {
            method: "GET",
            headers: headers,
            url: url,
            cache: cache,
        };

        return await sendRequest<T>(config);
    };

    const post = async <T>({ url, data = {}, headers = {}, cache = "no-cache" }: Api): Promise<T | null> => {
        const config = {
            method: "POST",
            headers: headers,
            url: url,
            data: data,
            cache: cache,
        };

        return await sendRequest<T>(config);
    };

    const put = async <T>({ url, data, headers = {}, cache = "no-cache" }: Api): Promise<T | null> => {
        const config = {
            method: "PUT",
            headers: headers,
            url: url,
            data: data,
            cache: cache,
        };

        return await sendRequest<T>(config);
    };

    const del = async <T>({ url, headers = {}, cache = "no-cache" }: Api): Promise<T | null> => {
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