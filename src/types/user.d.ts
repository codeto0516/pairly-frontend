
interface Partner {
    localId: string;
    email: string;
    displayName?: string | null;
    photoUrl?: string | null;
}

export interface User {
    localId: string;
    email: string;
    displayName?: string | null;
    photoUrl?: string | null;
    partner?: Partner | null | undefined;
    token: string;
}

