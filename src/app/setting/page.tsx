// "use client";
// import { Global } from "@emotion/react";
// import { styled } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { grey } from "@mui/material/colors";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
// import Typography from "@mui/material/Typography";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import { useState } from "react";
// import { TransactionForm } from "../report/TransactionForm";
// import { format } from "date-fns";
// import { Transaction } from "@/src/types/transaction";

// const drawerBleeding = 40;

// export default function SwipeableEdgeDrawer() {
//     const [open, setOpen] = useState(false);

//     const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

//     const [newTransaction, setNewTransaction] = useState<Transaction>({
//         date: format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"),
//         type: "spending",
//         big_category_id: 1,
//         small_category_id: 1,
//         content: "",
//         user: "まゆみ",
//         description: [
//             { user: "まゆみ", amount: 0 },
//             { user: "たいせい", amount: 0 },
//         ],
//     });
//     return (
//         <div>
//             <Global
//                 styles={{
//                     ".MuiDrawer-root > .MuiPaper-root": {
//                         height: `calc(100% - ${drawerBleeding}px)`,
//                         overflow: "visible",
//                     },
//                 }}
//             />
//             <Box sx={{ textAlign: "center", pt: 1 }}>
//                 <Button onClick={toggleDrawer(true)}>Open</Button>
//             </Box>
//             <SwipeableDrawer
//                 anchor="bottom"
//                 open={open}
//                 onClose={toggleDrawer(false)}
//                 onOpen={toggleDrawer(true)}
//                 swipeAreaWidth={drawerBleeding}
//                 disableSwipeToOpen={false}
//                 ModalProps={{
//                     keepMounted: true,
//                 }}
//                 className=""
//             >
//                 <div className="p-4 flex justify-center">
//                     <div className="w-12 h-1.5 bg-gray-300 rounded"></div>
//                 </div>
//                 <div className="p-4 pb-0.5 h-full overflow-y-visible">
//                     {/* <Skeleton variant="rectangular" height="100%" /> */}
//                     <TransactionForm transaction={newTransaction} />
//                 </div>
//             </SwipeableDrawer>
//         </div>
//     );
// }

const page = () => {
    return <div>Enter</div>;
};

export default page;
