import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionData } from '@/types/transactions';

type Props = {
    recent_transactions: TransactionData[];
    limitLabel?: string;
};

export default function RecentTransactionsTable({
    recent_transactions,
    limitLabel = '5 transaksi terakhir',
}: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
                <span className="text-sm text-muted-foreground">
                    {limitLabel}
                </span>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Pemesan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Ruangan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Tanggal
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {recent_transactions.length ? (
                                recent_transactions.map((transaction) => {
                                    const detail = transaction.details?.[0];
                                    const isApproved =
                                        transaction.is_booked === 'Yes';

                                    return (
                                        <tr key={transaction.id}>
                                            <td className="px-4 py-3 text-sm">
                                                {detail?.user?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {transaction.room?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {transaction.check_in_date
                                                    ? new Date(
                                                          transaction.check_in_date,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                      )
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-medium">
                                                {new Intl.NumberFormat(
                                                    'id-ID',
                                                    {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        minimumFractionDigits: 0,
                                                    },
                                                ).format(
                                                    Number(
                                                        transaction.total_harga,
                                                    ) || 0,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge
                                                    variant={
                                                        isApproved
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {isApproved
                                                        ? 'Disetujui'
                                                        : 'Menunggu'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-10 text-center text-sm text-muted-foreground"
                                    >
                                        Belum ada transaksi terbaru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
