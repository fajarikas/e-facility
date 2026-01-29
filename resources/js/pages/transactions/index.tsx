import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { transactions } from '@/routes';
import { BreadcrumbItem, User } from '@/types';
import { RoomData } from '@/types/rooms';
import {
    PaginatedTransactionData,
    TransactionCalendarBookingData,
    TransactionCalendarData,
    TransactionData,
} from '@/types/transactions';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Building2,
    Home,
    MapPin,
    Phone,
    User as UserIcon,
} from 'lucide-react';
import { IoMdEye, IoMdTrash } from 'react-icons/io';
import { MdCheckCircle } from 'react-icons/md';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import CreateTransactionModal from './(components)/CreateModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
];

type Props = {
    data: PaginatedTransactionData;
    rooms: RoomData[];
    users: User[];
    calendar: TransactionCalendarData;
    filters: {
        search?: string | null;
        status?: string | null;
        customer_name?: string | null;
        customer_phone?: string | null;
        customer_address?: string | null;
        room?: string | null;
        building?: string | null;
    };
};

const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function pad2(value: number): string {
    return value.toString().padStart(2, '0');
}

function formatYmd(date: Date): string {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function parseMonth(month: string): { year: number; monthIndex: number } {
    const [yearString, monthString] = month.split('-');
    return {
        year: Number(yearString),
        monthIndex: Number(monthString) - 1,
    };
}

function addMonths(month: string, delta: number): string {
    const { year, monthIndex } = parseMonth(month);
    const date = new Date(year, monthIndex + delta, 1);
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function labelDate(dateKey: string): string {
    const [yearString, monthString, dayString] = dateKey.split('-');
    const date = new Date(Number(yearString), Number(monthString) - 1, Number(dayString));

    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const TransactionsIndex = ({ data, rooms, users, calendar, filters }: Props) => {
    const transactionData = data.data;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isCalendarNavigating, setIsCalendarNavigating] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [statusValue, setStatusValue] = useState(filters.status ?? '');
    const [customerNameValue, setCustomerNameValue] = useState(
        filters.customer_name ?? '',
    );
    const [customerPhoneValue, setCustomerPhoneValue] = useState(
        filters.customer_phone ?? '',
    );
    const [customerAddressValue, setCustomerAddressValue] = useState(
        filters.customer_address ?? '',
    );
    const [roomValue, setRoomValue] = useState(filters.room ?? '');
    const [buildingValue, setBuildingValue] = useState(filters.building ?? '');

    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        setStatusValue(filters.status ?? '');
    }, [filters.status]);
    useEffect(() => {
        setCustomerNameValue(filters.customer_name ?? '');
    }, [filters.customer_name]);
    useEffect(() => {
        setCustomerPhoneValue(filters.customer_phone ?? '');
    }, [filters.customer_phone]);
    useEffect(() => {
        setCustomerAddressValue(filters.customer_address ?? '');
    }, [filters.customer_address]);
    useEffect(() => {
        setRoomValue(filters.room ?? '');
    }, [filters.room]);
    useEffect(() => {
        setBuildingValue(filters.building ?? '');
    }, [filters.building]);

    const submitFilters = () => {
        router.get(
            transactions().url,
            {
                search: searchValue || undefined,
                status: statusValue || undefined,
                customer_name: customerNameValue || undefined,
                customer_phone: customerPhoneValue || undefined,
                customer_address: customerAddressValue || undefined,
                room: roomValue || undefined,
                building: buildingValue || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const { year: calendarYear, monthIndex: calendarMonthIndex } = useMemo(
        () => parseMonth(calendar.month),
        [calendar.month],
    );

    const calendarMonthLabel = useMemo(() => {
        const date = new Date(calendarYear, calendarMonthIndex, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }, [calendarMonthIndex, calendarYear]);

    const days = useMemo(() => {
        const firstOfMonth = new Date(calendarYear, calendarMonthIndex, 1);
        const firstDay = firstOfMonth.getDay(); // 0 = Minggu
        const mondayOffset = (firstDay + 6) % 7; // 0 = Senin

        const gridStart = new Date(calendarYear, calendarMonthIndex, 1 - mondayOffset);

        return Array.from({ length: 42 }, (_, idx) => {
            const date = new Date(gridStart);
            date.setDate(gridStart.getDate() + idx);

            const dateKey = formatYmd(date);
            const isInMonth = date.getMonth() === calendarMonthIndex;
            const counts = calendar.counts_by_date[dateKey];

            return {
                date,
                dateKey,
                isInMonth,
                counts,
            };
        });
    }, [calendar.counts_by_date, calendarMonthIndex, calendarYear]);

    const roomOptions = useMemo(() => {
        return rooms
            .map((room) => room.name)
            .filter((name): name is string => Boolean(name))
            .filter((value, index, array) => array.indexOf(value) === index)
            .sort((a, b) => a.localeCompare(b));
    }, [rooms]);

    const buildingOptions = useMemo(() => {
        const names = rooms
            .map((room) => room.building?.name)
            .filter((name): name is string => Boolean(name));

        return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
    }, [rooms]);

    const openDay = (dateKey: string) => {
        setSelectedDate(dateKey);
        setIsCalendarModalOpen(true);
    };

    const closeCalendarModal = () => {
        setIsCalendarModalOpen(false);
        setSelectedDate(null);
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
        closeCalendarModal();
    };

    const selectedBookings: TransactionCalendarBookingData[] = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        return calendar.bookings_by_date[selectedDate] ?? [];
    }, [calendar.bookings_by_date, selectedDate]);

    const navigateCalendarMonth = (delta: number) => {
        const nextMonth = addMonths(calendar.month, delta);

        setIsCalendarNavigating(true);
        router.get(
            '/transactions',
            { calendar_month: nextMonth },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['calendar'],
                onFinish: () => setIsCalendarNavigating(false),
            },
        );
    };

    const openConfirm = (id: number | string) => {
        setPendingDeleteId(Number(id));
        setIsConfirmOpen(true);
    };

    const handleDelete = (id: number | string) => {
        setDeletingId(Number(id));
        router.delete(`/transactions/${id}`, {
            preserveState: true,
            onFinish: () => setDeletingId(null),
            onSuccess: () => {
                Toastify({
                    text: 'Transaksi berhasil dihapus',
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    stopOnFocus: true,
                    style: {
                        background: '#007E6E',
                    },
                }).showToast();
            },
        });
    };

    const confirmDelete = () => {
        if (pendingDeleteId === null) return;
        setIsConfirmOpen(false);
        handleDelete(pendingDeleteId);
        setPendingDeleteId(null);
    };

    const handleApprove = (transaction: TransactionData) => {
        setApprovingId(transaction.id);
        router.put(`/transactions/${transaction.id}/approve`, {}, {
            preserveState: true,
            onFinish: () => setApprovingId(null),
            onSuccess: () => {
                Toastify({
                    text: 'Transaksi berhasil disetujui',
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    stopOnFocus: true,
                    style: {
                        background: '#1A5319',
                    },
                }).showToast();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Daftar Transaksi
                    </h1>
                    <div className="flex items-center gap-2">
                        {isCalendarOpen ? (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={closeCalendar}
                            >
                                Tutup Kalender
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsCalendarOpen(true)}
                            >
                                Kalender
                            </Button>
                        )}
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            Tambah Transaksi
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        submitFilters();
                    }}
                    className="flex w-full flex-col gap-3"
                >
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                        <div className="relative">
                            <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={customerNameValue}
                                onChange={(event) =>
                                    setCustomerNameValue(event.target.value)
                                }
                                placeholder="Pemesan"
                                className="h-10 pl-9"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={customerPhoneValue}
                                onChange={(event) =>
                                    setCustomerPhoneValue(event.target.value)
                                }
                                placeholder="No HP"
                                className="h-10 pl-9"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={customerAddressValue}
                                onChange={(event) =>
                                    setCustomerAddressValue(event.target.value)
                                }
                                placeholder="Alamat"
                                className="h-10 pl-9"
                            />
                        </div>
                        <div className="relative">
                            <Home className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={roomValue}
                                onChange={(event) =>
                                    setRoomValue(event.target.value)
                                }
                                list="room-options"
                                placeholder="Ruangan"
                                className="h-10 pl-9"
                            />
                            <datalist id="room-options">
                                {roomOptions.map((name) => (
                                    <option key={name} value={name} />
                                ))}
                            </datalist>
                        </div>
                        <div className="relative">
                            <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={buildingValue}
                                onChange={(event) =>
                                    setBuildingValue(event.target.value)
                                }
                                list="building-options"
                                placeholder="Bangunan"
                                className="h-10 pl-9"
                            />
                            <datalist id="building-options">
                                {buildingOptions.map((name) => (
                                    <option key={name} value={name} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            placeholder="Cari transaksi..."
                            className="h-10 sm:flex-1"
                        />
                        <select
                            value={statusValue}
                            onChange={(event) =>
                                setStatusValue(event.target.value)
                            }
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-gray-700 shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending_payment">
                                Menunggu Pembayaran
                            </option>
                            <option value="booked">Disetujui</option>
                            <option value="cancelled">Dibatalkan</option>
                            <option value="expired">Kadaluarsa</option>
                        </select>
                        <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800" size={"sm"}>
                            Cari
                        </Button>
                    </div>
                </form>

                {isCalendarOpen && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Kalender Booking
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    {calendarMonthLabel} • Klik tanggal untuk lihat detail
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigateCalendarMonth(-1)}
                                    disabled={isCalendarNavigating}
                                >
                                    Bulan Sebelumnya
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigateCalendarMonth(1)}
                                    disabled={isCalendarNavigating}
                                >
                                    Bulan Berikutnya
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-7 gap-2">
                            {dayLabels.map((label) => (
                                <div
                                    key={label}
                                    className="text-center text-xs font-semibold tracking-wide text-gray-600 uppercase"
                                >
                                    {label}
                                </div>
                            ))}

                            {days.map((cell) => {
                                const total = cell.counts?.total ?? 0;
                                const booked = cell.counts?.booked ?? 0;
                                const pending = cell.counts?.pending ?? 0;

                                return (
                                    <button
                                        key={cell.dateKey}
                                        type="button"
                                        onClick={() => openDay(cell.dateKey)}
                                        className={[
                                            'relative flex h-20 flex-col justify-between rounded-lg border p-2 text-left transition',
                                            cell.isInMonth
                                                ? 'border-gray-200 hover:bg-blue-50/50'
                                                : 'border-gray-100 bg-gray-50 text-gray-400',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="text-sm font-semibold">
                                                {cell.date.getDate()}
                                            </div>
                                            {total > 0 && (
                                                <div className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                                                    {total}
                                                </div>
                                            )}
                                        </div>

                                        {total > 0 ? (
                                            <div className="flex items-center gap-2 text-xs">
                                                {booked > 0 && (
                                                    <div className="flex items-center gap-1 text-green-700">
                                                        <span className="h-2 w-2 rounded-full bg-green-600"></span>
                                                        <span>
                                                            {booked} disetujui
                                                        </span>
                                                    </div>
                                                )}
                                                {pending > 0 && (
                                                    <div className="flex items-center gap-1 text-amber-700">
                                                        <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                                                        <span>
                                                            {pending} pending
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500">
                                                Tidak ada booking
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="sticky left-0 w-1 rounded-tl-xl bg-gray-50 px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"></th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Pemesan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            No HP
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Alamat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Ruangan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Bangunan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            VA
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Metode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Kontak
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Check In
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Check Out
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
                                    {transactionData.length > 0 ? (
                                        transactionData.map((item) => {
                                            const detail = item.details?.[0];
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="transition duration-150 ease-in-out hover:bg-blue-50/50"
                                                >
                                                    <td className="sticky left-0 cursor-pointer bg-white px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 hover:bg-blue-50/50">
                                                        <IoMdEye size={20} className="text-gray-600" />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {item.customer_name || detail?.user?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.customer_phone || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.customer_address || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.room?.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.room?.building?.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.payment_method?.account_number ||
                                                            item.data_master?.va_number ||
                                                            '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.payment_method
                                                            ? `${item.payment_method.type === 'va' ? 'VA' : 'Transfer'} - ${item.payment_method.bank_name}`
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.data_master
                                                            ? `${item.data_master.name} (${item.data_master.contact})`
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {new Date(item.check_in_date).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {new Date(item.check_out_date).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                                                        {`Rp${new Intl.NumberFormat('id-ID').format(Number(item.total_harga) || 0)}`}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                                item.status === 'expired'
                                                                    ? 'bg-gray-100 text-gray-700'
                                                                    : item.status === 'cancelled'
                                                                      ? 'bg-red-100 text-red-700'
                                                                      : item.is_booked === 'Yes' || item.status === 'booked'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                        >
                                                            {item.status === 'expired'
                                                                ? 'Kadaluarsa'
                                                                : item.status === 'cancelled'
                                                                  ? 'Dibatalkan'
                                                                  : item.is_booked === 'Yes' || item.status === 'booked'
                                                                    ? 'Disetujui'
                                                                    : 'Menunggu Pembayaran'}
                                                        </span>
                                                    </td>
                                                    <td className="flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApprove(item)}
                                                            disabled={
                                                                item.is_booked === 'Yes' ||
                                                                item.status === 'expired' ||
                                                                item.status === 'cancelled' ||
                                                                approvingId === item.id
                                                            }
                                                            className="inline-flex items-center rounded-full font-medium transition hover:scale-110 disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            <MdCheckCircle color="green" size={20} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openConfirm(item.id)}
                                                            disabled={deletingId === Number(item.id)}
                                                            className="inline-flex items-center rounded-full font-medium transition hover:scale-110 disabled:opacity-50"
                                                            title="Hapus"
                                                        >
                                                            <IoMdTrash color="red" size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={15}
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
                        from={data.from}
                        links={data.links}
                        to={data.to}
                        total={data.total}
                    />
                )}
            </div>

            {isCreateModalOpen && (
                <CreateTransactionModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    rooms={rooms}
                    users={users}
                />
            )}

            <Modal
                isOpen={isCalendarModalOpen}
                onClose={closeCalendarModal}
                title={selectedDate ? labelDate(selectedDate) : 'Detail Booking'}
                widthClass="max-w-2xl"
            >
                {selectedBookings.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-600">
                        Tidak ada booking di tanggal ini.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {selectedBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-lg border border-gray-200 bg-white p-4"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base font-semibold text-gray-900">
                                            {booking.room_name}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {booking.building_name}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={[
                                                'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
                                                booking.status === 'booked'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700',
                                            ].join(' ')}
                                        >
                                            {booking.status === 'booked'
                                                ? 'Disetujui'
                                                : 'Menunggu Pembayaran'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
                                    <div>
                                        <span className="font-semibold">
                                            Dibooking oleh:
                                        </span>{' '}
                                        {booking.booked_by}
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            Durasi:
                                        </span>{' '}
                                        {booking.check_in_date} →{' '}
                                        {booking.check_out_date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Konfirmasi Hapus"
            >
                <p>
                    Apakah Anda yakin ingin menghapus transaksi ini? Tindakan
                    tidak dapat dibatalkan.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsConfirmOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button onClick={confirmDelete} disabled={deletingId !== null}>
                        Hapus
                    </Button>
                </div>
            </Modal>
        </AppLayout>
    );
};

export default TransactionsIndex;
