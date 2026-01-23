import DashboardLineChart from '@/components/dashboard/DashboardLineChart';
import RecentTransactionsTable from '@/components/dashboard/RecentTransactionTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { TransactionData } from '@/types/transactions';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    stats: {
        buildings: number;
        rooms: number;
        transactions: number;
        total_income: number;
        monthly_transaction: any[];
        pending_transactions: number;
    };
    recent_transactions: TransactionData[];
};

export default function Dashboard({ stats, recent_transactions }: Props) {
    console.log('🚀 ~ Dashboard ~ stats:', stats);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Bangunan</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {stats.buildings}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Ruangan</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {stats.rooms}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Transaksi</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {stats.transactions}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Menunggu Approval
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-yellow-600">
                            {stats.pending_transactions}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Pendapatan
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-green-600">
                            {stats.total_income.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </p>
                    </div>
                </div>
                <DashboardLineChart data={stats.monthly_transaction} />

                <RecentTransactionsTable
                    recent_transactions={recent_transactions}
                />
            </div>
        </AppLayout>
    );
}
