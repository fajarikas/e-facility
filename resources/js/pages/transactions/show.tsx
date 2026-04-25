import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { TransactionData } from '@/types/transactions';
import { Head, Link, router } from '@inertiajs/react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

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

    const expiresAt = useMemo(() => {
        return transaction.expires_at ? new Date(transaction.expires_at) : null;
    }, [transaction.expires_at]);

    const remainingMs = useMemo(() => {
        if (!expiresAt) return null;
        return expiresAt.getTime() - new Date().getTime();
    }, [expiresAt]);
    const remainingMin = remainingMs !== null ? Math.max(0, Math.floor(remainingMs / 60000)) : null;
    const remainingSec = remainingMs !== null ? Math.max(0, Math.floor((remainingMs % 60000) / 1000)) : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaksi #${transaction.id}`} />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 ">
                                Transaksi <span className="text-[#1f9cd7]">#{transaction.id}</span>
                            </h1>
                            <span className={cn(
                                "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm",
                                status === 'booked' 
                                    ? "bg-emerald-500 text-white" 
                                    : status === 'expired' || status === 'cancelled'
                                        ? "bg-rose-500 text-white"
                                        : "bg-amber-500 text-white"
                            )}>
                                {status === 'booked' ? 'Sukses' : status === 'expired' ? 'Kadaluarsa' : status === 'cancelled' ? 'Dibatalkan' : 'Menunggu Bayar'}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Dibuat pada {new Date(transaction.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {status === 'pending_payment' && (remainingMs === null || remainingMs > 0) && (
                            <Button
                                variant="outline"
                                className="rounded-xl font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600  "
                                onClick={() => router.post(`/my-transactions/${transaction.id}/cancel`, {}, { preserveScroll: true })}
                            >
                                Batalkan Pesanan
                            </Button>
                        )}
                        <Button variant="outline" asChild className="rounded-xl font-bold ">
                            <Link href="/my-transactions">
                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Status Alert for Pending Payment */}
                {status === 'pending_payment' && remainingMs !== null && remainingMs > 0 && (
                    <div className="mb-10 flex items-center justify-between rounded-[2rem] bg-[#1f9cd7] p-8 text-white shadow-xl shadow-blue-500/20">
                        <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Selesaikan Pembayaran</h3>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Segera transfer sebelum waktu habis</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Sisa Waktu</span>
                            <div className="text-3xl font-black tabular-nums">
                                {String(remainingMin).padStart(2, '0')}:{String(remainingSec).padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column: Details */}
                    <div className="space-y-8 lg:col-span-2">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 rounded-full bg-[#1f9cd7]" />
                                <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Detail Fasilitas</h2>
                            </div>
                            <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-lg ring-1 ring-gray-100  ">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="aspect-[4/3] w-full sm:w-48">
                                        <img 
                                            src={transaction.room?.images?.[0] ? `/storage/${transaction.room.images[0]}` : '/images/landingpage/contoh.webp'} 
                                            className="h-full w-full object-cover" 
                                            alt={transaction.room?.name} 
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center p-6">
                                        <h3 className="text-lg font-black text-gray-900 ">{transaction.room?.name}</h3>
                                        <p className="text-xs font-bold text-[#1f9cd7] uppercase tracking-widest">{transaction.room?.building?.name}</p>
                                        <div className="mt-4 flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            <div className="flex items-center gap-1">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span>{new Date(transaction.check_in_date).toLocaleDateString('id-ID')} - {new Date(transaction.check_out_date).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 rounded-full bg-[#1f9cd7]" />
                                <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Informasi Pemesan</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-[2rem] bg-gray-50 p-6 ">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nama Pemesan</span>
                                    <p className="mt-1 text-sm font-bold">{transaction.customer_name || '-'}</p>
                                </div>
                                <div className="rounded-[2rem] bg-gray-50 p-6 ">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nomor WhatsApp</span>
                                    <p className="mt-1 text-sm font-bold">{transaction.customer_phone || '-'}</p>
                                </div>
                                <div className="rounded-[2rem] bg-gray-50 p-6  sm:col-span-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alamat Lengkap</span>
                                    <p className="mt-1 text-sm font-bold leading-relaxed">{transaction.customer_address || '-'}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Payment */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-[#1f9cd7]" />
                            <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Pembayaran</h2>
                        </div>
                        
                        <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl ring-1 ring-gray-100  ">
                            <div className="bg-gray-50 p-8 text-center ">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Tagihan</span>
                                <div className="mt-1 text-3xl font-black text-[#1f9cd7]">
                                    {rupiah(Number(transaction.total_harga) || 0)}
                                </div>
                            </div>
                            
                            <CardContent className="p-8 space-y-6">
                                {dataMaster ? (
                                    <>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                                <span className="text-muted-foreground">Metode Bayar</span>
                                                <span className="text-gray-900 ">
                                                    {paymentMethod ? `${paymentMethod.type.toUpperCase()} - ${paymentMethod.bank_name}` : 'TRANSFER'}
                                                </span>
                                            </div>
                                            
                                            <div className="rounded-2xl bg-blue-50 p-6 ">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1f9cd7]">Nomor Rekening / VA</span>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xl font-black tracking-tighter tabular-nums text-gray-900 ">
                                                        {paymentMethod?.account_number ?? dataMaster.va_number}
                                                    </span>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(paymentMethod?.account_number ?? dataMaster.va_number);
                                                            Toastify({ text: 'Nomor disalin!', duration: 2000, gravity: 'bottom', position: 'center', style: { background: '#1f9cd7' } }).showToast();
                                                        }}
                                                        className="text-[10px] font-black uppercase tracking-widest text-[#1f9cd7] hover:underline"
                                                    >
                                                        Salin
                                                    </button>
                                                </div>
                                                {paymentMethod?.account_holder && (
                                                    <p className="mt-2 text-xs font-bold text-muted-foreground">a.n. {paymentMethod.account_holder}</p>
                                                )}
                                            </div>
                                        </div>

                                        {status === 'pending_payment' && (remainingMs === null || remainingMs > 0) ? (
                                            <Button
                                                asChild
                                                className="h-14 w-full rounded-2xl bg-emerald-500 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95"
                                            >
                                                <a href={contactUrl ?? '#'} target="_blank" rel="noreferrer">
                                                    Konfirmasi via WhatsApp
                                                </a>
                                            </Button>
                                        ) : (
                                            <div className="rounded-2xl bg-rose-50 p-4 text-center ">
                                                <p className="text-xs font-bold text-rose-600  uppercase tracking-widest">
                                                    {status === 'expired' ? 'Waktu Bayar Berakhir' : 'Transaksi Dibatalkan'}
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-4 text-center">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                                Bantuan Admin: <br />
                                                <span className="text-gray-900 ">{dataMaster.name} — {dataMaster.contact}</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-sm font-bold text-muted-foreground">Data pembayaran belum tersedia.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
