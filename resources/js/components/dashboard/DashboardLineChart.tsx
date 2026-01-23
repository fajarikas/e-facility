import { useEffect, useMemo, useRef, useState } from "react";

type ChartData = { month: string; year: number; rent: number; income?: number };
type Props = { data: ChartData[] };

export default function DashboardLineChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  const years = useMemo(
    () => Array.from(new Set(data.map((d) => d.year))).sort(),
    [data]
  );

  const latestYear = years[years.length - 1];

  const [selectedYear, setSelectedYear] = useState<number | "all">("all");


  useEffect(() => {
    if (years.length && selectedYear === "all") {
      setSelectedYear(latestYear);
    }
  }, [years, latestYear, selectedYear]);

  const filteredData = useMemo(() => {
    if (selectedYear === "all") return data;
    return data.filter((d) => d.year === selectedYear);
  }, [data, selectedYear]);

  useEffect(() => {
    const run = async () => {
      if (!canvasRef.current) return;
      if (!filteredData.length) return;

      const chartJs = await import("chart.js");
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
        Title
      );

      chartRef.current?.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: filteredData.map((d) => d.month),
          datasets: [
            {
              label: "Jumlah Transaksi",
              data: filteredData.map((d) => d.rent || 0),
              yAxisID: "y",
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              borderColor: "rgba(59,130,246,1)",
            },
            {
              label: "Income Bulanan",
              data: filteredData.map((d) => d.income || 0),
              yAxisID: "y1",
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              borderColor: "rgba(255,215,0,1)",
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
                  if (ctx.dataset.label === "Income Bulanan") {
                    return `Income: Rp ${Number(ctx.parsed.y).toLocaleString("id-ID")}`;
                  }
                  return `${ctx.dataset.label}: ${ctx.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              position: "right",
              title: { display: true, text: "Jumlah Transaksi" },
            },
            y1: {
              beginAtZero: true,
              position: "left",
              grid: { drawOnChartArea: false },
              title: { display: true, text: "Income" },
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
        <label className="text-sm font-medium text-gray-700">Tahun</label>

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
        >
          {/* opsi all kalau kamu mau */}
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
