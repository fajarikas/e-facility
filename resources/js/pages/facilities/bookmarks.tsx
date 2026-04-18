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

            <div className="flex flex-col gap-10 p-6 lg:p-10">
                {/* Header Section */}
                <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 ">
                        Fasilitas <span className="text-[#1f9cd7]">Tersimpan</span>
                    </h1>
                    <p className="max-w-2xl text-base font-medium text-gray-500 ">
                        Akses cepat ke semua gedung dan ruangan yang telah Anda tandai untuk rencana kegiatan mendatang.
                    </p>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                        <div className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-100 bg-white py-32 text-center   ring-1 ring-gray-50 ">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-[#1f9cd7]  ">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900  uppercase tracking-tight">Belum Ada Bookmark</h3>
                            <p className="mt-2 text-sm font-medium text-gray-500 ">Cari fasilitas menarik dan simpan untuk diakses nanti.</p>
                            <Link
                                href="/facilities"
                                className="mt-8 rounded-2xl bg-[#1f9cd7] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#1785b7] active:scale-95"
                            >
                                Cari Fasilitas
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {data.total > data.per_page && (
                    <div className="mt-10 border-t border-gray-100 pt-10 ">
                        <PaginationLinks
                            links={data.links}
                            from={data.from}
                            to={data.to}
                            total={data.total}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

