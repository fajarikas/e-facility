import { useEffect, useMemo, useRef, useState } from 'react';

type ChartData = { month: string; year: number; rent: number; income?: number };
type Props = { data: ChartData[]; selectedYear: number | 'all'; onYearChange: (year: number | 'all') => void };

export default function DashboardLineChart({ data, selectedYear, onYearChange }: Props) {
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
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
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
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                    <option value="all">Semua</option>

                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-64">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
