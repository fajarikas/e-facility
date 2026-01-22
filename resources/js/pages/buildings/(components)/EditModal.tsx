import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { Building } from '@/types/buildings';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    building: Building;
    widthClass?: string;
};

const EditModal = ({ isOpen, onClose, building }: Props) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: building.name,
        address: building.address,
    });

    useEffect(() => {
        if (building) {
            setData({
                name: building.name,
                address: building.address,
            });
        }
    }, [building]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/buildings/${building.id}`, {
            onSuccess: () => {
                Toastify({
                    text: 'Data berhasil diperbarui',
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: 'top',
                    position: 'left',
                    stopOnFocus: true,
                    style: {
                        background: '#1A5319',
                    },
                    onClick: function () {},
                }).showToast();
                onClose();
            },
            onError: (err) => {
                console.error('Error updating building:', err);
            },
        });
    };

    const handleClose = () => {
        // Ketika ditutup, reset data form kembali ke nilai awal (optional, tapi baik)
        // reset({
        //     name: building.name,
        //     bmn_type: building.bmn_type,
        //     address: building.address,
        // });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit Bangunan: ${building.name}`}
        >
            <form onSubmit={submit} className="space-y-3">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="name">Nama Bangunan</label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-lg border border-[#454545]/60 px-5 py-2 focus:outline-[#454545]/90"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="address">Alamat Bangunan</label>
                    <input
                        id="address"
                        type="text"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full rounded-lg border border-[#454545]/60 px-5 py-2 focus:outline-[#454545]/90"
                    />
                    {errors.address && (
                        <p className="text-sm text-red-600">{errors.address}</p>
                    )}
                </div>

                <div className="flex w-full justify-between space-x-5 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                        {processing ? 'Memperbarui...' : 'Perbarui Bangunan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditModal;
