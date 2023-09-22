"use client";
import { Alert } from "@mui/lab";
import { GoogleSignInButton } from "@/src/components/inputs/button/GoogleSignButton";
import { MailField, PasswordField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";
import { LinkPrimary } from "@/src/components/navigation/Link";
import {
    Form,
    FormBackdrop,
    FormBottomLinkWrapperRight,
    FormDivider,
    FormSubmitButton,
    FormTitle,
    FormWrapper,
} from "@/src/components/inputs/form/Form";

const Page = () => {
    return <SignIn />;
};

export default Page;

const SignIn = () => {
    const { signInWithEmailAndPassword, signInWithGoogle, isLoading, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        if (email && password) {
            await signInWithEmailAndPassword(email, password);
        }
    };

    return (
        <FormWrapper>
            <FormTitle>ログイン</FormTitle>

            <GoogleSignInButton onClick={signInWithGoogle} />

            <FormDivider />

            <Form onSubmit={handleSubmit}>
                <MailField />
                <PasswordField />
                <FormSubmitButton isLoading={isLoading}>{isLoading ? "ログイン中..." : "ログイン"}</FormSubmitButton>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Form>
            <FormBottomLinkWrapperRight>
                <LinkPrimary href="/forgot_password">パスワードを忘れた方はこちら</LinkPrimary>
                <LinkPrimary href="/signup">アカウントを登録していない方はこちら</LinkPrimary>
            </FormBottomLinkWrapperRight>

            <FormBackdrop isLoading={isLoading} />
        </FormWrapper>
    );
};
