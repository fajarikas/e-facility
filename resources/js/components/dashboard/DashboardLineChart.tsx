import { useEffect, useRef } from "react";

type ChartData = { month: string; rent: number; income?: number };
type Props = { data: ChartData[] };

export default function DashboardLineChart({ data }: Props) {
  console.log("🚀 ~ DashboardLineChart ~ data:", data)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    let destroyed = false;

    const run = async () => {
      if (!canvasRef.current) return;

      // Chart.js di-load hanya di browser
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

      if (destroyed) return;

      // destroy chart lama
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: data.map((d) => d.month),
          datasets: [
            {
              label: "Jumlah Transaksi",
              data: data.map((d) => d.rent || 0),
              yAxisID: "y",
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              fill: false,
              borderColor: "rgba(59, 130, 246, 1)",

            },
            {
              label: "Income Bulanan",
              data: data.map((d) => d.income || 0),
              tension: 0.4,
              yAxisID: "y1",
              borderWidth: 3,
              pointRadius: 4,
              fill: false,
              borderColor: "rgba(255,255,0, 1)",

            },
          ],
        },
        
        options: {
            
          responsive: true,
          maintainAspectRatio: false,
         plugins: {
  legend: { display: true },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  if (ctx.dataset.label === "Income") {
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
            title: {
            display: true,
            text: "Jumlah Transaksi",
            },
        },
        y1: {
            beginAtZero: true,
            position: "left",
            grid: {
            drawOnChartArea: false,
            },
            title: {
            display: true,
            text: "Income",
            },
        },
        },

        },
      });
    };

    run();

    return () => {
      destroyed = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

    return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Grafik Transaksi
        </h3>

        <div className="h-64">
            <canvas ref={canvasRef} />
        </div>
    </div>

    );
}
