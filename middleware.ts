// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//     callbacks: {
//         authorized: ({ token }) => {
//             // console.log(token?.email)
            
//             if (token?.email) {
//                 return true;
//             } else {
//                 // console.log(token);

//                 return false;
//             }
//             // return token?.role === "admin";
//         },
//     },
//     pages: {
//         signIn: "/signin",
//     },
// });

// export const config = {
//     matcher: ["/((?!signup|api|signin).*)"],
//     // matcher: ["/", "/partner", "/report", "/setting"],
// };
