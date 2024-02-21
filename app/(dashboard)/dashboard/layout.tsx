import Sidebar from "@/components/dashboard/sidebar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

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
            <main className="md:ml-64 h-full">
                {/* Navbar */}
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout;