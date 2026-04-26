import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RichText } from '@/components/ui/rich-text';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { DataMaster } from '@/types/data-master';
import { RoomData } from '@/types/rooms';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    Heart,
    MapPin,
    MessageCircle,
    Star,
    Users,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    room: RoomData;
    isLiked: boolean;
    dataMaster: DataMaster | null;
    blockedDates: string[];
};

export default function FacilityShow({
    room,
    isLiked,
    dataMaster,
    blockedDates,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fasilitas', href: '/facilities' },
        { title: room.name, href: `/facilities/${room.id}` },
    ];

    const { auth, errors: pageErrors } = usePage<
        SharedData & { errors?: Record<string, string> }
    >().props;
    const firstImage = room.images?.[0];

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const errors = pageErrors || {};

    const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
    const blockedDatesSet = useMemo(
        () => new Set(blockedDates ?? []),
        [blockedDates],
    );

    const formatDate = (date: Date) => date.toLocaleDateString('en-CA');

    const isBlockedDate = (date: string) => blockedDatesSet.has(date);

    const isRangeBlocked = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return false;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
            return false;
        if (end < start) return false;

        const cursor = new Date(start);
        while (cursor <= end) {
            if (blockedDatesSet.has(formatDate(cursor))) {
                return true;
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        return false;
    };

    const { days, totalHarga } = useMemo(() => {
        if (!checkInDate || !checkOutDate) return { days: 0, totalHarga: 0 };
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
            return { days: 0, totalHarga: 0 };
        if (end < start) return { days: 0, totalHarga: 0 };
        const diffDays = Math.floor(
            (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
        );
        const d = diffDays + 1;
        return { days: d, totalHarga: d * Number(room.price || 0) };
    }, [checkInDate, checkOutDate, room.price]);

    const rupiah = (amount: number) =>
        `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;

    const submitOrder = (e: FormEvent) => {
        e.preventDefault();
        if (isRangeBlocked(checkInDate, checkOutDate)) {
            Toastify({
                text: 'Tanggal yang dipilih sudah dibooking atau masih pending.',
                duration: 4000,
                close: true,
                gravity: 'top',
                position: 'left',
                style: {
                    background: '#B91C1C',
                },
            }).showToast();
            return;
        }

        setIsProcessing(true);
        router.post(
            `/facilities/${room.id}/order`,
            {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: customerAddress,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={room.name} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black tracking-widest text-[#1f9cd7] uppercase">
                                {room.building?.name}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-xs font-bold text-gray-900">
                                    4.9 (42 Reviews)
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            {room.name}
                        </h1>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <MapPin className="h-4 w-4 text-[#1f9cd7]" />
                            <span>
                                BPMP Provinsi Kepulauan Bangka Belitung,
                                Pangkalpinang
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={isLiked ? 'default' : 'outline'}
                            onClick={() =>
                                router.post(
                                    `/facilities/${room.id}/like`,
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                            className={cn(
                                'rounded-xl font-bold transition-all',
                                isLiked &&
                                    'border-none bg-rose-500 shadow-lg shadow-rose-500/20 hover:bg-rose-600',
                            )}
                        >
                            <Heart
                                className={cn(
                                    'mr-2 h-4 w-4',
                                    isLiked && 'fill-current',
                                )}
                            />
                            {isLiked ? 'Tersimpan' : 'Simpan'}
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl font-bold"
                        >
                            <Link href="/facilities">
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left Column: Content */}
                    <div className="space-y-10 lg:col-span-2">
                        {/* Gallery Section */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl">
                            {firstImage ? (
                                <img
                                    src={`/storage/${firstImage}`}
                                    alt={room.name}
                                    className="aspect-[16/9] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[16/9] w-full items-center justify-center text-sm font-bold tracking-widest text-gray-400 uppercase">
                                    Gambar belum tersedia
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 rounded-full bg-[#1f9cd7]" />
                                <h2 className="text-xl font-black tracking-tight tracking-widest uppercase">
                                    Detail Fasilitas
                                </h2>
                            </div>
                            <div className="prose prose-blue max-w-none">
                                <RichText html={room.description || ''} />
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                {
                                    icon: Users,
                                    label: 'Kapasitas',
                                    value: `${room.capacity} Orang`,
                                },
                                {
                                    icon: Calendar,
                                    label: 'Tersedia',
                                    value: 'Setiap Hari',
                                },
                                {
                                    icon: Star,
                                    label: 'Kualitas',
                                    value: 'Premium',
                                },
                                {
                                    icon: MapPin,
                                    label: 'Lokasi',
                                    value: 'Bangka Belitung',
                                },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center justify-center rounded-3xl bg-gray-50 p-6 text-center transition-colors hover:bg-blue-50"
                                >
                                    <feature.icon className="mb-3 h-6 w-6 text-[#1f9cd7]" />
                                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                        {feature.label}
                                    </span>
                                    <span className="mt-1 text-sm font-bold">
                                        {feature.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            {auth.user ? (
                                <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl ring-1 ring-gray-100">
                                    <div className="bg-[#1f9cd7] p-6 text-white">
                                        <span className="text-xs font-black tracking-widest uppercase opacity-80">
                                            Mulai Dari
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black">
                                                {rupiah(
                                                    totalHarga ||
                                                        Number(room.price) ||
                                                        0,
                                                )}
                                            </span>
                                            <span className="text-sm font-bold opacity-80">
                                                /hari
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-8">
                                        <form
                                            onSubmit={submitOrder}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Informasi Kontak
                                                    </label>
                                                    <input
                                                        value={customerName}
                                                        onChange={(e) =>
                                                            setCustomerName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-12 w-full rounded-xl border-gray-100 bg-gray-50 px-4 text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-[#1f9cd7]"
                                                        placeholder="Nama Lengkap"
                                                    />
                                                    {errors.customer_name && (
                                                        <p className="text-xs font-bold text-rose-500">
                                                            {
                                                                errors.customer_name
                                                            }
                                                        </p>
                                                    )}
                                                    <input
                                                        value={customerPhone}
                                                        onChange={(e) =>
                                                            setCustomerPhone(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-12 w-full rounded-xl border-gray-100 bg-gray-50 px-4 text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-[#1f9cd7]"
                                                        placeholder="Nomor WhatsApp"
                                                    />
                                                    {errors.customer_phone && (
                                                        <p className="text-xs font-bold text-rose-500">
                                                            {
                                                                errors.customer_phone
                                                            }
                                                        </p>
                                                    )}
                                                    <textarea
                                                        value={customerAddress}
                                                        onChange={(e) =>
                                                            setCustomerAddress(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="min-h-[80px] w-full rounded-xl border-gray-100 bg-gray-50 p-4 text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-[#1f9cd7]"
                                                        placeholder="Alamat Lengkap"
                                                    />
                                                    {errors.customer_address && (
                                                        <p className="text-xs font-bold text-rose-500">
                                                            {
                                                                errors.customer_address
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                        Pilih Jadwal
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="relative">
                                                            <DatePicker
                                                                selected={
                                                                    checkInDate
                                                                        ? new Date(
                                                                              checkInDate,
                                                                          )
                                                                        : null
                                                                }
                                                                onChange={(
                                                                    date: Date | null,
                                                                ) => {
                                                                    if (!date) {
                                                                        setCheckInDate(
                                                                            '',
                                                                        );
                                                                        return;
                                                                    }
                                                                    const formatted =
                                                                        date.toLocaleDateString(
                                                                            'sv-SE',
                                                                        );
                                                                    if (
                                                                        isBlockedDate(
                                                                            formatted,
                                                                        )
                                                                    ) {
                                                                        Toastify(
                                                                            {
                                                                                text: 'Tanggal tersebut sudah dibooking atau masih pending.',
                                                                                duration: 4000,
                                                                                close: true,
                                                                                gravity:
                                                                                    'top',
                                                                                position:
                                                                                    'left',
                                                                                style: {
                                                                                    background:
                                                                                        '#B91C1C',
                                                                                },
                                                                            },
                                                                        ).showToast();
                                                                        return;
                                                                    }
                                                                    setCheckInDate(
                                                                        formatted,
                                                                    );
                                                                }}
                                                                minDate={
                                                                    new Date()
                                                                }
                                                                filterDate={(
                                                                    date,
                                                                ) =>
                                                                    !isBlockedDate(
                                                                        date.toLocaleDateString(
                                                                            'sv-SE',
                                                                        ),
                                                                    )
                                                                }
                                                                dayClassName={(
                                                                    date,
                                                                ) =>
                                                                    isBlockedDate(
                                                                        date.toLocaleDateString(
                                                                            'sv-SE',
                                                                        ),
                                                                    )
                                                                        ? 'bg-rose-100 text-rose-400 cursor-not-allowed opacity-50'
                                                                        : ''
                                                                }
                                                                placeholderText="Check-in"
                                                                portalId="modal-root"
                                                                className="h-12 w-full rounded-xl border-none bg-gray-50 px-4 text-xs font-bold"
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <DatePicker
                                                                selected={
                                                                    checkOutDate
                                                                        ? new Date(
                                                                              checkOutDate,
                                                                          )
                                                                        : null
                                                                }
                                                                onChange={(
                                                                    date: Date | null,
                                                                ) => {
                                                                    if (!date) {
                                                                        setCheckOutDate(
                                                                            '',
                                                                        );
                                                                        return;
                                                                    }
                                                                    const formatted =
                                                                        date.toLocaleDateString(
                                                                            'sv-SE',
                                                                        );
                                                                    if (
                                                                        isBlockedDate(
                                                                            formatted,
                                                                        )
                                                                    ) {
                                                                        Toastify(
                                                                            {
                                                                                text: 'Tanggal tersebut sudah dibooking atau masih pending.',
                                                                                duration: 4000,
                                                                                close: true,
                                                                                gravity:
                                                                                    'top',
                                                                                position:
                                                                                    'left',
                                                                                style: {
                                                                                    background:
                                                                                        '#B91C1C',
                                                                                },
                                                                            },
                                                                        ).showToast();
                                                                        return;
                                                                    }
                                                                    if (
                                                                        checkInDate &&
                                                                        isRangeBlocked(
                                                                            checkInDate,
                                                                            formatted,
                                                                        )
                                                                    ) {
                                                                        Toastify(
                                                                            {
                                                                                text: 'Rentang tanggal berisi tanggal yang sudah dibooking.',
                                                                                duration: 4000,
                                                                                close: true,
                                                                                gravity:
                                                                                    'top',
                                                                                position:
                                                                                    'left',
                                                                                style: {
                                                                                    background:
                                                                                        '#B91C1C',
                                                                                },
                                                                            },
                                                                        ).showToast();
                                                                        return;
                                                                    }
                                                                    setCheckOutDate(
                                                                        formatted,
                                                                    );
                                                                }}
                                                                minDate={
                                                                    checkInDate
                                                                        ? new Date(
                                                                              checkInDate,
                                                                          )
                                                                        : new Date()
                                                                }
                                                                filterDate={(
                                                                    date,
                                                                ) =>
                                                                    !isBlockedDate(
                                                                        date.toLocaleDateString(
                                                                            'sv-SE',
                                                                        ),
                                                                    )
                                                                }
                                                                dayClassName={(
                                                                    date,
                                                                ) =>
                                                                    isBlockedDate(
                                                                        date.toLocaleDateString(
                                                                            'sv-SE',
                                                                        ),
                                                                    )
                                                                        ? 'bg-rose-100 text-rose-400 cursor-not-allowed opacity-50'
                                                                        : ''
                                                                }
                                                                placeholderText="Check-out"
                                                                portalId="modal-root"
                                                                className="h-12 w-full rounded-xl border-none bg-gray-50 px-4 text-xs font-bold"
                                                            />
                                                        </div>
                                                    </div>
                                                    {errors.check_in_date && (
                                                        <p className="text-xs font-bold text-rose-500">
                                                            {
                                                                errors.check_in_date
                                                            }
                                                        </p>
                                                    )}
                                                    {errors.check_out_date && (
                                                        <p className="text-xs font-bold text-rose-500">
                                                            {
                                                                errors.check_out_date
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {days > 0 && (
                                                <div className="rounded-2xl bg-blue-50 p-4">
                                                    <div className="mb-2 flex justify-between text-xs font-bold">
                                                        <span className="text-muted-foreground">
                                                            Durasi ({days} Hari)
                                                        </span>
                                                        <span>
                                                            {rupiah(
                                                                Number(
                                                                    room.price,
                                                                ) || 0,
                                                            )}{' '}
                                                            x {days}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between border-t border-blue-100 pt-2">
                                                        <span className="text-sm font-black text-[#1f9cd7]">
                                                            Total Bayar
                                                        </span>
                                                        <span className="text-lg font-black text-[#1f9cd7]">
                                                            {rupiah(totalHarga)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                className="h-14 w-full rounded-2xl bg-[#1f9cd7] text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/30 hover:bg-[#1785b7] active:scale-95 disabled:opacity-50"
                                                tabIndex={4}
                                                disabled={
                                                    !customerName ||
                                                    !customerPhone ||
                                                    !customerAddress ||
                                                    !checkInDate ||
                                                    !checkOutDate ||
                                                    isProcessing
                                                }
                                            >
                                                {isProcessing ? (
                                                    <Spinner />
                                                ) : (
                                                    'Booking Sekarang'
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl ring-1 ring-gray-100">
                                    <div className="bg-[#1f9cd7] p-6 text-center text-white">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-black tracking-tight uppercase">
                                            Akses Terbatas
                                        </h3>
                                        <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                                            Silakan login untuk memesan
                                        </p>
                                    </div>
                                    <CardContent className="p-8 text-center">
                                        <p className="mb-6 text-sm leading-relaxed font-medium text-muted-foreground">
                                            Anda harus memiliki akun dan masuk
                                            ke sistem untuk dapat melakukan
                                            penyewaan fasilitas kami secara
                                            online.
                                        </p>
                                        <Button
                                            asChild
                                            className="h-14 w-full rounded-2xl bg-[#1f9cd7] text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/25 transition-all hover:bg-[#1785b7] active:scale-95"
                                        >
                                            <Link href="/login">
                                                Masuk Sekarang
                                            </Link>
                                        </Button>
                                        <div className="mt-4">
                                            <Link
                                                href="/register"
                                                className="text-xs font-black tracking-widest text-[#1f9cd7] uppercase hover:underline"
                                            >
                                                Daftar Akun Baru
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Booking Confirmation Helper */}
                            {dataMaster && auth.user && (
                                <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-6">
                                    <div className="mb-3 flex items-center gap-2 text-amber-700">
                                        <MessageCircle className="h-5 w-5" />
                                        <span className="text-sm font-black tracking-widest uppercase">
                                            Konfirmasi WhatsApp
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed font-bold text-amber-800">
                                        Setelah booking dibuat, Anda bisa
                                        langsung konfirmasi ke admin BPMP Babel
                                        via WhatsApp. Pastikan data yang Anda
                                        masukkan sudah benar.
                                    </p>
                                    <p className="mt-3 text-xs font-black tracking-widest text-amber-900 uppercase">
                                        Kontak Admin: {dataMaster.contact}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
