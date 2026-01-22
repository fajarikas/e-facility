import Modal from '@/components/modals';
import { RichText } from '@/components/ui/rich-text';
import { RoomData } from '@/types/rooms';

type Props = {
    room: RoomData | null;
    isOpen: boolean;
    onClose: () => void;
};

const DetailRoomModal = ({ room, isOpen, onClose }: Props) => {
    if (!room) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Detail Ruangan">
                <p className="p-4 text-gray-500">Memuat detail ruangan...</p>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detail ${room.name}`}
            widthClass="max-w-3xl"
        >
            <div className="space-y-4 p-6">
                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold text-gray-600">Nama Ruangan</p>
                    <p className="text-gray-900">{room.name}</p>
                </div>

                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold text-gray-600">Bangunan</p>
                    <p className="text-gray-900">{room.building?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded border bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Harga/Malam</p>
                        <p className="text-sm font-semibold">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                            }).format(Number(room.price) || 0)}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-semibold text-gray-600">Deskripsi</p>
                    <div className="rounded border bg-gray-50 p-3">
                        <RichText html={room.description || ''} />
                    </div>
                </div>

                <div>
                    <p className="mb-2 font-semibold text-gray-600">Gambar</p>
                    {room.images && room.images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {room.images.map((img) => (
                                <img
                                    key={img}
                                    src={`/storage/${img}`}
                                    alt={room.name}
                                    className="h-24 w-full rounded object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Belum ada gambar.
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DetailRoomModal;
