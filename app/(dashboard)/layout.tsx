import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardFooter from "@/components/dashboard/dashboard-footer";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const cookieStore = cookies();
    const token = cookieStore.get('AUTH_TOKEN');

    if (!token) {
        return redirect('/sign-in');
    }

    try {
        const { value } = token;
        const secret = process.env.JWT_SECRET || "";

        verify(value, secret);
        // const verified = verify(value, secret);
        // console.log("VERIFIED",verified);           // output: email
        // Fetch user data based on email from your database
    } catch (error) {
        console.log("AUTHORIZATION_ERROR:", error);
        return redirect('/sign-in');
    } finally {
        return (
            <div className="h-screen w-full">
                <div className="flex felx-col h-full w-64 fixed inset-y-0 z-50">
                    <Sidebar />
                </div>
                <div className="ml-64 h-full">
                    <div className="sticky top-0 w-full z-10 border-b shadow-sm">
                        <DashboardHeader />
                    </div>
                    <main className="dashboard-body-height p-4">
                        {children}
                    </main>
                    <div className="sticky bottom-0 w-full border-t">
                        <DashboardFooter />
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardLayout;