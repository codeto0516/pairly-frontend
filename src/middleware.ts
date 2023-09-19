import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    (req: NextRequest) => {},
    {
        callbacks: {
            authorized: ({ token }) => {
                return token ? true : false;
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
);

export const config = {
    matcher: ["/((?!signup|api|signin|password).*)"],
};
