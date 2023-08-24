import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    (req: NextRequest) => {
        // console.log(req.url);

        // if (req.url === "http://localhost:3000/signin") {
        //     if (req.nextauth?.token) {
        //         console.log("ログイン済みです");

        //         // ログイン済みの場合
        //         return NextResponse.redirect("http://localhost:3000/"); // ホームにリダイレクト
        //     }
        // }
    },
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
    matcher: ["/((?!signup|api|signin).*)"],
    // matcher: ["/", "/report", "/partner", "/setting", "/signin"],
    // matcher: ["/(.*)"],
};
