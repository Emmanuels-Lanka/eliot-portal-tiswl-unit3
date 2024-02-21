import { 
    Airplay, 
    Blocks, 
    Cog, 
    LayoutDashboard, 
    ScissorsLineDashed,
    UserRoundCog,
    UserRoundPlus
} from "lucide-react";

export const SIDEBAR_ROUTES = [
    {
        categoryName: null,
        routes: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard
            }
        ]
    },
    {
        categoryName: "ELIoT Devices",
        routes: [
            {
                label: "Add",
                href: "/eliot-devices/create-new",
                icon: Airplay
            },
            {
                label: "Manage",
                href: "/eliot-devices",
                icon: Blocks
            },
        ]
    },
    {
        categoryName: "Sewing Machines",
        routes: [
            {
                label: "Add",
                href: "/sewing-machines/create-new",
                icon: Cog
            },
            {
                label: "Manage",
                href: "/sewing-machines",
                icon: Blocks
            },
        ]
    },
    {
        categoryName: "Sewing Operators",
        routes: [
            {
                label: "Add",
                href: "/sewing-operators/create-new",
                icon: ScissorsLineDashed
            },
            {
                label: "Manage",
                href: "/sewing-operators",
                icon: Blocks
            },
        ]
    },
    {
        categoryName: "Factory Staff",
        routes: [
            {
                label: "Add",
                href: "/factory-staff/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/factory-staff",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Portal User Accounts",
        routes: [
            {
                label: "Add",
                href: "/portal-user/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/portal-user",
                icon: UserRoundCog
            },
        ]
    },

    {
        categoryName: "Portal User Accounts",
        routes: [
            {
                label: "Add",
                href: "/portal-user/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/portal-user",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Portal User Accounts",
        routes: [
            {
                label: "Add",
                href: "/portal-user/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/portal-user",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Portal User Accounts",
        routes: [
            {
                label: "Add",
                href: "/portal-user/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/portal-user",
                icon: UserRoundCog
            },
        ]
    }
]