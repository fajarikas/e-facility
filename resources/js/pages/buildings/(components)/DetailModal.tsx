import Modal from '@/components/modals';
import { Building } from '@/types/buildings';

type Props = {
    building: Building | null;
    isOpen: boolean;
    onClose: () => void;
    title: string;
};

const DetailModal = ({ building, isOpen, onClose, title }: Props) => {
    if (!building) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Detail Bangunan">
                <p className="p-4 text-gray-500">Memuat detail bangunan...</p>
            </Modal>
        );
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detail ${building.name}`}
        >
            <div className="space-y-4 p-6">
                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold text-gray-600">Nama Bangunan</p>
                    <p className="text-gray-900">{building.name}</p>
                </div>

                <div>
                    <p className="mb-1 font-semibold text-gray-600">Alamat</p>
                    <p className="rounded border bg-gray-50 p-2 whitespace-pre-wrap text-gray-900">
                        {building.address}
                    </p>
                </div>

                {building.created_at && (
                    <div className="pt-4 text-sm text-gray-500">
                        Dibuat pada:{' '}
                        {new Date(building.created_at).toLocaleDateString(
                            'id-ID',
                        )}
                    </div>
                )}

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

export default DetailModal;
