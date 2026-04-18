import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
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
        t.status === 'booked' || t.is_booked === 'Yes'
            ? 'Booked'
            : t.status === 'expired'
              ? 'Kadaluarsa'
              : t.status === 'cancelled'
                ? 'Dibatalkan'
                : 'Menunggu Pembayaran';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Saya" />

            <div className="flex flex-col gap-8 p-6 lg:p-10 text-left">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
                    <div className="space-y-1 text-left">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 ">
                            Riwayat <span className="text-[#1f9cd7]">Transaksi</span>
                        </h1>
                        <p className="text-sm font-medium text-gray-500 ">
                            Kelola pemesanan dan pantau status pembayaran Anda.
                        </p>
                    </div>
                    <Button asChild className="rounded-2xl bg-[#1f9cd7] font-bold shadow-lg shadow-blue-500/20 hover:bg-[#1785b7]">
                        <Link href="/facilities">Cari Fasilitas Baru</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl ring-1 ring-gray-100  ">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50/50  ">
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fasilitas</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Periode Sewa</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Biaya</th>
                                    <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 ">
                                {transactionData.length ? (
                                    transactionData.map((item) => (
                                        <tr key={item.id} className="group transition-colors hover:bg-gray-50 ">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-sm font-bold text-gray-900 ">{item.room?.name}</span>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase ">{item.room?.building?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-2 text-sm font-bold">
                                                    <span className="text-gray-700 ">{new Date(item.check_in_date).toLocaleDateString('id-ID')}</span>
                                                    <span className="text-gray-300">→</span>
                                                    <span className="text-gray-700 ">{new Date(item.check_out_date).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right text-sm font-black text-[#1f9cd7]">
                                                {rupiah(Number(item.total_harga))}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                                                    (item.status === 'booked' || item.is_booked === 'Yes')
                                                        ? "bg-emerald-100 text-emerald-700  "
                                                        : item.status === 'expired' || item.status === 'cancelled'
                                                            ? "bg-rose-100 text-rose-700  "
                                                            : "bg-amber-100 text-amber-700  "
                                                )}>
                                                    {statusLabel(item)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button asChild variant="outline" className="rounded-xl border-[#1f9cd7] font-bold text-[#1f9cd7] transition-all hover:bg-[#1f9cd7] hover:text-white">
                                                    <Link href={`/my-transactions/${item.id}`}>
                                                        Detail Pembayaran
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300 ">
                                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Belum ada transaksi</p>
                                                <Button asChild variant="link" className="mt-2 text-[#1f9cd7] font-bold">
                                                    <Link href="/facilities">Mulai Booking Sekarang</Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {data.total > data.per_page && (
                    <div className="mt-6">
                        <PaginationLinks
                            links={data.links}
                            from={data.from}
                            to={data.to}
                            total={data.total}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
