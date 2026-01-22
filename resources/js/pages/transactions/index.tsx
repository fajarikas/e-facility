import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { RoomData } from '@/types/rooms';
import { PaginatedTransactionData, TransactionData } from '@/types/transactions';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
};

const TransactionsIndex = ({ data, rooms, users }: Props) => {
    const transactionData = data.data;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [approvingId, setApprovingId] = useState<number | null>(null);

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
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        Tambah Transaksi
                    </Button>
                </div>

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
