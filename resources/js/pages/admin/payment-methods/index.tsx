import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataMaster, PaymentMethod } from '@/types/data-master';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Metode Pembayaran',
        href: '/admin/payment-methods',
    },
];

type PaymentMethodRow = PaymentMethod & { data_master?: DataMaster };

type Props = {
    dataMasters: DataMaster[];
    data: PaymentMethodRow[];
};

const typeLabel = (t: PaymentMethod['type']) => (t === 'va' ? 'VA' : 'Transfer');

export default function AdminPaymentMethodsIndex({ dataMasters, data }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editing, setEditing] = useState<PaymentMethodRow | null>(null);

    const defaultDataMasterId = dataMasters?.[0]?.id ?? null;

    const [form, setForm] = useState({
        data_master_id: defaultDataMasterId ? String(defaultDataMasterId) : '',
        type: 'va' as PaymentMethod['type'],
        bank_name: 'BRI',
        account_number: '',
        account_holder: '',
        is_active: true,
    });

    const [editForm, setEditForm] = useState({
        data_master_id: '',
        type: 'va' as PaymentMethod['type'],
        bank_name: '',
        account_number: '',
        account_holder: '',
        is_active: true,
    });

    const openEdit = (item: PaymentMethodRow) => {
        setEditing(item);
        setEditForm({
            data_master_id: String(item.data_master_id),
            type: item.type,
            bank_name: item.bank_name,
            account_number: item.account_number,
            account_holder: item.account_holder ?? '',
            is_active: item.is_active,
        });
        setIsEditOpen(true);
    };

    const resolvedRows = useMemo(() => data ?? [], [data]);

    const create = () => {
        router.post(
            '/admin/payment-methods',
            {
                ...form,
                data_master_id: Number(form.data_master_id),
            },
            {
                preserveState: true,
                onSuccess: () => {
                    setIsCreateOpen(false);
                    setForm((p) => ({
                        ...p,
                        account_number: '',
                        account_holder: '',
                    }));
                    Toastify({
                        text: 'Metode pembayaran berhasil dibuat',
                        duration: 3000,
                        close: true,
                        gravity: 'top',
                        position: 'left',
                        style: { background: '#007E6E' },
                    }).showToast();
                },
            },
        );
    };

    const update = () => {
        if (!editing) return;
        router.put(
            `/admin/payment-methods/${editing.id}`,
            {
                ...editForm,
                data_master_id: Number(editForm.data_master_id),
            },
            {
                preserveState: true,
                onSuccess: () => {
                    setIsEditOpen(false);
                    setEditing(null);
                    Toastify({
                        text: 'Metode pembayaran berhasil diperbarui',
                        duration: 3000,
                        close: true,
                        gravity: 'top',
                        position: 'left',
                        style: { background: '#1A5319' },
                    }).showToast();
                },
            },
        );
    };

    const remove = (id: number) => {
        router.delete(`/admin/payment-methods/${id}`, {
            preserveState: true,
            onSuccess: () => {
                Toastify({
                    text: 'Metode pembayaran berhasil dihapus',
                    duration: 3000,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    style: { background: '#B91C1C' },
                }).showToast();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Metode Pembayaran" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Metode Pembayaran
                    </h1>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        Tambah Metode
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Tipe
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Bank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Nomor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            a.n.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Aktif
                                        </th>
                                        <th className="rounded-tr-xl px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {resolvedRows.length ? (
                                        resolvedRows.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition duration-150 ease-in-out hover:bg-blue-50/50"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {typeLabel(item.type)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {item.bank_name}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm text-gray-700">
                                                    {item.account_number}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {item.account_holder || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {item.is_active ? 'Ya' : 'Tidak'}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => openEdit(item)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => remove(item.id)}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-10 text-center text-base text-gray-500"
                                            >
                                                Belum ada metode pembayaran.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Tambah Metode Pembayaran"
            >
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Data Master
                        </label>
                        <select
                            className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
                            value={form.data_master_id}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    data_master_id: e.target.value,
                                }))
                            }
                        >
                            <option value="">Pilih data master...</option>
                            {dataMasters.map((dm) => (
                                <option key={dm.id} value={String(dm.id)}>
                                    {dm.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Tipe
                            </label>
                            <select
                                className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
                                value={form.type}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        type: e.target.value as PaymentMethod['type'],
                                    }))
                                }
                            >
                                <option value="va">VA</option>
                                <option value="bank_transfer">Transfer Bank</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Bank
                            </label>
                            <input
                                className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                                value={form.bank_name}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        bank_name: e.target.value,
                                    }))
                                }
                                placeholder="BRI / Mandiri / BNI / BCA ..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Nomor VA / Rekening
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 font-mono text-sm"
                            value={form.account_number}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    account_number: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            a.n. (opsional)
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={form.account_holder}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    account_holder: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    is_active: e.target.checked,
                                }))
                            }
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Aktif
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={create}
                            disabled={
                                !form.data_master_id ||
                                !form.bank_name ||
                                !form.account_number
                            }
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Metode Pembayaran"
            >
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Data Master
                        </label>
                        <select
                            className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
                            value={editForm.data_master_id}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    data_master_id: e.target.value,
                                }))
                            }
                        >
                            <option value="">Pilih data master...</option>
                            {dataMasters.map((dm) => (
                                <option key={dm.id} value={String(dm.id)}>
                                    {dm.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Tipe
                            </label>
                            <select
                                className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
                                value={editForm.type}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                        ...p,
                                        type: e.target.value as PaymentMethod['type'],
                                    }))
                                }
                            >
                                <option value="va">VA</option>
                                <option value="bank_transfer">Transfer Bank</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                                Bank
                            </label>
                            <input
                                className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                                value={editForm.bank_name}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                        ...p,
                                        bank_name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Nomor VA / Rekening
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 font-mono text-sm"
                            value={editForm.account_number}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    account_number: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            a.n. (opsional)
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={editForm.account_holder}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    account_holder: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="edit_is_active"
                            type="checkbox"
                            checked={editForm.is_active}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    is_active: e.target.checked,
                                }))
                            }
                        />
                        <label htmlFor="edit_is_active" className="text-sm text-gray-700">
                            Aktif
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={update}
                            disabled={
                                !editForm.data_master_id ||
                                !editForm.bank_name ||
                                !editForm.account_number
                            }
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
