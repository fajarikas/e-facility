import { Button } from '@/components/ui/button';
import { RoomData } from '@/types/rooms';
import { Link, router } from '@inertiajs/react';
import { Heart } from 'lucide-react';

type Props = {
    room: RoomData;
    isLiked: boolean;
    onToggleLikeSuccess?: () => void;
    availability?: 'available' | 'pending_payment' | 'booked';
};

export default function FacilityCard({
    room,
    isLiked,
    onToggleLikeSuccess,
    availability,
}: Props) {
    const firstImage = room.images?.[0];
    const rupiah = (amount: number) => `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;

    const badge = (() => {
        if (availability === 'booked') {
            return { text: 'Booked', className: 'bg-red-100 text-red-700 border-red-200' };
        }
        if (availability === 'pending_payment') {
            return { text: 'Menunggu Pembayaran', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        }
        return { text: 'Tersedia', className: 'bg-green-100 text-green-700 border-green-200' };
    })();

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <Link href={`/facilities/${room.id}`} className="block">
                <div className="p-3">
                    <div className="overflow-hidden rounded-lg bg-gray-100">
                        {firstImage ? (
                            <img
                                src={`/storage/${firstImage}`}
                                alt={room.name}
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
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900">
                                {room.name}
                            </p>
                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}>
                                {badge.text}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            {room.building?.name}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-blue-600">
                                {rupiah(Number(room.price) || 0)}/hari
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="absolute top-3 right-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/90"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.post(
                            `/facilities/${room.id}/like`,
                            {},
                            {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => onToggleLikeSuccess?.(),
                            },
                        );
                    }}
                    aria-label={isLiked ? 'Hapus bookmark' : 'Bookmark'}
                >
                    <Heart
                        className="size-5"
                        fill={isLiked ? 'currentColor' : 'none'}
                    />
                </Button>
            </div>
        </div>
    );
}
