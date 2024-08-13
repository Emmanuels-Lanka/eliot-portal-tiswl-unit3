import {
    Airplay,
    AlignHorizontalDistributeCenter,
    BarChart3,
    BarChartHorizontal,
    Blocks,
    Cog,
    FileCog,
    FileSpreadsheet,
    LayoutDashboard,
    LayoutPanelTop,
    Mail,
    PlusSquare,
    ScissorsLineDashed,
    Send,
    ServerCog,
    Settings,
    Sliders,
    UserRoundCog,
    UserRoundPlus
} from "lucide-react";

export const MACHINE_TYPES = [
    { name: "CHAIN STITCH MACHINE", code: "CSM" },
    { name: "APW MACHINE", code: "APW" },
    { name: "POCKET SETTER MACHINE", code: "PKT" },
    { name: "SINGLE NEEDLE LOCK STITCH", code: "SNL" },
    { name: "VELCRO ATTACH", code: "VEL" },
    { name: "FLAT LOCK LOOP MAKER", code: "FLM" },
    { name: "B-Lind Stitch", code: "BLS" },
    { name: "4TH OVER LOCK MACHINE", code: "4OL" },
    { name: "TOP COVER STITCH", code: "CVR" },
    { name: "FEED OF THE ARM R PULLER", code: "FAP" },
    { name: "KANSAI SPECIEAL", code: "KAN" },
    { name: "VERTICAL MACHINE", code: "SNV" },
    { name: "6th OVER LOCK MACHINE", code: "6OL" },
    { name: "KNOCK DRWN KANSAI", code: "KKS" },
    { name: "BUTTON HOLE", code: "BHM" },
    { name: "DOUBLE NEEDLE LOCK STITCH", code: "DNL" },
    { name: "BARTECK MACHINE", code: "BTM" },
    { name: "BUTTON STITCH", code: "BSM" },
    { name: "EYELET HOLE", code: "EHM" },
    { name: "5th OVER LOCK MACHINE", code: "5OL" },
    { name: "SHADDLE STICH MACHINE", code: "SDL" },
    { name: "FEED OF THE ARM", code: "FOA" },
    { name: "BOTTOM HEM MACHINE", code: "HEM" },
    { name: "LOOP ATTACH", code: "LST" },
    { name: "LONG ARM MC (vitoni)", code: "PSV" },
    { name: "SMOKING KANSAI MACHINE", code: "SMK" }
];

export const MACHINE_BRANDS = [
    { name: "JUKI" },
    { name: "JACK" },
    { name: "DURKOPP ADLER" },
    { name: "VIBE MAC" },
    { name: "KANSAI" },
    { name: "BROTHER" },
    { name: "BOSS" },
    { name: "TREASURE" },
    { name: "ZUSUN" },
    { name: "GOLDEN WHEEL" },
    { name: "TYPICAL" },
    { name: "MORILA" },
    { name: "VI.BE.MAC" },
    { name: "SGGEMSY" },
    { name: "VITONI" },
    { name: "MORATA" },
];

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
        categoryName: null,
        routes: [
            {
                label: "Add Production Lines",
                href: "/production-lines/create-new",
                icon: AlignHorizontalDistributeCenter
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
                href: "/factory-staffs/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/factory-staffs",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Portal Account Users",
        routes: [
            {
                label: "Add",
                href: "/portal-accounts/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/portal-accounts",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Production Lines & Operations",
        routes: [
            {
                label: "Manage Operations",
                href: "/operations",
                icon: Settings
            },
            {
                label: "Manage Production Lines",
                href: "/production-lines",
                icon: ServerCog
            },
        ]
    },
    {
        categoryName: "Operation BreakDown & Balancing Sheet",
        routes: [
            {
                label: "Create OBB Sheet",
                href: "/obb-sheets/create-new",
                icon: FileSpreadsheet
            },
            {
                label: "Manage OBB Sheet",
                href: "/obb-sheets",
                icon: FileCog
            },
        ]
    },
    {
        categoryName: "SMS & Email Alerts",
        routes: [
            {
                label: "Alert logs",
                href: "/alert-logs",
                icon: Send
            },
        ]
    },
    {
        categoryName: "Production Analytics",
        routes: [
            {
                label: "Hourly Achievements",
                href: "/analytics/hourly-production",
                icon: BarChart3
            },
            {
                label: "Achievement Rate",
                href: "/analytics/achievement-rate",
                icon: BarChart3
            }
            
        ]
        
        
    },
    {
        categoryName: "Operation Efficiency Analytics",
        routes: [
            {
                label: "Operation Efficiency (60min)",
                href: "/analytics/operation-efficiency-60",
                icon: BarChartHorizontal
            },
            // {
            //     label: "Operation Efficiency (15min)",
            //     href: "/analytics/operation-efficiency-15",
            //     icon: BarChartHorizontal
            // },
        ]
    },
    {
        categoryName: "Operator Efficiency Analytics",
        routes: [
            {
                label: "Operator Efficiency (60min)",
                href: "/analytics/operator-efficiency-60",
                icon: BarChartHorizontal
            },
            // {
            //     label: "Operator Efficiency (15min)",
            //     href: "/analytics/operator-efficiency-15",
            //     icon: BarChartHorizontal
            // },
        ]
    },
    {
        categoryName: "DHU Status",
        routes: [
            {
                label: "Real-time DHU",
                href: "/analytics/tls-productions",
                icon: BarChartHorizontal
            },
            {
                label: "GMT DHU",
                href: "/analytics/tls-operators",
                icon: BarChartHorizontal
            },
        ]
    },
];

export const HEADER_INFO = [
    {
        label: "Dashboard",
        href: '/dashboard',
        icon: LayoutPanelTop
    },
    {
        label: "Add Production Lines",
        href: "/production-lines/create-new",
        icon: AlignHorizontalDistributeCenter
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
        href: "/factory-staffs/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Factory Staff",
        href: "/factory-staffs",
        icon: UserRoundCog
    },
    {
        label: "Add Portal Account User",
        href: "/portal-accounts/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Portal Account Users",
        href: "/portal-accounts",
        icon: UserRoundCog
    },
    {
        label: "Manage Operations",
        href: "/operations",
        icon: Settings
    },
    {
        label: "Manage Production Lines",
        href: "/production-lines",
        icon: ServerCog
    },
    {
        label: "SMS & Email Alert Logs",
        href: "/alert-logs",
        icon: Mail
    },
    {
        label: "Create OBB Sheet",
        href: "/obb-sheets/create-new",
        icon: FileSpreadsheet
    },
    {
        label: "Manage OBB Sheet",
        href: "/obb-sheets",
        icon: FileCog
    },
    {
        label: "Operator Analytic chart",
        href: "/analytics/operator-efficiency-60",
        icon: BarChartHorizontal
    },
    {
        label: "Operator Analytic chart",
        href: "/analytics/operator-efficiency-15",
        icon: BarChartHorizontal
    },
    {
        label: "Production Analytic charts",
        href: "/analytics/operation-efficiency-60",
        icon: BarChartHorizontal
    },
    {
        label: "Production Analytic charts",
        href: "/analytics/operation-efficiency-15",
        icon: BarChartHorizontal
    },
    {
        label: "Analytic charts for TLS",
        href: "/analytics/tls-productions",
        icon: Sliders
    },
    {
        label: "Analytic charts for TLS",
        href: "/analytics/tls-operators",
        icon: Sliders
    },
]