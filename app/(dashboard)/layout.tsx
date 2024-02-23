import DashboardFooter from "@/components/dashboard/dashboard-footer";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-screen w-full">
            <div className="flex felx-col h-full w-64 fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <div className="ml-64 h-full">
                <div className="sticky top-0 w-full z-10 border-b shadow-sm">
                    <DashboardHeader />
                </div>
                <main className="dashboard-main p-4">
                    {children}
                </main>
                <div className="sticky bottom-0 w-full border-t">
                    <DashboardFooter />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout;