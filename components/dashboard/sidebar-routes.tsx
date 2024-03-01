"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { SIDEBAR_ROUTES } from '@/constants';
import { Separator } from '@/components/ui/separator';

const SidebarRoutes = () => {
    const pathname = usePathname();

    return (
        <>
            {SIDEBAR_ROUTES.map((catogery, idx) => (
                <div key={idx}>
                    <div className="flex flex-col w-full gap-3 px-4 my-3" >
                        <p className={cn("text-xs font-semibold text-white/50 ml-2", catogery.categoryName === null && "hidden")}>
                            {catogery.categoryName}
                        </p>
                        <div className='flex flex-col gap-2'>
                            {catogery.routes.map((route) => (
                                <Link
                                    href={route.href}
                                    key={route.label}
                                    className={cn(
                                        "flex flex-row items-center px-3 py-2.5 gap-3 text-slate-200/80 hover:text-slate-200 hover:bg-white/10 rounded-sm cursor-pointer transition",
                                        route.href === pathname && "text-slate-200 bg-white/10"
                                    )}
                                >
                                    <route.icon className="w-5 h-5" />
                                    <p className="text-sm font-semibold w-40">{route.label}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Separator className="bg-white/15 h-0.5" />
                </div>
            ))}
        </>
    )
}

export default SidebarRoutes