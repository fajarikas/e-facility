import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    widthClass?: string;
};

const CreateModal = ({ isOpen, onClose }: Props) => {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        address: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('buildings', {
            onSuccess: () => {
                Toastify({
                    text: 'Data berhasil ditambahkan',
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
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Bangunan">
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
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="name">Alamat Bangunan</label>
                    <input
                        id="name"
                        type="text"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full rounded-lg border border-[#454545]/60 px-5 py-2 focus:outline-[#454545]/90"
                    />
                </div>

                <div className="flex w-full justify-between space-x-5">
                    <Button variant="outline" className="w-full">
                        Batal
                    </Button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Bangunan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateModal;
