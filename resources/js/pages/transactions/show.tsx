import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TransactionData } from '@/types/transactions';
import { Head, Link } from '@inertiajs/react';

type Props = {
    transaction: TransactionData;
    contactUrl: string | null;
};

export default function UserTransactionShow({ transaction, contactUrl }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fasilitas', href: '/facilities' },
        { title: 'Transaksi Saya', href: '/my-transactions' },
        { title: `#${transaction.id}`, href: `/my-transactions/${transaction.id}` },
    ];

    const dataMaster = transaction.data_master;
    const paymentMethod = transaction.payment_method;
    const rupiah = (amount: number) => `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Transaksi #{transaction.id}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Status:{' '}
                            <span className="font-semibold">
                                {transaction.is_booked === 'Yes'
                                    ? 'Disetujui'
                                    : 'Menunggu Konfirmasi'}
                            </span>
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/my-transactions">Kembali</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 lg:col-span-2">
                        <div className="text-sm font-semibold text-gray-900">
                            Detail Pemesanan
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="text-sm text-gray-700">
                                <div className="text-gray-500">Fasilitas</div>
                                <div className="font-semibold">
                                    {transaction.room?.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {transaction.room?.building?.name}
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">
                                <div className="text-gray-500">Tanggal</div>
                                <div className="font-semibold">
                                    {new Date(
                                        transaction.check_in_date,
                                    ).toLocaleDateString('id-ID')}{' '}
                                    –{' '}
                                    {new Date(
                                        transaction.check_out_date,
                                    ).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">
                                <div className="text-gray-500">Pemesan</div>
                                <div className="font-semibold">
                                    {transaction.customer_name || '-'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {transaction.customer_phone || '-'}
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">
                                <div className="text-gray-500">Alamat</div>
                                <div className="font-semibold">
                                    {transaction.customer_address || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-sm font-semibold text-gray-900">
                            Pembayaran
                        </div>

                        {dataMaster ? (
                            <div className="mt-3 space-y-2 text-sm text-gray-700">
                                <div>
                                    <span className="text-gray-500">Metode:</span>
                                    <div className="mt-1 font-semibold text-gray-900">
                                        {paymentMethod
                                            ? `${paymentMethod.type === 'va' ? 'VA' : 'Transfer'} - ${paymentMethod.bank_name}`
                                            : 'VA'}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-500">
                                        {paymentMethod?.type === 'bank_transfer'
                                            ? 'Rekening:'
                                            : 'Virtual Account:'}
                                    </span>
                                    <div className="mt-1 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 font-mono text-base font-semibold text-blue-900">
                                        {paymentMethod?.account_number ??
                                            dataMaster.va_number}
                                    </div>
                                    {paymentMethod?.account_holder && (
                                        <div className="mt-1 text-xs text-gray-600">
                                            a.n. {paymentMethod.account_holder}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <span className="text-gray-500">
                                        Total Bayar:
                                    </span>
                                    <div className="mt-1 text-lg font-semibold text-blue-700">
                                        {rupiah(Number(transaction.total_harga) || 0)}
                                    </div>
                                </div>

                                <div className="pt-2 text-xs text-gray-600">
                                    Admin: {dataMaster.name} —{' '}
                                    {dataMaster.contact}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        className="w-full"
                                        asChild
                                        disabled={!contactUrl}
                                    >
                                        <a
                                            href={contactUrl ?? '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Konfirmasi Pembayaran ke Admin
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 text-sm text-gray-600">
                                VA belum tersedia. Hubungi admin.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
