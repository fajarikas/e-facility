import Modal from '@/components/modals';
import SearchFilter from '@/components/search/SearchFilter';
import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { rooms } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Building } from '@/types/buildings';
import { PaginatedRoomData, RoomData } from '@/types/rooms';
import { htmlToText } from '@/lib/rich-text';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { IoMdEye, IoMdTrash, IoMdCloudUpload, IoMdAdd } from 'react-icons/io';
import { MdEditDocument, MdOutlineMeetingRoom } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import CreateRoomModal from './(components)/CreateModal';
import DetailRoomModal from './(components)/DetailModal';
import EditRoomModal from './(components)/EditModal';

type Props = {
    data: PaginatedRoomData;
    buildings: Building[];
    filters: { search?: string | null; per_page?: number };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Ruangan',
        href: rooms().url,
    },
];

const index = ({ data, buildings, filters }: Props) => {
    const roomData = data.data;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
    const [isRoomDetailOpen, setIsRoomDetailOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const handlePerPageChange = (newPerPage: string) => {
        router.get(
            rooms().url,
            { ...filters, per_page: newPerPage, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const openConfirm = (id: number | string) => {
        setPendingDeleteId(Number(id));
        setIsConfirmOpen(true);
    };

    const handleEdit = (room: RoomData) => {
        setEditingRoom(room);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number | string) => {
        setDeletingId(Number(id));
        router.delete(`/rooms/${id}`, {
            preserveState: true,
            onFinish: () => setDeletingId(null),
            onSuccess: () => {
                Toastify({
                    text: 'Ruangan berhasil dihapus',
                    duration: 3000,
                    gravity: 'top',
                    position: 'left',
                    style: { background: '#10b981' },
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

    const handleShowDetail = (room: RoomData) => {
        setSelectedRoom(room);
        setIsRoomDetailOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Ruangan" />

            <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Ruangan</h1>
                        <p className="text-base text-gray-500 mt-1">Kelola ketersediaan kamar, ruang rapat, dan aula fasilitas Anda.</p>
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
                            <span className="font-semibold">Tambah Ruangan</span>
                        </Button>
                    </div>
                </div>

                {/* Search & Filter Bar - Floating Style */}
                <div className="relative -mt-4 z-10 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-white p-2 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                        <SearchFilter
                            placeholder="Cari nama ruangan, tipe, atau nama gedung..."
                            value={searchValue}
                            onChange={setSearchValue}
                            onSubmit={(value) => {
                                router.get(
                                    rooms().url,
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

                {/* Grid View for Rooms */}
                {roomData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {roomData.map((item) => (
                            <div 
                                key={item.id}
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    {item.images && item.images.length > 0 ? (
                                        <img 
                                            src={`/storage/${item.images[0]}`} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MdOutlineMeetingRoom size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/50">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Tersedia</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            <MdEditDocument size={18} />
                                        </button>
                                        <button 
                                            onClick={() => openConfirm(item.id)}
                                            className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            <IoMdTrash size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                                        <HiOutlineLocationMarker size={14} />
                                        {item.building.name}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1 leading-relaxed">
                                        {htmlToText(item.description || '')}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Harga Sewa</span>
                                            <div className="text-lg font-black text-emerald-600">
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                }).format(Number(item.price) || 0)}
                                                <span className="text-xs font-medium text-gray-400">/hari</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleShowDetail(item)}
                                            className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-100"
                                        >
                                            <IoMdEye size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-24 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center mb-6">
                            <MdOutlineMeetingRoom size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Belum Ada Ruangan</h3>
                        <p className="text-gray-500 max-w-sm">Daftar ruangan akan muncul di sini setelah Anda menambahkannya.</p>
                        <Button 
                            className="mt-6 bg-indigo-600"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Tambah Sekarang
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
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
            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                buildings={buildings}
            />

            {isEditModalOpen && editingRoom && (
                <EditRoomModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    room={editingRoom}
                    buildings={buildings}
                />
            )}

            {isRoomDetailOpen && (
                <DetailRoomModal
                    isOpen={isRoomDetailOpen}
                    onClose={() => setIsRoomDetailOpen(false)}
                    room={selectedRoom}
                />
            )}

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Konfirmasi Hapus Ruangan"
            >
                <div className="p-1">
                    <p className="text-gray-600">
                        Apakah Anda yakin ingin menghapus ruangan <span className="font-bold text-gray-900">"{roomData.find(r => r.id === pendingDeleteId)?.name}"</span>? 
                        Data yang sudah dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 border-none text-gray-700"
                            onClick={() => setIsConfirmOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 shadow-md transition-all"
                            onClick={confirmDelete}
                            disabled={deletingId !== null}
                        >
                            {deletingId !== null ? 'Menghapus...' : 'Ya, Hapus Ruangan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                title="Import Data Ruangan"
            >
                <div className="space-y-4 p-1">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="text-sm font-semibold text-indigo-900 mb-1">Ketentuan File:</h4>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                            Header wajib: <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 font-bold">name</code>, <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 font-bold">price</code>, <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 font-bold">description</code>, <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 font-bold">building_id</code>.
                            Format: <span className="font-bold">.xlsx</span> atau <span className="font-bold">.csv</span>.
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 transition-colors">
                        <IoMdCloudUpload size={48} className="text-gray-300" />
                        <input
                            type="file"
                            id="room-file-upload"
                            className="hidden"
                            accept=".xlsx,.csv"
                            onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                        />
                        <label htmlFor="room-file-upload" className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-700 underline text-sm text-center">
                            {importFile ? importFile.name : 'Pilih file spreadsheet ruangan'}
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsImportOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            onClick={() => {
                                if (!importFile) return;
                                router.post(
                                    '/rooms/import',
                                    { file: importFile },
                                    {
                                        forceFormData: true,
                                        onSuccess: () => {
                                            setIsImportOpen(false);
                                            setImportFile(null);
                                            Toastify({
                                                text: 'Import data ruangan berhasil',
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

export default index;
