import Modal from '@/components/modals';
import { Button } from '@/components/ui/button';
import { RoomData } from '@/types/rooms';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    rooms: RoomData[];
    users: User[];
};

const CreateTransactionModal = ({ isOpen, onClose, rooms, users }: Props) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        check_in_date: '',
        check_out_date: '',
        total_harga: 0,
        room_id: 0,
        user_id: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/transactions', {
            onSuccess: () => {
                Toastify({
                    text: 'Transaksi berhasil dibuat!',
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
                console.error('Error creating transaction:', err);
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Transaksi">
            <form onSubmit={submit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="user_id" className="text-sm font-medium">
                        Pemesan
                    </label>
                    <select
                        id="user_id"
                        value={data.user_id}
                        onChange={(e) =>
                            setData('user_id', Number(e.target.value))
                        }
                        className="rounded-lg border border-gray-400 px-3 py-2 text-gray-700 focus:outline-blue-500"
                    >
                        <option value={0} disabled>
                            Pilih User
                        </option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    {errors.user_id && (
                        <p className="text-xs text-red-500">
                            {errors.user_id}
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="room_id" className="text-sm font-medium">
                        Ruangan
                    </label>
                    <select
                        id="room_id"
                        value={data.room_id}
                        onChange={(e) =>
                            setData('room_id', Number(e.target.value))
                        }
                        className="rounded-lg border border-gray-400 px-3 py-2 text-gray-700 focus:outline-blue-500"
                    >
                        <option value={0} disabled>
                            Pilih Ruangan
                        </option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name} - {room.building?.name}
                            </option>
                        ))}
                    </select>
                    {errors.room_id && (
                        <p className="text-xs text-red-500">
                            {errors.room_id}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <label
                            htmlFor="check_in_date"
                            className="text-sm font-medium"
                        >
                            Check In
                        </label>
                        <input
                            id="check_in_date"
                            type="date"
                            value={data.check_in_date}
                            onChange={(e) =>
                                setData('check_in_date', e.target.value)
                            }
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.check_in_date && (
                            <p className="text-xs text-red-500">
                                {errors.check_in_date}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label
                            htmlFor="check_out_date"
                            className="text-sm font-medium"
                        >
                            Check Out
                        </label>
                        <input
                            id="check_out_date"
                            type="date"
                            value={data.check_out_date}
                            onChange={(e) =>
                                setData('check_out_date', e.target.value)
                            }
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                        />
                        {errors.check_out_date && (
                            <p className="text-xs text-red-500">
                                {errors.check_out_date}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="total_harga" className="text-sm font-medium">
                        Total Harga (IDR)
                    </label>
                    <input
                        id="total_harga"
                        type="number"
                        value={data.total_harga}
                        onChange={(e) =>
                            setData('total_harga', Number(e.target.value))
                        }
                        className="rounded-lg border border-gray-400 px-3 py-2 focus:outline-blue-500"
                    />
                    {errors.total_harga && (
                        <p className="text-xs text-red-500">
                            {errors.total_harga}
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
                        {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTransactionModal;
