export const ContainerTop = ({ children }: { children: React.ReactNode }) => {
    return <BaseContainer position="start">{children}</BaseContainer>;
};

export const ContainerCenter = ({ children }: { children: React.ReactNode }) => {
    return <BaseContainer position="center">{children}</BaseContainer>;
};

const BaseContainer = ({
    children,
    position = "start",
}: {
    children: React.ReactNode;
    position: "start" | "center" | "end";
}) => {
    return (
        <div className={`container px-2 sm:px-4 max-w-5xl w-full flex justify-center items-${position} flex-grow`}>
            {children}
        </div>
    );
};
