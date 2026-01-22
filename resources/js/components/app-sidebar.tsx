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

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* <SidebarMenuButton asChild>
                            <Link href={logout()} as="button">
                                <LogOut className="mr-2 size-4" />
                                Logout
                            </Link>
                        </SidebarMenuButton> */}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
