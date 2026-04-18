import FacilityCard from '@/components/card/facility-card';
import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedRoomData } from '@/types/rooms';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fasilitas',
        href: '/facilities',
    },
];

type Props = {
    data: PaginatedRoomData;
    likedRoomIds: number[];
    availabilityByRoomId: Record<
        number,
        'available' | 'pending_payment' | 'booked'
    >;
    filters: {
        q?: string;
        date?: string;
    };
};

export default function FacilitiesIndex({
    data,
    likedRoomIds,
    availabilityByRoomId,
    filters,
}: Props) {
    const [q, setQ] = useState(filters.q ?? '');
    const [date, setDate] = useState(filters.date ?? '');

    const likedSet = useMemo(() => new Set(likedRoomIds), [likedRoomIds]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/facilities',
            { q, date },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setQ('');
        setDate('');
        router.get('/facilities', {}, { replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fasilitas" />

            <div className="flex flex-col gap-10 p-6 lg:p-10">
                {/* Header Section */}
                <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 ">
                        Daftar <span className="text-[#1f9cd7]">Fasilitas</span>
                    </h1>
                    <p className="max-w-2xl text-base font-medium text-gray-500 ">
                        Pilih fasilitas terbaik untuk kebutuhan acara, pertemuan, atau penginapan Anda di BPMP Provinsi Kepulauan Bangka Belitung.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="sticky top-20 z-20">
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-3 rounded-[2rem] bg-white p-3 shadow-2xl ring-1 ring-gray-100 lg:flex-row lg:items-center  "
                    >
                        <div className="flex flex-1 items-center gap-3 px-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1f9cd7] ">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Cari fasilitas atau bangunan..."
                                className="h-12 w-full border-none bg-transparent text-sm font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400 "
                            />
                        </div>

                        <div className="hidden h-8 w-[1px] bg-gray-100 lg:block " />

                        <div className="flex shrink-0 items-center gap-3 px-4 lg:w-64">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1f9cd7] ">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-12 w-full border-none bg-transparent text-sm font-bold text-gray-900 focus:ring-0 "
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" className="h-14 rounded-2xl bg-[#1f9cd7] px-8 text-sm font-black text-white hover:bg-[#1785b7] shadow-lg shadow-blue-500/20">
                                Cari Sekarang
                            </Button>
                            {(q || date) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-14 rounded-2xl px-6 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                    onClick={clearFilters}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.data.length ? (
                        data.data.map((room) => (
                            <FacilityCard
                                key={room.id}
                                room={room}
                                isLiked={likedSet.has(room.id)}
                                availability={availabilityByRoomId[room.id] ?? 'available'}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-100 bg-white py-24 text-center   ring-1 ring-gray-50 ">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-[#1f9cd7]  ">
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 ">Tidak ada hasil</h3>
                            <p className="mt-2 text-sm text-gray-500 ">Coba ubah kata kunci atau filter tanggal Anda.</p>
                            <Button onClick={clearFilters} variant="link" className="mt-4 text-[#1f9cd7] font-bold">Tampilkan Semua Fasilitas</Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-10 border-t border-gray-100 pt-10 ">
                    <PaginationLinks
                        links={data.links}
                        from={data.from}
                        to={data.to}
                        total={data.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
