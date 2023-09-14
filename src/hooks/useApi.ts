// customHooks/useApi.ts

import { useUserData } from "@/src/providers/SessionProvider";

type Cache = "force-cache" | "no-cache" | "no-store";

interface ApiConfig extends ApiProps {
    method: string;
}

interface ApiProps {
    url: string;
    data?: any;
    headers?: {};
    cache?: Cache;
}

export interface ApiResponse {
    data: any;
    message: string;
    ok: boolean;
    status: number;
    statusText: string;
}

export const useApi = () => {
    const { currentUser } = useUserData();

    const sendRequest = async <T>(config: ApiConfig): Promise<T | null> => {
        if (!currentUser) return null;
        try {
            const headers: Record<string, string> = {
                Authorization: `Bearer ${currentUser.token}`,
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

            data.ok = res.ok;
            data.status = res.status;
            data.statusText = res.statusText;

            return data as T;
        } catch (error) {
            return null;
        }
    };

    const get = async <T>({ url, headers = {}, cache = "no-cache" }: ApiProps): Promise<T | null> => {
        const config = {
            method: "GET",
            headers: headers,
            url: url,
            cache: cache,
        };

        return await sendRequest<T>(config);
    };

    const post = async <T>({ url, data = {}, headers = {}, cache = "no-cache" }: ApiProps): Promise<T | null> => {
        const config = {
            method: "POST",
            headers: headers,
            url: url,
            data: data,
            cache: cache,
        };

        return await sendRequest<T>(config);
    };

    const put = async <T>({ url, data, headers = {}, cache = "no-cache" }: ApiProps): Promise<T | null> => {
        const config = {
            method: "PUT",
            headers: headers,
            url: url,
            data: data,
            cache: cache,
        };

        return await sendRequest<T>(config);
    };

    const del = async <T>({ url, headers = {}, cache = "no-cache" }: ApiProps): Promise<T | null> => {
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
