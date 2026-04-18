import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { AppearanceToggle } from './appearance-toggle';
import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden h-4 w-[1px] bg-sidebar-border md:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </header>
    );
}
