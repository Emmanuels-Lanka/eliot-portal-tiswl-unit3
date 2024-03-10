import Image from "next/image"

import SidebarRoutes from "./sidebar-routes"
import SignOutButton from "../auth/signout-button"

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
                <div className="w-full mt-4 overflow-y-auto sidebar-routes">
                    <SidebarRoutes />
                </div>
            </div>
            <SignOutButton />
        </div>
    )
}

export default Sidebar