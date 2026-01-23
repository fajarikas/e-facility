import DashboardLineChart from '@/components/dashboard/DashboardLineChart';
import DashboardPieChart from '@/components/dashboard/DashboardPieChart';
import RecentTransactionsTable from '@/components/dashboard/RecentTransactionTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { TransactionData } from '@/types/transactions';
import { Head, router } from '@inertiajs/react';

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
        selected_year: number | 'all';
        yearly_income: number;
        monthly_transaction: any[];
        pending_transactions: number;
        count_transactions: { status: string; count: number }[];
    };
    recent_transactions: TransactionData[];
};

export default function Dashboard({ stats, recent_transactions }: Props) {
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
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">
                            {stats.selected_year === 'all'
                                ? 'Total Pendapatan (Semua Tahun)'
                                : `Total Pendapatan Tahun ${stats.selected_year}`}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-green-600">
                            {stats.yearly_income.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </p>
                    </div>
                </div>
                <div className="w-full flex space-x-4 items-center h-full">
                <DashboardLineChart
                    data={stats.monthly_transaction}
                    selectedYear={stats.selected_year}
                    onYearChange={(year) => {
                        router.get(
                            dashboard.url({
                                query: {
                                    year,
                                },
                            }),
                            {},
                            {
                                preserveScroll: true,
                                preserveState: true,
                                replace: true,
                            },
                        );
                    }}
                />
                <DashboardPieChart data={stats.count_transactions} />
                </div>

                <RecentTransactionsTable
                    recent_transactions={recent_transactions}
                />
            </div>
        </AppLayout>
    );
}
