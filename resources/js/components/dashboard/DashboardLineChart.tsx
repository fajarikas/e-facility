import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useEffect, useMemo, useRef, useState } from 'react';

type ChartData = { month: string; year: number; rent: number; income?: number };
type Props = {
    data: ChartData[];
    selectedYear: number | 'all';
    onYearChange: (year: number | 'all') => void;
    showYearSelect?: boolean;
};

export default function DashboardLineChart({
    data,
    selectedYear,
    onYearChange,
    showYearSelect = true,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<any>(null);

    const years = useMemo(
        () => Array.from(new Set(data.map((d) => d.year))).sort(),
        [data],
    );

    const [localSelectedYear, setLocalSelectedYear] = useState<number | 'all'>(selectedYear);

    useEffect(() => {
        setLocalSelectedYear(selectedYear);
    }, [selectedYear]);

    const filteredData = useMemo(() => {
        if (localSelectedYear === 'all') return data;
        return data.filter((d) => d.year === localSelectedYear);
    }, [data, localSelectedYear]);

    useEffect(() => {
        const run = async () => {
            if (!canvasRef.current) return;
            if (!filteredData.length) return;

            const chartJs = await import('chart.js');
            const {
                Chart,
                LineController,
                LineElement,
                PointElement,
                LinearScale,
                CategoryScale,
                Tooltip,
                Legend,
                Title,
            } = chartJs;

            Chart.register(
                LineController,
                LineElement,
                PointElement,
                LinearScale,
                CategoryScale,
                Tooltip,
                Legend,
                Title,
            );

            chartRef.current?.destroy();

            chartRef.current = new Chart(canvasRef.current, {
                type: 'line',
                data: {
                    labels: filteredData.map((d) => d.month),
                    datasets: [
                        {
                            label: 'Jumlah Transaksi',
                            data: filteredData.map((d) => d.rent || 0),
                            yAxisID: 'y',
                            tension: 0.4,
                            borderWidth: 3,
                            pointRadius: 4,
                            borderColor: 'rgba(59,130,246,1)',
                        },
                        {
                            label: 'Income Bulanan',
                            data: filteredData.map((d) => d.income || 0),
                            yAxisID: 'y1',
                            tension: 0.4,
                            borderWidth: 3,
                            pointRadius: 4,
                            borderColor: 'rgba(255,215,0,1)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    if (
                                        ctx.dataset.label === 'Income Bulanan'
                                    ) {
                                        return `Income: Rp ${Number(ctx.parsed.y).toLocaleString('id-ID')}`;
                                    }
                                    return `${ctx.dataset.label}: ${ctx.parsed.y}`;
                                },
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            position: 'right',
                            title: { display: true, text: 'Jumlah Transaksi' },
                        },
                        y1: {
                            beginAtZero: true,
                            position: 'left',
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: 'Income' },
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
    }, [filteredData]);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base">Tren Transaksi</CardTitle>
                {showYearSelect ? (
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-muted-foreground">
                            Tahun
                        </label>

                        <select
                            value={localSelectedYear}
                            onChange={(e) => {
                                const nextYear =
                                    e.target.value === 'all'
                                        ? 'all'
                                        : Number(e.target.value);

                                setLocalSelectedYear(nextYear);
                                onYearChange(nextYear);
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
                    </div>
                ) : null}
            </CardHeader>
            <CardContent>
                <div className="h-72">
                    <canvas ref={canvasRef} />
                </div>
            </CardContent>
        </Card>
    );
}
