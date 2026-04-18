import AppHeaderLayout from '@/layouts/app/app-header-layout';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const canAccessBackoffice = ['admin', 'superadmin'].includes(auth?.user?.role as string);

    if (canAccessBackoffice) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
                <div id="modal-root"></div>
            </AppSidebarLayout>
        );
    }

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
            <div id="modal-root"></div>
        </AppHeaderLayout>
    );
}

