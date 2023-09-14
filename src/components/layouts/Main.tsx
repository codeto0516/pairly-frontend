"use client";

const Main = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex-grow bg-white py-24 flex flex-col justify-center items-center min-h-screen">
            {children}
        </main>
    );
};

export default Main;
