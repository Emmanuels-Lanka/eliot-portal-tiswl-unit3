import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const RootPage = () => {
    const cookieStore = cookies();
    const token: any = cookieStore.get('AUTH_TOKEN');

    let email: string = '';

    if (token) {
        const { value } = token;
        const secret = process.env.JWT_SECRET || "";
        const data: any = verify(value, secret);
        email = data.email;
    }

    return (
        <div className="root-body-height flex justify-center items-center">
            <div>
                {email ? 
                    <p>You logged email address: <span className="text-slate-600 italic underline hover:text-blue-600 cursor-pointer">{email}</span></p>
                : 
                    <p>You are not logged in yet, please login the account and continue to dashboard!</p>
                }
            </div>
        </div>
    )
}

export default RootPage