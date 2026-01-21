import { Button } from '@/components/ui/button';
import { RoomData } from '@/types/rooms';
import { Link, router } from '@inertiajs/react';
import { Heart } from 'lucide-react';

type Props = {
    room: RoomData;
    isLiked: boolean;
    onToggleLikeSuccess?: () => void;
};

export default function FacilityCard({ room, isLiked, onToggleLikeSuccess }: Props) {
    const firstImage = room.images?.[0];
    const rupiah = (amount: number) => `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;

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
                        <p className="text-sm font-semibold text-gray-900">
                            {room.name}
                        </p>
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
