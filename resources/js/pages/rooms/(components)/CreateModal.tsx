import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { Building } from '@/types/buildings';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo, useRef, useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    buildings: Building[];
};

const CreateRoomModal = ({ isOpen, onClose, buildings }: Props) => {
    console.log('🚀 ~ CreateRoomModal ~ buildings:', buildings);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [buildingQuery, setBuildingQuery] = useState('');
    const [isBuildingOpen, setIsBuildingOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        price: 0,
        capacity_count: 0,
        toilet_count: 0,
        area: 0,
        description: '',
        building_id: 0,
        images: [] as File[],
    });

    const selectedBuilding = useMemo(
        () => buildings.find((b) => b.id === data.building_id) || null,
        [buildings, data.building_id],
    );

    const filteredBuildings = useMemo(() => {
        const term = buildingQuery.trim().toLowerCase();
        if (!term) return buildings;
        return buildings.filter((b) => b.name.toLowerCase().includes(term));
    }, [buildingQuery, buildings]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 4) {
            alert('Maksimal hanya 4 gambar yang diperbolehkan.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setData('images', []);
            return;
        }

        setData('images', files);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/rooms', {
            forceFormData: true,
            onSuccess: () => {
                Toastify({
                    text: 'Ruangan berhasil ditambahkan!',
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
                handleClose();
            },
            onError: (err) => {
                // Menampilkan error validasi dari server ke console
                console.error('Error submitting room:', err);
            },
        });
    };

    const handleClose = () => {
        reset();
        setBuildingQuery('');
        setIsBuildingOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Tambah Ruangan"
            widthClass="max-w-4xl"
        >
            <form onSubmit={submit} className="space-y-4">
                {/* 1. Baris Pertama (Nama, Harga, Bangunan) */}
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
                                                    setData(
                                                        'building_id',
                                                        b.id,
                                                    );
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

                {/* 2. Baris Kedua (Kapasitas, Toilet, Luas) */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                        <label
                            htmlFor="capacity_count"
                            className="text-sm font-medium"
                        >
                            Kapasitas
                        </label>
                        <input
                            id="capacity_count"
                            type="number"
                            value={data.capacity_count}
                            onChange={(e) =>
                                setData(
                                    'capacity_count',
                                    Number(e.target.value),
                                )
                            }
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.capacity_count && (
                            <p className="text-xs text-red-500">
                                {errors.capacity_count}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label
                            htmlFor="toilet_count"
                            className="text-sm font-medium"
                        >
                            Jumlah Toilet
                        </label>
                        <input
                            id="toilet_count"
                            type="number"
                            value={data.toilet_count}
                            onChange={(e) =>
                                setData('toilet_count', Number(e.target.value))
                            }
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.toilet_count && (
                            <p className="text-xs text-red-500">
                                {errors.toilet_count}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="area" className="text-sm font-medium">
                            Luas (m²)
                        </label>
                        <input
                            id="area"
                            type="number"
                            value={data.area}
                            onChange={(e) =>
                                setData('area', Number(e.target.value))
                            }
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.area && (
                            <p className="text-xs text-red-500">
                                {errors.area}
                            </p>
                        )}
                    </div>
                </div>

                {/* 3. Baris Ketiga (Deskripsi) */}
                <div className="flex flex-col space-y-1">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium"
                    >
                        Deskripsi
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* 4. Baris Keempat (Gambar) */}
                <div className="flex flex-col space-y-1">
                    <label htmlFor="images" className="text-sm font-medium">
                        Gambar Ruangan (Maks. 4)
                        {data.images.length > 0 && (
                            <span className="ml-2 text-blue-600">
                                ({data.images.length} file dipilih)
                            </span>
                        )}
                    </label>
                    <input
                        id="images"
                        type="file"
                        multiple
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.images && (
                        <p className="text-xs text-red-500">{errors.images}</p>
                    )}
                    {/* Error untuk validasi images.* (misal, required minimal 1) */}
                    {errors['images.0'] && (
                        <p className="text-xs text-red-500">
                            Minimal 1 gambar harus diunggah.
                        </p>
                    )}
                </div>

                {/* 5. Tombol Aksi */}
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
                        {processing ? 'Menyimpan...' : 'Simpan Ruangan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateRoomModal;
