import DashboardLineChart from '@/components/dashboard/DashboardLineChart';
import DashboardPieChart from '@/components/dashboard/DashboardPieChart';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import RecentTransactionsTable from '@/components/dashboard/RecentTransactionTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { buildings, dashboard, rooms, transactions } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { TransactionData } from '@/types/transactions';
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
import { useMemo } from 'react';

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
    recent_transactions: TransactionData[];
};

export default function Dashboard({ stats, recent_transactions }: Props) {
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
        router.get(dashboard.url(), {}, { preserveScroll: true, replace: true });
    };

    const refreshPage = () => {
        if (stats.selected_year === 'all') {
            applyYearFilter('all');
            return;
        }

        applyYearFilter(stats.selected_year);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                Dashboard Monitoring BPMP Babel
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Update terakhir:{' '}
                                {new Date(stats.generated_at).toLocaleString(
                                    'id-ID',
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => applyYearFilter('all')}
                            >
                                Semua Tahun
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => applyYearFilter(new Date().getFullYear())}
                            >
                                Tahun Ini
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetToLatestYear}
                            >
                                Terbaru
                            </Button>
                            <Button size="sm" onClick={refreshPage}>
                                <RefreshCw className="size-4" aria-hidden />
                                Refresh
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm text-muted-foreground">
                                Filter Tahun:
                            </p>
                            <select
                                value={stats.selected_year}
                                onChange={(e) => {
                                    const nextYear =
                                        e.target.value === 'all'
                                            ? 'all'
                                            : Number(e.target.value);
                                    applyYearFilter(nextYear);
                                }}
                                className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="all">Semua</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-muted-foreground">
                                Aktif: <span className="font-medium text-foreground">{yearLabel}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="secondary" size="sm">
                                <Link href={transactions().url}>
                                    Lihat Transaksi
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={rooms().url}>Kelola Ruangan</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={buildings().url}>
                                    Kelola Bangunan
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-semibold tracking-tight">
                            Ringkasan
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gambaran cepat kapasitas dan aktivitas.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardStatCard
                            title="Bangunan"
                            value={stats.buildings.toLocaleString('id-ID')}
                            icon={
                                <LayoutGrid
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Ruangan"
                            value={stats.rooms.toLocaleString('id-ID')}
                            icon={
                                <LayoutGrid
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Transaksi"
                            value={stats.transactions.toLocaleString('id-ID')}
                            icon={
                                <CreditCard
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Pending Approval"
                            value={stats.pending_transactions.toLocaleString(
                                'id-ID',
                            )}
                            tone="warning"
                            icon={
                                <CalendarClock
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-semibold tracking-tight">
                            Keuangan
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ringkasan pendapatan dan performa transaksi.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardStatCard
                            title="Pendapatan Total"
                            value={stats.total_income.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                            description="Akumulasi seluruh transaksi."
                            tone="success"
                            icon={
                                <CreditCard className="size-4" aria-hidden />
                            }
                        />
                        <DashboardStatCard
                            title="Pendapatan Hari Ini"
                            value={stats.revenue_today.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                            description="Masuk per hari (created_at)."
                            tone="success"
                            icon={
                                <CreditCard
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Pendapatan Bulan Ini"
                            value={stats.revenue_month_to_date.toLocaleString(
                                'id-ID',
                                { style: 'currency', currency: 'IDR' },
                            )}
                            description="Month-to-date."
                            tone="success"
                            icon={
                                <CreditCard
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title={`Pendapatan ${yearLabel}`}
                            value={stats.yearly_income.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                            description={`Transaksi: ${stats.transactions_year_count.toLocaleString(
                                'id-ID',
                            )} • Rata-rata: ${stats.average_transaction_value_year.toLocaleString(
                                'id-ID',
                                { style: 'currency', currency: 'IDR' },
                            )}`}
                            tone="success"
                            icon={
                                <CreditCard
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-semibold tracking-tight">
                            Operasional
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Status transaksi dan aktivitas harian.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardStatCard
                            title="Booked"
                            value={stats.booked_count.toLocaleString('id-ID')}
                            tone="success"
                            icon={
                                <BadgeCheck
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Pending Payment"
                            value={stats.pending_payment_count.toLocaleString(
                                'id-ID',
                            )}
                            tone="warning"
                            icon={
                                <CalendarClock
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Expired"
                            value={stats.expired_count.toLocaleString('id-ID')}
                            tone="danger"
                            icon={
                                <TimerOff className="size-4" aria-hidden />
                            }
                        />
                        <DashboardStatCard
                            title="Cancelled"
                            value={stats.cancelled_count.toLocaleString('id-ID')}
                            tone="danger"
                            icon={
                                <TimerOff className="size-4" aria-hidden />
                            }
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardStatCard
                            title="Check-in Hari Ini"
                            value={stats.check_ins_today.toLocaleString('id-ID')}
                            icon={
                                <CalendarArrowDown
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Check-out Hari Ini"
                            value={stats.check_outs_today.toLocaleString(
                                'id-ID',
                            )}
                            icon={
                                <CalendarArrowUp
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Booking Aktif Hari Ini"
                            value={stats.active_bookings_today.toLocaleString(
                                'id-ID',
                            )}
                            description="Booking booked yang sedang berjalan."
                            icon={
                                <BadgeCheck
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                        <DashboardStatCard
                            title="Check-in 7 Hari Kedepan"
                            value={stats.upcoming_check_ins_7_days.toLocaleString(
                                'id-ID',
                            )}
                            description="Total check-in booked (H+7)."
                            icon={
                                <CalendarClock
                                    className="size-4"
                                    aria-hidden
                                />
                            }
                        />
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold tracking-tight">
                                Analitik
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tren bulanan dan distribusi status transaksi.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <DashboardLineChart
                                data={stats.monthly_transaction}
                                selectedYear={stats.selected_year}
                                onYearChange={applyYearFilter}
                                showYearSelect={false}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <DashboardPieChart data={stats.count_transactions} />
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-semibold tracking-tight">
                            Top Performers
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ruangan dan bangunan dengan income tertinggi.
                        </p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <CardTitle className="text-base">
                                    Top Ruangan (Income)
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {yearLabel}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    {stats.top_rooms_by_income.length ? (
                                        stats.top_rooms_by_income.map(
                                            (item) => (
                                                <div
                                                    key={item.room_id}
                                                    className="flex items-start justify-between gap-4"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium">
                                                            {item.room_name}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {item.building_name}{' '}
                                                            •{' '}
                                                            {item.transactions}{' '}
                                                            transaksi
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {item.income.toLocaleString(
                                                            'id-ID',
                                                            {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada data.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <CardTitle className="text-base">
                                    Top Bangunan (Income)
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {yearLabel}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    {stats.top_buildings_by_income.length ? (
                                        stats.top_buildings_by_income.map(
                                            (item) => (
                                                <div
                                                    key={item.building_id}
                                                    className="flex items-start justify-between gap-4"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium">
                                                            {item.building_name}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {item.transactions}{' '}
                                                            transaksi
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {item.income.toLocaleString(
                                                            'id-ID',
                                                            {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada data.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold tracking-tight">
                                Aktivitas Terbaru
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Monitoring transaksi terbaru.
                            </p>
                        </div>
                        <Button asChild variant="link" size="sm">
                            <Link href={transactions().url}>
                                Buka semua transaksi
                            </Link>
                        </Button>
                    </div>
                    <RecentTransactionsTable
                        recent_transactions={recent_transactions}
                    />
                </section>
            </div>
        </AppLayout>
    );
}
