"use client";
import { Alert } from "@mui/lab";
import { MailField, ConfirmPasswordField, PasswordField } from "@/src/components/inputs/textField/TextField";
import { GoogleSignUpButton } from "@/src/components/inputs/button/GoogleSignButton";
import { useAuth } from "@/src/hooks/useAuth";
import { LinkPrimary } from "@/src/components/navigation/Link";
import {
    Form,
    FormBackdrop,
    FormBottomLinkWrapperRight,
    FormDivider,
    FormSubmitButton,
    FormTitle,
} from "@/src/components/inputs/form/Form";

const Page = () => {
    return <SignUp />;
};

export default Page;

const SignUp = () => {
    const { signInWithGoogle, signUpWithEmailAndPassword, isLoading, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        const confirmPassword = data.get("conformPassword")?.toString();
        if (email && password && confirmPassword) {
            await signUpWithEmailAndPassword(email, password, confirmPassword);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
            <FormTitle>新規登録</FormTitle>

            <GoogleSignUpButton onClick={signInWithGoogle} />

            <FormDivider />

            <Form onSubmit={handleSubmit}>
                <MailField />
                <PasswordField />
                <ConfirmPasswordField />

                <FormSubmitButton isLoading={isLoading}>{isLoading ? "登録中..." : "登録"}</FormSubmitButton>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Form>
            <FormBottomLinkWrapperRight>
                <LinkPrimary href="/signin">既にアカウントを持っている方はこちら</LinkPrimary>
            </FormBottomLinkWrapperRight>

            <FormBackdrop isLoading={isLoading} />
        </div>
    );
};
