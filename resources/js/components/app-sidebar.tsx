import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { buildings, dashboard, rooms } from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BedDouble,
    Building,
    Building2,
    CreditCard,
    Heart,
    LayoutGrid,
    ReceiptText,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Bangunan',
        href: buildings(),
        icon: Building,
    },
    {
        title: 'Ruangan',
        href: rooms(),
        icon: BedDouble,
    },
    {
        title: 'Transaksi',
        href: '/transactions',
        icon: ReceiptText,
    },
    {
        title: 'Manajemen User',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Data Master',
        href: '/admin/data-masters',
        icon: CreditCard,
    },
    {
        title: 'Metode Pembayaran',
        href: '/admin/payment-methods',
        icon: CreditCard,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Fasilitas',
        href: '/facilities',
        icon: Building2,
    },
    {
        title: 'Transaksi',
        href: '/my-transactions',
        icon: ReceiptText,
    },
    {
        title: 'Bookmark',
        href: '/facilities/bookmarks',
        icon: Heart,
    },
];

// footer nav left intentionally unused — remove to satisfy linter

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const canAccessBackoffice = ['admin', 'superadmin'].includes(
        auth?.user?.role as string,
    );

    const navItems = canAccessBackoffice ? mainNavItems : userNavItems;
    const homeHref = canAccessBackoffice ? dashboard() : '/facilities';

    const filteredNavItems = navItems.filter((item) => {
        if (!auth.user) {
            return !['Transaksi', 'Bookmark'].includes(item.title);
        }
        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-0 bg-white text-slate-900  ">
            <SidebarHeader className="p-4 border-b border-gray-100 ">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-auto p-0 hover:bg-transparent transition-colors">
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <div className="mt-4 px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Menu Utama
                </div>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-800 ">
                {auth.user ? (
                    <NavUser />
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild className="rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white">
                                <Link href="/login">
                                    <LayoutGrid className="mr-2 size-4" />
                                    Login
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
