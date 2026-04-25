import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Heart, Menu, ReceiptText } from 'lucide-react';
import AppLogo from './app-logo';
import { AppearanceToggle } from './appearance-toggle';

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

export function AppHeader() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white text-gray-900 backdrop-blur-md   ">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" prefetch className="transition-transform active:scale-95">
                        <AppLogo />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {userNavItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                                    page.url.startsWith(item.href)
                                        ? "bg-[#1f9cd7]/10 text-[#1f9cd7] "
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900   "
                                )}
                            >
                                {item.icon && <item.icon className="size-4" />}
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex h-10 items-center gap-2 rounded-full border border-gray-200 p-1 pr-3 transition-all hover:bg-gray-50"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full border border-white shadow-sm">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-blue-50 text-xs font-black text-[#1f9cd7]">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden text-sm font-black tracking-tight text-gray-900 sm:block">
                                        {auth.user.name.split(' ')[0]}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-2xl" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="hidden rounded-xl font-bold sm:flex">
                                <Link href="/register">Daftar</Link>
                            </Button>
                            <Button asChild className="rounded-xl bg-[#1f9cd7] font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-[#1785b7]">
                                <Link href="/login">Masuk</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72 border-none bg-white p-0 text-gray-900  ">
                                <div className="flex h-full flex-col">
                                    <div className="p-6 border-b ">
                                        <AppLogo />
                                    </div>
                                    <nav className="flex-1 space-y-1 p-4">
                                        {userNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-xl p-4 text-base font-bold transition-all",
                                                    page.url.startsWith(item.href)
                                                        ? "bg-[#1f9cd7] text-white shadow-lg shadow-blue-500/20"
                                                        : "text-gray-600 hover:bg-gray-50   "
                                                )}
                                            >
                                                {item.icon && <item.icon className="size-5" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                    {!auth.user && (
                                        <div className="p-6 border-t  space-y-3">
                                            <Button asChild className="w-full rounded-2xl bg-[#1f9cd7] font-bold text-white">
                                                <Link href="/login">Masuk Sekarang</Link>
                                            </Button>
                                            <Button asChild variant="outline" className="w-full rounded-2xl font-bold ">
                                                <Link href="/register">Daftar Akun Baru</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
