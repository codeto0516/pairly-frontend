"use client";

import Loading from "@/src/app/loading";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { Suspense } from "react";

const Main = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
                flex flex-col items-center justify-center
                min-h-screen
                w-full
                bg-white
                py-24
            "
        >
            <div className="container px-2 sm:px-4 max-w-5xl w-full flex justify-center items-center">{children}</div>
        </motion.main>
    );
};

export default Main;
