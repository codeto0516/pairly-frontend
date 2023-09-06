"use client";

const Main = ({ children }: { children: React.ReactNode }) => {
    return <main className="flex-grow bg-white py-24 flex flex-col justify-center items-center">{children}</main>;
};

export default Main;
