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
import { IoMdEye, IoMdTrash, IoMdCloudUpload, IoMdAdd } from 'react-icons/io';
import { MdEditDocument } from 'react-icons/md';
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker } from 'react-icons/hi';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import CreateModal from './(components)/CreateModal';
import DetailModal from './(components)/DetailModal';
import EditModal from './(components)/EditModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bangunan',
        href: buildings().url,
    },
];

const BuildingsIndex = ({
    data,
    filters,
}: {
    data: PaginatedData;
    filters: { search?: string | null; per_page?: number };
}) => {
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
        if (filters.search !== undefined) {
            setSearchValue(filters.search ?? '');
        }
    }, [filters.search]);

    const handlePerPageChange = (newPerPage: string) => {
        router.get(
            buildings().url,
            { ...filters, per_page: newPerPage, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

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
                    text: 'Bangunan berhasil dihapus',
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    stopOnFocus: true,
                    style: {
                        background: '#10b981',
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

    const handleShowDetail = (building: Building) => {
        setSelectedBuilding(building);
        setIsBuildingDetailModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Bangunan" />
            
            <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
                {/* Header Section with Glassmorphism feel */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Bangunan</h1>
                        <p className="text-base text-gray-500 mt-1">Kelola infrastruktur dan lokasi properti Anda dalam satu tempat.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 transition-all active:scale-95"
                            onClick={() => setIsImportOpen(true)}
                        >
                            <IoMdCloudUpload size={20} />
                            <span className="font-semibold">Import</span>
                        </Button>
                        <Button 
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 px-6"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <IoMdAdd size={22} />
                            <span className="font-semibold">Tambah Gedung</span>
                        </Button>
                    </div>
                </div>

                {/* Search & Filter Bar - Floating Style */}
                <div className="relative -mt-4 z-10 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-white p-2 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                        <SearchFilter
                            placeholder="Cari nama gedung atau lokasi spesifik..."
                            value={searchValue}
                            onChange={setSearchValue}
                            onSubmit={(value) => {
                                router.get(
                                    buildings().url,
                                    { ...filters, search: value || undefined, page: 1 },
                                    { preserveState: true, preserveScroll: true, replace: true },
                                );
                            }}
                        />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Tampilkan</span>
                        <select 
                            value={filters.per_page ?? 10}
                            onChange={(e) => handlePerPageChange(e.target.value)}
                            className="bg-gray-50 border-none rounded-xl text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                {/* Grid View */}
                {buildingData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {buildingData.map((item) => (
                            <div 
                                key={item.id}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                            <HiOutlineOfficeBuilding size={28} />
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleShowDetail(item)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                title="Detail"
                                            >
                                                <IoMdEye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                title="Edit"
                                            >
                                                <MdEditDocument size={20} />
                                            </button>
                                            <button
                                                onClick={() => openConfirm(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Hapus"
                                            >
                                                <IoMdTrash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                                        {item.name}
                                    </h3>
                                    
                                    <div className="flex items-start gap-2 text-gray-500">
                                        <HiOutlineLocationMarker className="flex-shrink-0 mt-1 text-indigo-400" size={18} />
                                        <p className="text-sm leading-relaxed line-clamp-2">{item.address}</p>
                                    </div>
                                </div>
                                
                                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-xs font-medium text-gray-400">
                                    <span>ID: #{item.id}</span>
                                    <span className="bg-white px-2 py-1 rounded-md border border-gray-100">Aktif</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-24 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center mb-6">
                            <HiOutlineOfficeBuilding size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Belum Ada Gedung</h3>
                        <p className="text-gray-500 max-w-sm">Mulai dengan menambahkan gedung pertama Anda untuk mengelola fasilitas di dalamnya.</p>
                        <Button 
                            className="mt-6 bg-indigo-600"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Tambah Sekarang
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
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

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Tambah Bangunan Baru"
                />
            )}

            {isBuildingDetailModalOpen && (
                <DetailModal
                    building={selectedBuilding}
                    isOpen={isBuildingDetailModalOpen}
                    onClose={() => setIsBuildingDetailModalOpen(false)}
                    title="Informasi Detail Bangunan"
                />
            )}

            {isEditModalOpen && editingBuilding && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Perbarui Data Bangunan"
                    building={editingBuilding}
                />
            )}

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Konfirmasi Penghapusan"
            >
                <div className="p-1">
                    <p className="text-gray-600">
                        Apakah Anda yakin ingin menghapus bangunan <span className="font-bold text-gray-900">"{buildingData.find(b => b.id === pendingDeleteId)?.name}"</span>? 
                        Seluruh data terkait bangunan ini mungkin akan terdampak.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none"
                            onClick={() => setIsConfirmOpen(false)}
                        >
                            Batalkan
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 shadow-md"
                            onClick={confirmDelete}
                            disabled={deletingId !== null}
                        >
                            {deletingId !== null ? 'Menghapus...' : 'Ya, Hapus Data'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                title="Upload Spreadsheet Bangunan"
            >
                <div className="space-y-4 p-1">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="text-sm font-semibold text-indigo-900 mb-1">Panduan Format File:</h4>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                            Pastikan file spreadsheet memiliki header kolom: <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 font-bold">name</code> dan <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 font-bold">address</code>.
                            Format yang didukung adalah <span className="font-bold">.xlsx</span> atau <span className="font-bold">.csv</span>.
                        </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 transition-colors">
                        <IoMdCloudUpload size={48} className="text-gray-300" />
                        <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept=".xlsx,.csv"
                            onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-700 underline">
                            {importFile ? importFile.name : 'Klik untuk memilih file'}
                        </label>
                        <p className="text-xs text-gray-400">Maksimum ukuran file: 5MB</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsImportOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700"
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
                                                text: 'Import data bangunan berhasil',
                                                duration: 3000,
                                                gravity: 'top',
                                                position: 'left',
                                                style: { background: '#10b981' },
                                            }).showToast();
                                        },
                                    },
                                );
                            }}
                            disabled={!importFile}
                        >
                            Mulai Import
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
};

export default BuildingsIndex;
