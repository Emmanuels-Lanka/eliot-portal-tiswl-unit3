import React from "react";

import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const RootLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const cookieStore = cookies();
    const token: any = cookieStore.get('AUTH_TOKEN');

    let isLoggedIn: boolean = false;
    let email: string = '';

    if (token) {
        isLoggedIn = true;
        const { value } = token;
        const secret = process.env.JWT_SECRET || "";
        const data: any = verify(value, secret);
        email = data.email;
    }

    return (
        <div className="mx-auto max-w-screen-xl p-4">
            {children}
        </div>
    )
}

export default RootLayout;