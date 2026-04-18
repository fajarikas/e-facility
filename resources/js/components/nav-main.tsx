import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    return (
        <SidebarGroup className="px-0 py-2">
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    "relative flex h-11 items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    "hover:bg-gray-100 ",
                                    isActive 
                                        ? "bg-[#1f9cd7] text-white shadow-lg shadow-blue-500/20 hover:bg-[#1f9cd7] " 
                                        : "text-gray-500 hover:text-gray-900  "
                                )}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon className={cn(
                                            "size-5 shrink-0 transition-transform duration-200",
                                            isActive ? "scale-110" : "group-hover:scale-110"
                                        )} />
                                    )}
                                    <span className={cn(
                                        "text-sm font-bold tracking-tight",
                                        isActive ? "text-white" : "text-inherit"
                                    )}>
                                        {item.title}
                                    </span>
                                    {isActive && (
                                        <div className="absolute left-0 h-6 w-1 rounded-r-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
