import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { buildings } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Building } from '@/types/buildings';
import SearchFilter from '@/components/search/SearchFilter';
import { PaginatedData } from '@/types/paginaton';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { IoMdEye, IoMdTrash } from 'react-icons/io';
import { MdEditDocument } from 'react-icons/md';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import CreateModal from './(components)/CreateModal';
import DetailModal from './(components)/DetailModal';
import EditModal from './(components)/EditModal';
// Import Flash/Toast jika Anda menggunakannya untuk notifikasi sukses
// import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bangunan',
        href: buildings().url,
    },
];

const Buildings = ({
    data,
    filters,
}: {
    data: PaginatedData;
    filters: { search?: string | null };
}) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] =
        useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(
        null,
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isBuildingDetailModalOpen, setIsBuildingDetailModalOpen] =
        useState<boolean>(false);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
        null,
    );

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const buildingData = data.data;
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const openConfirm = (id: number | string) => {
        setPendingDeleteId(Number(id));
        setIsConfirmOpen(true);
    };

    const handleEdit = (building: Building) => {
        setEditingBuilding(building);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number | string) => {
        setDeletingId(Number(id));

        router.delete(`/buildings/${id}`, {
            preserveState: true,
            onFinish: () => setDeletingId(null),
            onSuccess: () => {
                Toastify({
                    text: 'Data berhasil dihapus',
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    stopOnFocus: true,
                    style: {
                        background: '#007E6E',
                    },
                    onClick: function () {},
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

    const handleShowDetail = (building: Building) => {
        setSelectedBuilding(building);
        setIsBuildingDetailModalOpen(true);
        router.get(
            'buildings',
            { buildingId: building.id },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bangunan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Tipe Bangunan</h1>
                    {/* <Button onClick={() => router.get('buildings/create')}>
                        Tambah
                    </Button> */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsImportOpen(true)}
                        >
                            Upload Excel
                        </Button>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            Tambah
                        </Button>
                    </div>
                </div>
                <SearchFilter
                    placeholder="Cari bangunan..."
                    value={searchValue}
                    onChange={setSearchValue}
                    onSubmit={(value) => {
                        router.get(
                            buildings().url,
                            { search: value || undefined },
                            { preserveState: true, preserveScroll: true, replace: true },
                        );
                    }}
                />
                      
                <div className="rounded-md border bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Nama Bangunan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Alamat
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {buildingData.length > 0 ? (
                                buildingData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td
                                            onClick={() =>
                                                handleShowDetail(item)
                                            }
                                            className="cursor-pointer px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900"
                                        >
                                            <IoMdEye />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                            {item.address}
                                        </td>
                                        <td
                                            className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item)}
                                                className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1 font-medium`}
                                            >
                                                <MdEditDocument color="blue" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openConfirm(item.id)
                                                }
                                                disabled={
                                                    deletingId ===
                                                    Number(item.id)
                                                }
                                                className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1 font-medium disabled:opacity-50`}
                                            >
                                                <IoMdTrash color="red" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        Belum ada data bangunan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {data.total > data.per_page && (
                        <PaginationLinks
                            from={data.from}
                            links={data.links}
                            to={data.to}
                            total={data.total}
                        />
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Tambah Bangunan"
                />
            )}

            {isBuildingDetailModalOpen && (
                <DetailModal
                    building={selectedBuilding}
                    isOpen={isBuildingDetailModalOpen}
                    onClose={() => setIsBuildingDetailModalOpen(false)}
                    title="Tambah Bangunan"
                />
            )}

            {isEditModalOpen && editingBuilding && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Edit Bangunan"
                    building={editingBuilding}
                />
            )}
            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Konfirmasi Hapus"
            >
                <p>
                    Apakah Anda yakin ingin menghapus bangunan ini? Tindakan
                    tidak dapat dibatalkan.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsConfirmOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        disabled={deletingId !== null}
                    >
                        Hapus
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Berhasil"
            >
                <p>{successMessage}</p>
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => setIsSuccessModalOpen(false)}>
                        Tutup
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                title="Upload Excel Bangunan"
            >
                <div className="space-y-3">
                    <div className="text-sm text-gray-700">
                        Header wajib: <code>name</code>, <code>address</code>. Format:{' '}
                        <code>.xlsx</code> atau{' '}
                        <code>.csv</code>.
                    </div>
                    <input
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={(e) =>
                            setImportFile(e.target.files?.[0] ?? null)
                        }
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsImportOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => {
                                if (!importFile) return;
                                router.post(
                                    '/buildings/import',
                                    { file: importFile },
                                    {
                                        forceFormData: true,
                                        onSuccess: () => {
                                            setIsImportOpen(false);
                                            setImportFile(null);
                                            Toastify({
                                                text: 'Import bangunan selesai',
                                                duration: 3000,
                                                close: true,
                                                gravity: 'top',
                                                position: 'left',
                                                style: {
                                                    background: '#1A5319',
                                                },
                                            }).showToast();
                                        },
                                        onError: (errors) => {
                                            const message =
                                                (errors as Record<string, string>)
                                                    ?.file || 'Gagal import bangunan';
                                            Toastify({
                                                text: message,
                                                duration: 4000,
                                                close: true,
                                                gravity: 'top',
                                                position: 'left',
                                                style: {
                                                    background: '#B91C1C',
                                                },
                                            }).showToast();
                                        },
                                    },
                                );
                            }}
                            disabled={!importFile}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
};

export default Buildings;
