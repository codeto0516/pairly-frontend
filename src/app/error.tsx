"use client"; // Error components must be Client components

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h1 className="text-xl text-red-600">予期せぬエラーが発生しました。</h1>
            <button onClick={() => reset() }>再実行</button>
        </div>
    );
}
