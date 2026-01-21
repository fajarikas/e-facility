import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataMaster } from '@/types/data-master';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Master',
        href: '/admin/data-masters',
    },
];

type Props = {
    data: DataMaster[];
};

export default function DataMastersIndex({ data }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editing, setEditing] = useState<DataMaster | null>(null);

    const [form, setForm] = useState({ name: '', contact: '', va_number: '' });
    const [editForm, setEditForm] = useState({
        name: '',
        contact: '',
        va_number: '',
    });

    const openEdit = (item: DataMaster) => {
        setEditing(item);
        setEditForm({
            name: item.name,
            contact: item.contact,
            va_number: item.va_number,
        });
        setIsEditOpen(true);
    };

    const create = () => {
        router.post('/admin/data-masters', form, {
            preserveState: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                setForm({ name: '', contact: '', va_number: '' });
                Toastify({
                    text: 'Data master berhasil dibuat',
                    duration: 3000,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    style: { background: '#007E6E' },
                }).showToast();
            },
        });
    };

    const update = () => {
        if (!editing) return;
        router.put(`/admin/data-masters/${editing.id}`, editForm, {
            preserveState: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setEditing(null);
                Toastify({
                    text: 'Data master berhasil diperbarui',
                    duration: 3000,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    style: { background: '#1A5319' },
                }).showToast();
            },
        });
    };

    const remove = (id: number) => {
        router.delete(`/admin/data-masters/${id}`, {
            preserveState: true,
            onSuccess: () => {
                Toastify({
                    text: 'Data master berhasil dihapus',
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
            <Head title="Data Master" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Data Master (VA Pembayaran)
                    </h1>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        Tambah Data
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Kontak
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            VA
                                        </th>
                                        <th className="rounded-tr-xl px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data.length ? (
                                        data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition duration-150 ease-in-out hover:bg-blue-50/50"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {item.contact}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {item.va_number}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                openEdit(item)
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                remove(item.id)
                                                            }
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
                                                colSpan={4}
                                                className="px-6 py-10 text-center text-base text-gray-500"
                                            >
                                                Belum ada data master.
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
                title="Tambah Data Master"
            >
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Nama
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={form.name}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, name: e.target.value }))
                            }
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Kontak
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={form.contact}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    contact: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            VA Number
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={form.va_number}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    va_number: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsCreateOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={create}
                            disabled={
                                !form.name || !form.contact || !form.va_number
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
                title="Edit Data Master"
            >
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Nama
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={editForm.name}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    name: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Kontak
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={editForm.contact}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    contact: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            VA Number
                        </label>
                        <input
                            className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm"
                            value={editForm.va_number}
                            onChange={(e) =>
                                setEditForm((p) => ({
                                    ...p,
                                    va_number: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={update}
                            disabled={
                                !editForm.name ||
                                !editForm.contact ||
                                !editForm.va_number
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

