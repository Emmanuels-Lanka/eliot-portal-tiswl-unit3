"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { SIDEBAR_ROUTES } from '@/constants';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '../ui/scroll-area';

const SidebarRoutes = ({ role }: { role: string }) => {
    const pathname = usePathname();

    const visibleCategories = SIDEBAR_ROUTES.filter(category => {
        // Allow only analytics-related routes for 'viewer' role
        return role !== "viewer" || category.routes.some(route => route.href.startsWith('/analytics/'));
    });

    return (
        <ScrollArea className='h-full'>
            {visibleCategories.map((category, idx) => (
                <div key={idx}>
                    <div className="flex flex-col w-full gap-3 px-4 my-3">
                        <p className={cn("text-xs font-semibold text-white/50 ml-2", !category.categoryName && "hidden")}>
                            {category.categoryName}
                        </p>
                        <div className='flex flex-col gap-2'>
                            {category.routes.map((route) => {
                                const isVisible = role !== "viewer" || route.href.startsWith('/analytics/');
                                return isVisible && (
                                    <Link
                                        href={route.href}
                                        key={route.label}
                                        className={cn(
                                            "flex flex-row items-center px-3 py-2.5 gap-3 text-slate-200/80 border border-transparent hover:text-slate-200 hover:bg-white/10 rounded-sm cursor-pointer transition",
                                            route.href === pathname && "text-slate-200 bg-white/10 border-white/10"
                                        )}
                                    >
                                        <route.icon className="w-5 h-5" />
                                        <p className="text-sm font-semibold w-40">{route.label}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <Separator className="bg-white/15 h-0.5" />
                </div>
            ))}
        </ScrollArea>
    )
}

export default SidebarRoutes