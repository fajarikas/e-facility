import FacilityCard from '@/components/card/facility-card';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedRoomData } from '@/types/rooms';
import { Head, router } from '@inertiajs/react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookmark',
        href: '/facilities/bookmarks',
    },
];

type Props = {
    data: PaginatedRoomData;
    likedRoomIds: number[];
};

export default function FacilityBookmarks({ data, likedRoomIds }: Props) {
    const likedSet = useMemo(() => new Set(likedRoomIds), [likedRoomIds]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookmark" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Fasilitas Tersimpan
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Daftar fasilitas yang kamu bookmark.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.data.length ? (
                        data.data.map((room) => (
                            <FacilityCard
                                key={room.id}
                                room={room}
                                isLiked={likedSet.has(room.id)}
                                onToggleLikeSuccess={() =>
                                    router.reload({
                                        only: ['data', 'likedRoomIds'],
                                    })
                                }
                            />
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                            Belum ada fasilitas yang kamu bookmark.
                        </div>
                    )}
                </div>

                <PaginationLinks
                    links={data.links}
                    from={data.from}
                    to={data.to}
                    total={data.total}
                />
            </div>
        </AppLayout>
    );
}

