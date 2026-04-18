import { RoomData } from '@/types/rooms';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FaStar, FaUsers } from 'react-icons/fa6';
import { HiLocationMarker } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const Popular = ({ rooms }: { rooms: RoomData[] }) => {
    return (
        <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6">
            <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
                <div className="text-left md:text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl ">
                        Fasilitas <span className="text-[#1f9cd7]">Terpopuler</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 lg:text-base ">
                        Pilihan gedung terbaik yang sering digunakan oleh mitra kami.
                    </p>
                </div>
                <Link
                    href="/facilities"
                    className="text-sm font-bold text-[#1f9cd7] transition-colors hover:text-[#1785b7]"
                >
                    Lihat Semua Fasilitas →
                </Link>
            </div>

            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
                className="pb-12"
            >
                {rooms.map((room, index) => (
                    <SwiperSlide key={room.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl  "
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={room.images?.[0] ? `/storage/${room.images[0]}` : '/images/landingpage/contoh.webp'}
                                    alt={room.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80" />

                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                                        {room.building?.name}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                                        <FaStar className="h-3 w-3" />
                                        <span>4.9</span>
                                    </div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                                    <h3 className="mb-2 text-xl font-bold leading-tight group-hover:text-[#1f9cd7] transition-colors">
                                        {room.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm opacity-90 font-medium">
                                        <div className="flex items-center gap-1">
                                            <FaUsers className="h-4 w-4" />
                                            <span>{room.capacity} Orang</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HiLocationMarker className="h-4 w-4" />
                                            <span className="truncate">BPMP Babel</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details/Action */}
                            <div className="p-6 text-left">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ">
                                            Harga Mulai
                                        </span>
                                        <span className="text-lg font-black text-[#1f9cd7]">
                                            Rp {Number(room.price).toLocaleString('id-ID')}
                                            <span className="text-xs font-normal text-gray-400 ">
                                                /Hari
                                            </span>
                                        </span>
                                    </div>

                                </div>
                                <Link
                                    href={`/facilities/${room.id}`}
                                    className="block w-full rounded-2xl bg-gray-50 py-3 text-center text-sm font-black text-gray-900 transition-all hover:bg-[#1f9cd7] hover:text-white   "
                                >
                                    Detail Fasilitas
                                </Link>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Popular;
