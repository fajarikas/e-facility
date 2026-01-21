import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedTransactionData, TransactionData } from '@/types/transactions';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi Saya',
        href: '/my-transactions',
    },
];

type Props = {
    data: PaginatedTransactionData;
};

export default function UserTransactionsIndex({ data }: Props) {
    const transactionData = data.data;

    const rupiah = (amount: number) =>
        `Rp${new Intl.NumberFormat('id-ID').format(Number(amount) || 0)}`;

    const statusLabel = (t: TransactionData) =>
        t.is_booked === 'Yes' ? 'Disetujui' : 'Menunggu Konfirmasi';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Saya" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Daftar Transaksi
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href="/facilities">Cari Fasilitas</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Fasilitas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Status
                                        </th>
                                        <th className="rounded-tr-xl px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {transactionData.length ? (
                                        transactionData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition duration-150 ease-in-out hover:bg-blue-50/50"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    <div className="font-semibold text-gray-900">
                                                        {item.room?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.room?.building?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(
                                                        item.check_in_date,
                                                    ).toLocaleDateString('id-ID')}{' '}
                                                    –{' '}
                                                    {new Date(
                                                        item.check_out_date,
                                                    ).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-blue-700">
                                                    {rupiah(Number(item.total_harga))}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                            item.is_booked ===
                                                            'Yes'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        {statusLabel(item)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button asChild>
                                                        <Link
                                                            href={`/my-transactions/${item.id}`}
                                                        >
                                                            Lihat Pembayaran
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-10 text-center text-base text-gray-500"
                                            >
                                                Belum ada transaksi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {data.total > data.per_page && (
                    <PaginationLinks
                        links={data.links}
                        from={data.from}
                        to={data.to}
                        total={data.total}
                    />
                )}
            </div>
        </AppLayout>
    );
}
