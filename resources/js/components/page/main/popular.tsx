import RoomCard from '@/components/card/room-card';
import { RoomData } from '@/types/rooms';
import { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
    rooms: RoomData[];
};

const Popular = ({ rooms }: Props) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div>
            <div className="mx-auto w-full max-w-[1280px] px-4 py-12">
                <div className="flex items-center justify-between">
                    <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">
                        Paling Diminati
                    </h2>

                    <a
                        href="#"
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                        See More
                    </a>
                </div>

                <div className="mt-6">
                    {!isMounted ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {rooms.map((room) => (
                                <RoomCard key={room.id} rooms={room} />
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4.2 },
                            }}
                        >
                            {rooms.map((room) => (
                                <SwiperSlide key={room.id} className="h-auto">
                                    <RoomCard rooms={room} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popular;
