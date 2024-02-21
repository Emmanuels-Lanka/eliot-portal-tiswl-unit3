import Image from "next/image"
import { LogOut } from "lucide-react"

import SidebarRoutes from "./sidebar-routes"

const Sidebar = () => {
    return (
        <div className="flex flex-col justify-between top-0 bottom-0 left-0 min-h-screen w-full z-50 text-white bg-dark">
            <div className="flex flex-col items-start">
                <div className="w-full px-4 py-2">
                    <Image
                        src='/eliot-logo.png'
                        alt="logo"
                        width={90}
                        height={90}
                    />
                </div>
                <div className="w-full overflow-y-auto sidebar-routes">
                    <SidebarRoutes />
                </div>
            </div>
            <div
                className="flex flex-row items-center px-3 py-2.5 mx-4 my-2 gap-3 text-slate-200/80 hover:text-slate-200 hover:bg-white/10 rounded-sm cursor-pointer transition overflow-hidden"
            >
                <LogOut className="w-5 h-5" />
                <p className="text-sm font-semibold">Logout</p>
            </div>
        </div>
    )
}

export default Sidebar