import DashboardLineChart from '@/components/dashboard/DashboardLineChart';
import DashboardPieChart from '@/components/dashboard/DashboardPieChart';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import RecentTransactionsTable from '@/components/dashboard/RecentTransactionTable';
import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { buildings, dashboard, rooms, transactions } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {
    TransactionCalendarBookingData,
    TransactionCalendarData,
    TransactionData,
} from '@/types/transactions';
import { Head, Link, router } from '@inertiajs/react';
import {
    BadgeCheck,
    CalendarArrowDown,
    CalendarArrowUp,
    CalendarClock,
    CreditCard,
    LayoutGrid,
    RefreshCw,
    TimerOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    stats: {
        generated_at: string;
        buildings: number;
        rooms: number;
        transactions: number;
        total_income: number;
        selected_year: number | 'all';
        yearly_income: number;
        revenue_today: number;
        revenue_month_to_date: number;
        transactions_year_count: number;
        average_transaction_value_year: number;
        booked_count: number;
        pending_payment_count: number;
        expired_count: number;
        cancelled_count: number;
        check_ins_today: number;
        check_outs_today: number;
        active_bookings_today: number;
        upcoming_check_ins_7_days: number;
        top_rooms_by_income: {
            room_id: number;
            room_name: string;
            building_name: string;
            transactions: number;
            income: number;
        }[];
        top_buildings_by_income: {
            building_id: number;
            building_name: string;
            transactions: number;
            income: number;
        }[];
        monthly_transaction: {
            month: string;
            year: number;
            rent: number;
            income: number;
        }[];
        pending_transactions: number;
        count_transactions: { status: string; count: number }[];
    };
    calendar: TransactionCalendarData;
    recent_transactions: TransactionData[];
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
    const date = new Date(
        Number(yearString),
        Number(monthString) - 1,
        Number(dayString),
    );

    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function Dashboard({ stats, calendar, recent_transactions }: Props) {
    const years = useMemo(
        () =>
            Array.from(new Set(stats.monthly_transaction.map((d) => d.year)))
                .sort()
                .reverse(),
        [stats.monthly_transaction],
    );

    const yearLabel =
        stats.selected_year === 'all'
            ? 'Semua Tahun'
            : `Tahun ${stats.selected_year}`;

    const applyYearFilter = (year: number | 'all') => {
        router.get(
            dashboard.url({
                query: {
                    year,
                    calendar_month: calendar.month,
                },
            }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const resetToLatestYear = () => {
        router.get(
            dashboard.url({
                query: {
                    calendar_month: calendar.month,
                },
            }),
            {},
            { preserveScroll: true, replace: true },
        );
    };

    const refreshPage = () => {
        if (stats.selected_year === 'all') {
            applyYearFilter('all');
            return;
        }

        applyYearFilter(stats.selected_year);
    };

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarNavigating, setIsCalendarNavigating] = useState(false);

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

    const openDay = (dateKey: string) => {
        setSelectedDate(dateKey);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
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
            dashboard.url({
                query: {
                    year: stats.selected_year,
                    calendar_month: nextMonth,
                },
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setIsCalendarNavigating(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-8 p-6 lg:p-10">
                {/* Header Section */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 ">
                            Dashboard <span className="text-[#1f9cd7]">Utama</span>
                        </h1>
                        <p className="text-sm font-medium text-muted-foreground">
                            Update terakhir:{' '}
                            {new Date(stats.generated_at).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100  ">
                            <select
                                value={stats.selected_year}
                                onChange={(e) => {
                                    const nextYear =
                                        e.target.value === 'all'
                                            ? 'all'
                                            : Number(e.target.value);
                                    applyYearFilter(nextYear);
                                }}
                                className="h-9 rounded-lg border-none bg-transparent px-3 text-sm font-bold focus:ring-0"
                            >
                                <option value="all">Semua Tahun</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        Tahun {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            onClick={refreshPage}
                            variant="outline"
                            size="icon"
                            className="rounded-xl shadow-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <DashboardStatCard
                        title="Pendapatan Total"
                        value={stats.total_income.toLocaleString('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                        })}
                        tone="success"
                        icon={<CreditCard className="size-5" />}
                        description="Akumulasi pendapatan sistem"
                    />
                    <DashboardStatCard
                        title="Booking Disetujui"
                        value={stats.booked_count.toLocaleString('id-ID')}
                        tone="info"
                        icon={<BadgeCheck className="size-5" />}
                        description="Total transaksi sukses"
                    />
                    <DashboardStatCard
                        title="Pending Approval"
                        value={stats.pending_transactions.toLocaleString('id-ID')}
                        tone="warning"
                        icon={<CalendarClock className="size-5" />}
                        description="Menunggu konfirmasi admin"
                    />
                    <DashboardStatCard
                        title="Total Ruangan"
                        value={stats.rooms.toLocaleString('id-ID')}
                        icon={<LayoutGrid className="size-5" />}
                        description="Kapasitas fasilitas tersedia"
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold tracking-tight">Kalender Aktivitas</h2>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Jadwal Penggunaan Fasilitas</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigateCalendarMonth(-1)}
                                    className="h-8 w-8 p-0"
                                >
                                    <span className="sr-only">Prev</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </Button>
                                <span className="text-sm font-bold min-w-[120px] text-center">{calendarMonthLabel}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigateCalendarMonth(1)}
                                    className="h-8 w-8 p-0"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Button>
                            </div>
                        </div>

                        <Card className="border-none bg-white shadow-sm ring-1 ring-gray-100   overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-7 border-b ">
                                    {dayLabels.map((label) => (
                                        <div key={label} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7">
                                    {days.map((cell) => {
                                        const total = cell.counts?.total ?? 0;
                                        const booked = cell.counts?.booked ?? 0;
                                        return (
                                            <button
                                                key={cell.dateKey}
                                                onClick={() => openDay(cell.dateKey)}
                                                className={cn(
                                                    "relative h-24 p-3 text-left transition-all border-r border-b ",
                                                    !cell.isInMonth && "bg-gray-50/50  opacity-40",
                                                    cell.isInMonth && "hover:bg-blue-50/50 "
                                                )}
                                            >
                                                <span className={cn(
                                                    "text-sm font-bold",
                                                    new Date().toDateString() === cell.date.toDateString() && "flex h-7 w-7 items-center justify-center rounded-full bg-[#1f9cd7] text-white"
                                                )}>
                                                    {cell.date.getDate()}
                                                </span>
                                                {total > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className={cn(
                                                            "h-1.5 w-full rounded-full",
                                                            booked > 0 ? "bg-emerald-500" : "bg-amber-500"
                                                        )} />
                                                        <span className="text-[10px] font-bold text-muted-foreground">{total} Trx</span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Section */}
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Analitik Status</h2>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Distribusi Transaksi</p>
                        </div>
                        <Card className="border-none bg-white shadow-sm ring-1 ring-gray-100   p-4">
                            <DashboardPieChart data={stats.count_transactions} />
                        </Card>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Top Performing Rooms</h3>
                            <div className="space-y-3">
                                {stats.top_rooms_by_income.slice(0, 4).map((item) => (
                                    <div key={item.room_id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100  ">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{item.room_name}</span>
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.building_name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-[#1f9cd7]">
                                                {item.income.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                                            </div>
                                            <div className="text-[10px] font-medium text-muted-foreground">{item.transactions} Trx</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tren Pendapatan */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight">Tren Pendapatan Bulanan</h2>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Visualisasi Performa Tahunan</p>
                    </div>
                    <Card className="border-none bg-white shadow-sm ring-1 ring-gray-100   p-6">
                        <DashboardLineChart
                            data={stats.monthly_transaction}
                            selectedYear={stats.selected_year}
                            onYearChange={applyYearFilter}
                            showYearSelect={false}
                        />
                    </Card>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-6 pb-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Transaksi Terbaru</h2>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Monitoring Log Sistem</p>
                        </div>
                        <Button asChild variant="link" className="text-[#1f9cd7] font-bold">
                            <Link href={transactions().url}>Lihat Semua Transaksi</Link>
                        </Button>
                    </div>
                    <div className="overflow-hidden rounded-3xl border-none bg-white shadow-sm ring-1 ring-gray-100  ">
                        <RecentTransactionsTable
                            recent_transactions={recent_transactions}
                        />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedDate ? labelDate(selectedDate) : 'Detail Booking'}
                widthClass="max-w-2xl"
            >
                {selectedBookings.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                        Tidak ada booking di tanggal ini.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {selectedBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-lg border border-border bg-background p-4"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base font-semibold text-foreground">
                                            {booking.room_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {booking.building_name}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
                                                booking.status === 'booked'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            )}
                                        >
                                            {booking.status === 'booked'
                                                ? 'Disetujui'
                                                : 'Menunggu Pembayaran'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-foreground sm:grid-cols-2">
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
        </AppLayout>
    );
}
