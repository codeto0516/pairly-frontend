"use client"

import { motion } from "framer-motion";

const Main = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.main
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
