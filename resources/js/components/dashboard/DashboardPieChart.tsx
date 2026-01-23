import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useEffect, useMemo, useRef } from 'react';

type StatusCount = {
    status: string;
    count: number;
};

type Props = {
    data: StatusCount[];
};

const STATUS_LABELS: Record<string, string> = {
    pending_payment: 'Pending Payment',
    booked: 'Booked',
    cancelled: 'Cancelled',
    expired: 'Expired',
};

const STATUS_COLORS: Record<string, string> = {
    pending_payment: 'rgba(234,179,8,0.9)',
    booked: 'rgba(34,197,94,0.9)',
    cancelled: 'rgba(239,68,68,0.9)',
    expired: 'rgba(148,163,184,0.9)',
};

function formatStatus(status: string): string {
    if (STATUS_LABELS[status]) {
        return STATUS_LABELS[status];
    }

    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function DashboardPieChart({ data }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<any>(null);

    const normalized = useMemo(
        () =>
            data
                .map((item) => ({
                    status: item.status,
                    count: Number(item.count ?? 0),
                }))
                .filter((item) => item.count > 0),
        [data],
    );

    useEffect(() => {
        const run = async () => {
            if (!canvasRef.current) return;

            if (!normalized.length) {
                chartRef.current?.destroy();
                chartRef.current = null;
                return;
            }

            const chartJs = await import('chart.js');
            const { Chart, PieController, ArcElement, Tooltip, Legend } =
                chartJs;

            Chart.register(PieController, ArcElement, Tooltip, Legend);

            chartRef.current?.destroy();

            chartRef.current = new Chart(canvasRef.current, {
                type: 'pie',
                data: {
                    labels: normalized.map((item) => formatStatus(item.status)),
                    datasets: [
                        {
                            data: normalized.map((item) => item.count),
                            backgroundColor: normalized.map(
                                (item) =>
                                    STATUS_COLORS[item.status] ??
                                    'rgba(59,130,246,0.9)',
                            ),
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.9)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
                            },
                        },
                    },
                },
            });
        };

        run();

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [normalized]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base">
                    Status Transaksi
                </CardTitle>
            </CardHeader>
            <CardContent>
                {normalized.length ? (
                    <div className="h-72">
                        <canvas ref={canvasRef} />
                    </div>
                ) : (
                    <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                        Belum ada data transaksi.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
