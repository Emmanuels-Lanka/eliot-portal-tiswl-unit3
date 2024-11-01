import {
    Airplay,
    AlignHorizontalDistributeCenter,
    BarChart3,
    BarChartHorizontal,
    Blocks,
    Cable,
    Cog,
    FileCog,
    FileSpreadsheet,
    icons,
    LayoutDashboard,
    LayoutPanelTop,
    Mail,
    PlusSquare,
    ScissorsLineDashed,
    Send,
    ServerCog,
    Settings,
    Sliders,
    Table,
    UserRoundCog,
    TableProperties,
    UserRoundPlus,
    LineChart,
    LocateFixed
} from "lucide-react";

export const ROAMING_QC_DEFECTS = [
    "Broken, Skip , Loose, Stitche",
    "Pucker,Easing, Pleated, Run of",
    "Uneven, Hilow, Unbaance",
    "Oil",
    "Dirt",
    "Shad/unmatching",
    "Fabric Flaws",
    "Other"
]

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
        categoryName: "Live Operator Production Analytics",
        routes: [
            // {
            //     label: "Hourly Achievement",
            //     href: "/analytics/hourly-production",
            //     icon: BarChart3
            // },
            {
                label: "Daily Target vs Actual",
                href: "/analytics/daily-achivement",
                icon: BarChartHorizontal
            },
            {
                label:"Real Time Target vs Actual (Instance)",
                href: "/analytics/daily-achivement-ins",
                icon: BarChartHorizontal
                
            },
            {
                label: "Production Heatmap (15min)",
                href: "/analytics/operation-efficiency-15",
                icon: BarChartHorizontal
            },
            {
                label:"Hourly Production",
                href: "/analytics/production-hourly",
                icon: BarChartHorizontal
                
            },
            // {
            //     label: "Overall Performance",
            //     href: "/analytics/achievement-rate-operation",
            //     icon: BarChart3
            // },
        
            


        ]


    },
    {
        categoryName: "SMV Analytics",
        routes: [
            {
                label: "Cycle Time Analysis",
                href: "/analytics/operation-smv-hourly",
                icon: BarChart3
            },
            {
                label: "SMV vs Cycle Time",
                href: "/analytics/operation-smv",
                icon: BarChart3
            },
            {
                label: "Yamuzami Graph",
                href: "/analytics/yamuzami-graph",
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
            //     href: "/analytics/operation-efficiency-15m",
            //     icon: BarChartHorizontal
            // },
            {
                label: "Overall Operation Efficiency",
                href: "/analytics/efficiency-rate",
                icon: BarChartHorizontal
            },
            {
                label: "Pitch Diagram",
                href: "/analytics/pitch-diagram",
                icon: LineChart  
            },
            {
                label: "Capacity Diagram",
                href: "/analytics/capacity-graph",
                icon: LineChart  
            },


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
            //     label: "Resource Utilization",
            //     href: "/analytics/operator-effective-time",
            //     icon: Table
            // },
            {
                label: "Operator Efficiency (15min)",
                href: "/analytics/operator-efficiency-15",
                icon: BarChartHorizontal
            },
            {
                label: "Top Operators",
                href: "/analytics/top-operator",
                icon: BarChartHorizontal
            },
        ]
    },
    {
        categoryName: "Records",
        routes: [

            {
                label: "Resource Utilization",
                href: "/analytics/operator-effective-time",
                icon: Table
            },
            {
                label: "Logs",
                href: "/analytics/log",
                icon: Table
            },

        ]
    },
    {
        categoryName: "Reports",
        routes: [

            {
                label: "Daily Efficiency Report",
                href: "/analytics/daily-report",
                icon: Table
            },


        ]
    },
    {
        categoryName: "DHU Status",
        routes: [
            // {
            //     label: "Real-time DHU",
            //     href: "/analytics/tls-productions",
            //     icon: BarChartHorizontal
            // },
            {
                label: "GMT DHU",
                href: "/analytics/tls-operators",
                icon: BarChartHorizontal
            },
            {
                label: "Operator DHU Report",
                href: "/analytics/operator-dhu",
                icon: BarChartHorizontal
            },
            // {
            //     label: "Sectional DHU",
            //     href: "/analytics/defect-chart",
            //     icon: BarChartHorizontal
            // },
        ]
    },
    {
        categoryName: "Roaming QC Analytics",
        routes: [
            {
                label: "Roaming QC",
                href: "/analytics/roaming-qc",
                icon: AlignHorizontalDistributeCenter
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
            {
                label: "Machine types",
                href: "/analytics/machine-type",
                icon: BarChart3
            },
            {
                label: "Machine Summary",
                href: "/analytics/machine-summary",
                icon: TableProperties
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
                label: "Create Operation Bulletin",
                href: "/obb-sheets/create-new",
                icon: FileSpreadsheet
            },
            {
                label: "Manage Operation Bulletin",
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
        label: "Sewing Machine types",
        href: "/analytics/machine-type",
        icon: BarChart3
    },
    {
        label: "Machine Summary",
        href: "/analytics/machine-summary",
        icon: TableProperties
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
        label: "Create Bulletin",
        href: "/obb-sheets/create-new",
        icon: FileSpreadsheet
    },
    {
        label: "Manage Bulletin",
        href: "/obb-sheets",
        icon: FileCog
    },
    {
        label: "Hourly Production Achievements",
        href: "/analytics/hourly-production",
        icon: BarChart3
    },
    {
        label: "Cycle Time Analysis vs Target SMV",
        href: "/analytics/operation-smv-hourly",
        icon: BarChart3
    },
    {
        label: "SMV vs Cycle Time",
        href: "/analytics/operation-smv",
        icon: BarChart3
    },
    {
        label: "Yamuzami Graph",
        href: "/analytics/yamuzami-graph",
        icon: BarChart3
    },
    {
        label: "Operation Efficiency (60 Minute)",
        href: "/analytics/operation-efficiency-60",
        icon: BarChartHorizontal
    },
    {
        label: "Production Heatmap (15 Minute)",
        href: "/analytics/operation-efficiency-15",
        icon: BarChartHorizontal
    },
    {
        label: "Operator Efficiency (60 Minute)",
        href: "/analytics/operator-efficiency-60",
        icon: BarChartHorizontal
    },
    {
        label: "Operator Efficiency (15 Minute)",
        href: "/analytics/operator-efficiency-15",
        icon: BarChartHorizontal
    },
    {
        label: "Resource Utilization",
        href: "/analytics/operator-effective-time",
        icon: Table
    },
    {
        label: "DHU Status",
        href: "/analytics/tls-productions",
        icon: Sliders
    },
    
    {
        label: "Opertor Wise DHU",
        href: "/analytics/tls-operators",
        icon: Sliders
    },
    {
        label: "Sectional DHU",
        href: "/analytics/defect-chart",
        icon: BarChartHorizontal
    },
    
    {
        label: "Daily Target vs Actual - Pieces",
        href: "/analytics/daily-achivement",
        icon: Sliders
    },
    {
        label:"Daily Target vs Actual (Instance)",
        href: "/analytics/daily-achivement-ins",
        icon: BarChartHorizontal

    },
    {
        label:"Hourly Production",
        href: "/analytics/production-hourly",
        icon: LocateFixed 
        
    },
    {
        label: "Overall Performance - Operations (Live Data)",
        href: "/analytics/achievement-rate-operation",
        icon: Sliders
    },
    {
        label: "Log Records",
        href: "/analytics/log",
        icon: Sliders
    },
    {
        label: "Overall Operation Efficiency ",
        href: "/analytics/efficiency-rate",
        icon: Sliders
    },
    {
        label: "Operator Daily Efficiency Report",
        href: "/analytics/daily-report",
        icon: Sliders
    },
    {
        label: "Operation Efficiency-(15minute)",
        href: "/analytics/operation-efficiency-15m",
        icon: Sliders
    },
    {
        label: "Line Efficiency Resources",
        href: "/line-efficiency-resources",
        icon: Cable
    },
    {
        label: "Pitch Graph",
        href: "/analytics/pitch-diagram",
        icon: LineChart  
    },
    {
        label: "Capacity Diagram",
        href: "/analytics/capacity-graph",
        icon: LineChart  
    },
    {
        label: "Top Operators",
        href: "/analytics/top-operator",
        icon: BarChartHorizontal
    },
]

