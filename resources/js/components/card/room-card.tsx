import { RoomData } from '@/types/rooms';

type Props = {
    rooms: RoomData;
};

const RoomCard = ({ rooms }: Props) => {
    const firstImage = rooms.images?.[0];

    return (
        <div>
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="p-3">
                    <div className="overflow-hidden rounded-lg bg-gray-100">
                        {firstImage ? (
                            <img
                                src={`/storage/${firstImage}`}
                                alt={rooms.name}
                                className="h-44 w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-44 w-full items-center justify-center text-xs text-gray-500">
                                Gambar belum tersedia
                            </div>
                        )}
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">
                                {rooms.name}
                            </p>
                            <p className="text-xs font-semibold text-green-600">
                                Tersedia
                            </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            {rooms.building.name}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-blue-600">
                                Rp {rooms.price}/hari
                            </p>

                            <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600"
                                aria-label="Favorit"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                >
                                    <path d="M20.8 4.6c-1.6-1.7-4.3-1.7-5.9 0L12 7.5 9.1 4.6c-1.6-1.7-4.3-1.7-5.9 0-1.8 1.9-1.8 4.9 0 6.8l2.9 3 5.9 6.1 5.9-6.1 2.9-3c1.8-1.9 1.8-4.9 0-6.8z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
