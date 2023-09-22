import { LoadingButton } from "@mui/lab";
import { LinkPrimary } from "../../navigation/Link";
import { Backdrop, CircularProgress } from "@mui/material";

export const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    return <div className="mt-2 flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">{children}</div>;
};

export const FormTitle = ({ children }: { children: React.ReactNode }) => {
    return <h1 className="text-xl mb-4">{children}</h1>;
};

export const FormDivider = () => { 
    return <hr className="border w-full"></hr>;
}

export const Form = ({
    children,
    onSubmit,
}: {
    children: React.ReactNode;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
    return (
        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3 w-full">
            {children}
        </form>
    );
};

export const FormSubmitButton = ({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) => {
    return (
        <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" disabled={isLoading}>
            {children}
        </LoadingButton>
    );
};

export const FormBottomLinkWrapperCenter = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-row justify-center w-full">{children}</div>;
};

export const FormBottomLinkWrapperRight = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-col items-end w-full">{children}</div>;
};


export const FormBackdrop = ({ isLoading }: { isLoading: boolean }) => { 
    return (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}