import { Button } from '@/components/ui/button';
import { RichText } from '@/components/ui/rich-text';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataMaster, PaymentMethod } from '@/types/data-master';
import { RoomData } from '@/types/rooms';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Heart } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    room: RoomData;
    isLiked: boolean;
    dataMaster: DataMaster | null;
    paymentMethods: PaymentMethod[];
    blockedDates: string[];
};

export default function FacilityShow({
    room,
    isLiked,
    dataMaster,
    paymentMethods,
    blockedDates,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fasilitas', href: '/facilities' },
        { title: room.name, href: `/facilities/${room.id}` },
    ];

    const firstImage = room.images?.[0];
    const { errors } = usePage().props as { errors?: Record<string, string> };

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState<string>('');

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
        router.post(
            `/facilities/${room.id}/order`,
            {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: customerAddress,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                payment_method_id: paymentMethodId
                    ? Number(paymentMethodId)
                    : undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {},
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={room.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {room.name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {room.building?.name}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/facilities">Kembali</Link>
                        </Button>
                        <Button
                            type="button"
                            variant={isLiked ? 'default' : 'outline'}
                            onClick={() =>
                                router.post(
                                    `/facilities/${room.id}/like`,
                                    {},
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                )
                            }
                        >
                            <Heart
                                className="mr-2 size-4"
                                fill={isLiked ? 'currentColor' : 'none'}
                            />
                            {isLiked ? 'Tersimpan' : 'Simpan'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            {firstImage ? (
                                <img
                                    src={`/storage/${firstImage}`}
                                    alt={room.name}
                                    className="h-72 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-72 w-full items-center justify-center text-sm text-gray-500">
                                    Gambar belum tersedia
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-sm text-gray-700">
                            <div className="font-semibold text-gray-900">
                                Detail Singkat
                            </div>
                            <div className="mt-3 space-y-2">
                                <div>
                                    <span className="text-gray-500">
                                        Harga:
                                    </span>{' '}
                                    <span className="font-semibold text-blue-700">
                                        {rupiah(Number(room.price) || 0)}/hari
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Info:</span>{' '}
                                    Silakan cek deskripsi untuk detail
                                    fasilitas.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-semibold text-gray-900">
                        Deskripsi
                    </div>
                    <div className="mt-2">
                        <RichText html={room.description || ''} />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-semibold text-gray-900">
                        Order Fasilitas
                    </div>

                    <form
                        onSubmit={submitOrder}
                        className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3"
                    >
                        <div className="md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Nama
                            </label>
                            <input
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                                placeholder="Nama pemesan"
                            />
                            {errors?.customer_name && (
                                <div className="mt-1 text-xs text-red-600">
                                    {errors.customer_name}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Nomor Telepon
                            </label>
                            <input
                                value={customerPhone}
                                onChange={(e) =>
                                    setCustomerPhone(e.target.value)
                                }
                                className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                                placeholder="08xxxxxxxxxx"
                            />
                            {errors?.customer_phone && (
                                <div className="mt-1 text-xs text-red-600">
                                    {errors.customer_phone}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-1">
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Alamat
                            </label>
                            <input
                                value={customerAddress}
                                onChange={(e) =>
                                    setCustomerAddress(e.target.value)
                                }
                                className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                                placeholder="Alamat pemesan"
                            />
                            {errors?.customer_address && (
                                <div className="mt-1 text-xs text-red-600">
                                    {errors.customer_address}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-3">
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Metode Pembayaran
                            </label>
                            <select
                                value={paymentMethodId}
                                onChange={(e) =>
                                    setPaymentMethodId(e.target.value)
                                }
                                className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
                            >
                                <option value="">
                                    Pilih metode pembayaran...
                                </option>
                                {paymentMethods?.map((m) => (
                                    <option key={m.id} value={String(m.id)}>
                                        {m.type === 'va' ? 'VA' : 'Transfer'} -{' '}
                                        {m.bank_name} ({m.account_number})
                                    </option>
                                ))}
                            </select>
                            {errors?.payment_method_id && (
                                <div className="mt-1 text-xs text-red-600">
                                    {errors.payment_method_id}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Dari Tanggal
                            </label>

                            <div className="relative">
                                <DatePicker
                                    selected={
                                        checkInDate
                                            ? new Date(checkInDate)
                                            : null
                                    }
                                    onChange={(date: Date | null) => {
                                        if (!date) {
                                            setCheckInDate('');
                                            return;
                                        }

                                        const formatted =
                                            date.toLocaleDateString('sv-SE');

                                        if (isBlockedDate(formatted)) {
                                            Toastify({
                                                text: 'Tanggal tersebut sudah dibooking atau masih pending.',
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

                                        setCheckInDate(formatted);

                                        if (
                                            checkOutDate &&
                                            isRangeBlocked(
                                                formatted,
                                                checkOutDate,
                                            )
                                        ) {
                                            Toastify({
                                                text: 'Rentang tanggal berisi tanggal yang sudah dibooking.',
                                                duration: 4000,
                                                close: true,
                                                gravity: 'top',
                                                position: 'left',
                                                style: {
                                                    background: '#B91C1C',
                                                },
                                            }).showToast();
                                            setCheckOutDate('');
                                        }
                                    }}
                                    minDate={new Date()}
                                    filterDate={(date) => {
                                        const formatted =
                                            date.toLocaleDateString('sv-SE');
                                        return !isBlockedDate(formatted);
                                    }}
                                    dayClassName={(date) => {
                                        const formatted =
                                            date.toLocaleDateString('sv-SE');

                                        return isBlockedDate(formatted)
                                            ? 'bg-red-400 text-red-600 cursor-not-allowed'
                                            : '';
                                    }}
                                    placeholderText="Pilih tanggal"
                                    dateFormat="yyyy-MM-dd"
                                    // 🔥 padding kiri ditambah biar ga ketiban icon
                                    className="h-12 w-full rounded-md border border-gray-200 pr-3 pl-10 text-sm"
                                />

                                {/* ICON */}
                                <Calendar
                                    size={18}
                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                />
                            </div>

                            {errors?.check_in_date && (
                                <div className="mt-1 text-xs text-red-600">
                                    {errors.check_in_date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Sampai Tanggal
                            </label>

                            <div className="relative">
                                <DatePicker
                                    selected={
                                        checkOutDate
                                            ? new Date(checkOutDate)
                                            : null
                                    }
                                    onChange={(date: Date | null) => {
                                        if (!date) {
                                            setCheckOutDate('');
                                            return;
                                        }

                                        const formatted =
                                            date.toLocaleDateString('sv-SE');

                                        if (isBlockedDate(formatted)) {
                                            Toastify({
                                                text: 'Tanggal tersebut sudah dibooking atau masih pending.',
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

                                        if (
                                            checkInDate &&
                                            isRangeBlocked(
                                                checkInDate,
                                                formatted,
                                            )
                                        ) {
                                            Toastify({
                                                text: 'Rentang tanggal berisi tanggal yang sudah dibooking.',
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

                                        setCheckOutDate(formatted);
                                    }}
                                    minDate={
                                        checkInDate
                                            ? new Date(checkInDate)
                                            : new Date()
                                    }
                                    filterDate={(date) => {
                                        const formatted =
                                            date.toLocaleDateString('sv-SE');
                                        return !isBlockedDate(formatted);
                                    }}
                                    dayClassName={(date) => {
                                        const formatted =
                                            date.toLocaleDateString('sv-SE');

                                        return isBlockedDate(formatted)
                                            ? 'bg-red-400 text-red-600 cursor-not-allowed'
                                            : '';
                                    }}
                                    placeholderText="Pilih tanggal"
                                    dateFormat="yyyy-MM-dd"
                                    // 🔥 padding kiri biar ga ketabrak icon
                                    className="h-12 w-full rounded-md border border-gray-200 pr-3 pl-10 text-sm"
                                />

                                {/* ICON */}
                                <Calendar
                                    size={18}
                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                />
                            </div>

                            {errors?.check_out_date && (
                                <div className="mt-1 text-xs text-red-600">
                                    {errors.check_out_date}
                                </div>
                            )}
                        </div>

                        <div className="flex items-end justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                            <div className="text-sm text-gray-700">
                                <div>
                                    <span className="text-gray-500">
                                        Total hari:
                                    </span>{' '}
                                    <span className="font-semibold">
                                        {days || '-'}
                                    </span>
                                </div>
                                <div className="mt-1">
                                    <span className="text-gray-500">
                                        Total harga:
                                    </span>{' '}
                                    <span className="font-semibold text-blue-700">
                                        {days > 0 ? rupiah(totalHarga) : '-'}
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={
                                    !customerName ||
                                    !customerPhone ||
                                    !customerAddress ||
                                    !checkInDate ||
                                    !checkOutDate ||
                                    days <= 0 ||
                                    isRangeBlocked(checkInDate, checkOutDate) ||
                                    (paymentMethods?.length
                                        ? !paymentMethodId
                                        : false)
                                }
                            >
                                Buat Pesanan
                            </Button>
                        </div>
                    </form>

                    {errors?.data_master && (
                        <div className="mt-2 text-xs text-red-600">
                            {errors.data_master}
                        </div>
                    )}

                    {dataMaster && (
                        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                            <div className="font-semibold">Info Pembayaran</div>
                            {paymentMethods?.length ? (
                                <div className="mt-1 text-blue-800">
                                    Pilih metode pembayaran saat membuat
                                    pesanan.
                                </div>
                            ) : (
                                <div className="mt-1">
                                    VA:{' '}
                                    <span className="font-semibold">
                                        {dataMaster.va_number}
                                    </span>
                                </div>
                            )}
                            <div className="mt-1 text-blue-800">
                                Kontak: {dataMaster.name} — {dataMaster.contact}
                            </div>
                            <div className="mt-2 text-xs text-blue-800">
                                Setelah pesanan dibuat, admin akan konfirmasi
                                pembayaran dan menyetujui booking.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
