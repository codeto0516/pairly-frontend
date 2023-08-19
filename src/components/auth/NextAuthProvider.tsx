"use client";
import { LoginButton, LogoutButton } from "@/src/components/elements/button/AuthorizationButton";
import { UserProvider } from "@auth0/nextjs-auth0";

import { SessionProvider } from "next-auth/react";

// const IsAuth = () => {
//     const { data: session } = useSession();

//     return (
//         <div>
//             {session ? (
//                 <div>
//                     <p> ようこそ, {session?.user.name}!</p>
//                     <LogoutButton />
//                 </div>
//             ) : (
//                 <div>
//                     <p>ログインしてください</p>
//                     <LoginButton />
//                 </div>
//             )}
//         </div>
//     );
// };

export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
    // return <SessionProvider>{children}</SessionProvider>;
    return <SessionProvider>{children}</SessionProvider>;
};
 