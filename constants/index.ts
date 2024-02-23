import { 
    Airplay, 
    Blocks, 
    Cog, 
    LayoutDashboard, 
    LayoutPanelTop, 
    PlusSquare, 
    ScissorsLineDashed,
    Settings,
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
];

export const HEADER_INFO = [
    {
        label: "Dashboard",
        href: '/dashboard',
        icon: LayoutPanelTop
    },
    {
        label: "Add ELIoT Devices",
        href: "/eliot-devices/create-new",
        icon: PlusSquare
    },
    {
        label: "Manage ELIoT Devices",
        href: "/eliot-devices",
        icon: Settings
    },
    {
        label: "Add Sewing Machines",
        href: "/sewing-machines/create-new",
        icon: PlusSquare
    },
    {
        label: "Manage Sewing Machines",
        href: "/sewing-machines",
        icon: Settings
    },
    {
        label: "Add Sewing Operators",
        href: "/sewing-operators/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Sewing Operators",
        href: "/sewing-operators",
        icon: UserRoundCog
    },
    
    {
        label: "Add Factory Staff",
        href: "/factory-staff/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Factory Staff",
        href: "/factory-staff",
        icon: UserRoundCog
    },
]