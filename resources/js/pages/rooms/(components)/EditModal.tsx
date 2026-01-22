import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Building } from '@/types/buildings';
import { RoomData } from '@/types/rooms';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    room: RoomData;
    buildings: Building[];
};

const EditRoomModal = ({ isOpen, onClose, room, buildings }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [buildingQuery, setBuildingQuery] = useState('');
    const [isBuildingOpen, setIsBuildingOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: room.name,
        price: room.price,
        description: room.description,
        building_id: room.building_id,
        existing_images: room.images || [],
        new_images: [] as File[],
    });

    useEffect(() => {
        if (!room) return;
        setData({
            name: room.name,
            price: room.price,
            description: room.description,
            building_id: room.building_id,
            existing_images: room.images || [],
            new_images: [],
        });
        setBuildingQuery(room.building?.name || '');
        setIsBuildingOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [room]);

    const selectedBuilding = useMemo(
        () => buildings.find((b) => b.id === data.building_id) || null,
        [buildings, data.building_id],
    );

    const filteredBuildings = useMemo(() => {
        const term = buildingQuery.trim().toLowerCase();
        if (!term) return buildings;
        return buildings.filter((b) => b.name.toLowerCase().includes(term));
    }, [buildingQuery, buildings]);

    const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = data.existing_images.length + files.length;

        if (totalImages > 4) {
            alert('Total gambar tidak boleh lebih dari 4.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setData('new_images', [] as File[]);
            return;
        }

        setData('new_images', files);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/rooms/${room.id}` as string, {
            forceFormData: true,
            onSuccess: () => {
                Toastify({
                    text: 'Ruangan berhasil diperbarui!',
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
                handleClose();
            },
            onError: (err) => {
                console.error('Error updating room:', err);
            },
        });
    };

    const handleClose = () => {
        onClose();
    };

    const removeExistingImage = (path: string) => {
        setData(
            'existing_images',
            data.existing_images.filter((img) => img !== path),
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit Ruangan: ${room.name}`}
            widthClass="max-w-4xl"
        >
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nama Ruangan
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="price" className="text-sm font-medium">
                            Harga/Malam (IDR)
                        </label>
                        <input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) =>
                                setData('price', Number(e.target.value))
                            }
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.price && (
                            <p className="text-xs text-red-500">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label
                            htmlFor="building_id"
                            className="text-sm font-medium"
                        >
                            Nama Bangunan
                        </label>
                        <div className="relative">
                            <input
                                id="building_id"
                                type="text"
                                value={
                                    isBuildingOpen
                                        ? buildingQuery
                                        : selectedBuilding?.name ||
                                          buildingQuery
                                }
                                onFocus={() => setIsBuildingOpen(true)}
                                onChange={(e) => {
                                    setBuildingQuery(e.target.value);
                                    setData('building_id', 0);
                                    setIsBuildingOpen(true);
                                }}
                                placeholder="Ketik untuk cari bangunan..."
                                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-gray-700 focus:outline-blue-500"
                                autoComplete="off"
                            />
                            {isBuildingOpen && (
                                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                    {filteredBuildings.length > 0 ? (
                                        filteredBuildings.map((b) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setData('building_id', b.id);
                                                    setBuildingQuery(b.name);
                                                    setIsBuildingOpen(false);
                                                }}
                                            >
                                                {b.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">
                                            Bangunan tidak ditemukan
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.building_id && (
                            <p className="text-xs text-red-500">
                                {errors.building_id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-1">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium"
                    >
                        Deskripsi
                    </label>
                    <RichTextEditor
                        value={data.description}
                        onChange={(value) => setData('description', value)}
                        placeholder="Tulis deskripsi fasilitas..."
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Gambar Saat Ini</p>
                    {data.existing_images.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                            {data.existing_images.map((img) => (
                                <div
                                    key={img}
                                    className="relative overflow-hidden rounded-lg border"
                                >
                                    <img
                                        src={`/storage/${img}`}
                                        alt="Room"
                                        className="h-24 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img)}
                                        className="absolute right-1 top-1 rounded-full bg-white px-2 py-1 text-xs text-red-600 shadow"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">
                            Tidak ada gambar yang tersimpan.
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="new_images" className="text-sm font-medium">
                        Tambah Gambar (Maks. 4 total)
                        {data.new_images.length > 0 && (
                            <span className="ml-2 text-blue-600">
                                ({data.new_images.length} file baru dipilih)
                            </span>
                        )}
                    </label>
                    <input
                        id="new_images"
                        type="file"
                        multiple
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleNewImagesChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.new_images && (
                        <p className="text-xs text-red-500">
                            {errors.new_images}
                        </p>
                    )}
                </div>

                <div className="flex w-full justify-end space-x-3 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Memperbarui...' : 'Perbarui Ruangan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditRoomModal;
