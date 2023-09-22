"use client";
import { Alert } from "@mui/lab";
import { MailField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";
import { LinkPrimary } from "@/src/components/navigation/Link";
import {
    Form,
    FormBottomLinkWrapperCenter,
    FormSubmitButton,
    FormTitle,
    FormWrapper,
} from "@/src/components/inputs/form/Form";

const Page = () => {
    const { sendPasswordResetEmail, isLoading, successMessage, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        if (email) {
            sendPasswordResetEmail(email);
        }
    };

    return (
        <FormWrapper>
            <FormTitle>パスワード再設定メールを送る</FormTitle>
            <Form onSubmit={handleSubmit}>
                <MailField />
                <FormSubmitButton isLoading={isLoading}>{isLoading ? "送信中..." : "送信"}</FormSubmitButton>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Form>
            <FormBottomLinkWrapperCenter>
                <LinkPrimary href="/signin">ログイン画面に戻る</LinkPrimary>
            </FormBottomLinkWrapperCenter>
        </FormWrapper>
    );
};

export default Page;
