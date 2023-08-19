import axios from "axios";


interface signUpProps {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    password_confirmation: string;
}
export const signUp = async (props: signUpProps): Promise<any> => {
    const res = await axios.post(`http://localhost/api/v1/auth/sign_in`, {
        email: props.email,
        password: props.password,
        password_confirmation: props.password_confirmation,
    });

    console.log(res.headers);
    return await res.data;
};
