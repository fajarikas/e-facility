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
        pending_transactions: number;
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
                        <p className="text-sm text-gray-500">Menunggu Approval</p>
                        <p className="mt-2 text-2xl font-semibold text-yellow-600">
                            {stats.pending_transactions}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Transaksi Terbaru
                        </h2>
                        <span className="text-sm text-gray-500">
                            5 transaksi terakhir
                        </span>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Pemesan
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Ruangan
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Total
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {recent_transactions.length > 0 ? (
                                    recent_transactions.map((transaction) => {
                                        const detail =
                                            transaction.details?.[0];
                                        return (
                                            <tr key={transaction.id}>
                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                    {detail?.user?.name || '-'}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                    {transaction.room?.name}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                    {new Date(
                                                        transaction.check_in_date,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right text-sm text-gray-700">
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0,
                                                        },
                                                    ).format(
                                                        Number(
                                                            transaction.total_harga,
                                                        ) || 0,
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                            transaction.is_booked ===
                                                            'Yes'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        {transaction.is_booked ===
                                                        'Yes'
                                                            ? 'Disetujui'
                                                            : 'Menunggu'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-sm text-gray-500"
                                        >
                                            Belum ada transaksi terbaru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
