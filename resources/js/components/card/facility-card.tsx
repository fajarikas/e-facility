import { Button } from '@/components/ui/button';
import { RoomData } from '@/types/rooms';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, Users, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    availability = 'available',
}: Props) {
    const firstImage = room.images?.[0];
    const rupiah = (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

    const statusConfig = {
        booked: { text: 'Terisi', color: 'bg-rose-500', iconColor: 'text-rose-500' },
        pending_payment: { text: 'Menunggu', color: 'bg-amber-500', iconColor: 'text-amber-500' },
        available: { text: 'Tersedia', color: 'bg-[#1f9cd7]', iconColor: 'text-[#1f9cd7]' },
    };

    const config = statusConfig[availability];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[2rem] bg-white text-gray-900 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-2 hover:shadow-2xl   "
        >

            <Link href={`/facilities/${room.id}`} className="block">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {firstImage ? (
                        <img
                            src={`/storage/${firstImage}`}
                            alt={room.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-50 text-xs font-medium text-gray-400 ">
                            Gambar belum tersedia
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                            config.color
                        )}>
                            {config.text}
                        </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-14">
                        <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-900 shadow-lg backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>4.8</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="mb-4 text-left">
                        <h3 className="mb-1 truncate text-lg font-black tracking-tight text-gray-900 group-hover:text-[#1f9cd7] transition-colors  text-left">
                            {room.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-widest ">
                            <MapPin className="h-3 w-3 text-[#1f9cd7]" />
                            <span>{room.building?.name}</span>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center gap-4 border-y border-gray-100 py-3 ">
                        <div className="flex items-center gap-1.5 text-gray-600 ">
                            <Users className="h-4 w-4" />
                            <span className="text-xs font-bold">{room.capacity} Orang</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 ">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-bold text-nowrap">Premium</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ">Mulai Dari</span>
                            <span className="text-lg font-black text-[#1f9cd7]">
                                {rupiah(Number(room.price) || 0)}
                                <span className="text-xs font-normal text-gray-400 ">/hari</span>
                            </span>
                        </div>
                        <div className="rounded-full bg-blue-50 p-2 text-[#1f9cd7] transition-colors group-hover:bg-[#1f9cd7] group-hover:text-white  ">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Like Button */}
            <div className="absolute top-4 right-4">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                        "h-9 w-9 rounded-full border-none shadow-lg backdrop-blur-md transition-all active:scale-90",
                        isLiked 
                            ? "bg-rose-500 text-white hover:bg-rose-600" 
                            : "bg-white/90 text-gray-900 hover:bg-white   "
                    )}
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
                >
                    <Heart
                        className="h-5 w-5"
                        fill={isLiked ? 'currentColor' : 'none'}
                    />
                </Button>
            </div>
        </motion.div>
    );
}
