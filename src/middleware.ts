import { withAuth } from "next-auth/middleware";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        console.log(req.nextauth.token);
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // console.log(token);
                return token?.role === "admin";
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
);

export const config = {
    matcher: ["/((?!signup|api|signin).*)"]
};

