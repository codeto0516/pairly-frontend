import { useUserData } from "@/src/providers/SessionProvider";
import { useApi } from "./useApi";

interface User {}

export const useUser = () => {
    const api = useApi();

    


    const endPoint = "http://192.168.1.10:80/api/v1/users";

    const getUser = async (userId: string) => {
        const res = await api.get({
            url: `${endPoint}/${userId}`,
            // cache: "force-cache",
        });
        return res
    };

    const editUser = async (userId: string, data: any) => {
        const res = await api.put({
            url: `${endPoint}/${userId}`,
            data: data,
        });
        return res;
    };

    return { getUser, editUser };
};
