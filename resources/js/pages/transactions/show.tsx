import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TransactionData } from '@/types/transactions';
import { Head, Link, router } from '@inertiajs/react';

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
    const status = transaction.status || (transaction.is_booked === 'Yes' ? 'booked' : 'pending_payment');

    const expiresAt = transaction.expires_at ? new Date(transaction.expires_at) : null;
    const remainingMs = expiresAt ? expiresAt.getTime() - Date.now() : null;
    const remainingMin = remainingMs !== null ? Math.max(0, Math.floor(remainingMs / 60000)) : null;
    const remainingSec = remainingMs !== null ? Math.max(0, Math.floor((remainingMs % 60000) / 1000)) : null;

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
                                {status === 'booked'
                                    ? 'Booked'
                                    : status === 'expired'
                                      ? 'Kadaluarsa'
                                      : status === 'cancelled'
                                        ? 'Dibatalkan'
                                        : 'Menunggu Pembayaran'}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {status === 'pending_payment' && remainingMs !== null && remainingMs > 0 && (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-900">
                                Batas bayar: {String(remainingMin).padStart(2, '0')}:{String(remainingSec).padStart(2, '0')}
                            </div>
                        )}
                        {status === 'pending_payment' && (remainingMs === null || remainingMs > 0) && (
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    router.post(`/my-transactions/${transaction.id}/cancel`, {}, { preserveScroll: true });
                                }}
                            >
                                Batalkan
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href="/my-transactions">Kembali</Link>
                        </Button>
                    </div>
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

                                {status === 'expired' && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                                        Transaksi ini sudah kadaluarsa (lebih dari 15 menit). Silakan buat transaksi baru.
                                    </div>
                                )}
                                {status === 'cancelled' && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                        Transaksi ini sudah dibatalkan.
                                    </div>
                                )}

                                <div className="pt-2 text-xs text-gray-600">
                                    Admin: {dataMaster.name} —{' '}
                                    {dataMaster.contact}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        className="w-full"
                                        asChild
                                        disabled={!contactUrl || status !== 'pending_payment' || (remainingMs !== null && remainingMs <= 0)}
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
