import { TransactionData } from "@/types/transactions";

type Props = {
  recent_transactions: TransactionData[];
  limitLabel?: string; 
};

export default function RecentTransactionsTable({
  recent_transactions,
  limitLabel = "5 transaksi terakhir",
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Transaksi Terbaru
        </h2>
        <span className="text-sm text-gray-500">{limitLabel}</span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Pemesan
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Ruangan
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Tanggal
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {recent_transactions.length > 0 ? (
              recent_transactions.map((transaction) => {
                const detail = transaction.details?.[0];

                return (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {detail?.user?.name || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {transaction.room?.name || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {transaction.check_in_date
                        ? new Date(transaction.check_in_date).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-gray-700">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(transaction.total_harga) || 0)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.is_booked === "Yes"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {transaction.is_booked === "Yes" ? "Disetujui" : "Menunggu"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  Belum ada transaksi terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
