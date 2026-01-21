import FacilityCard from '@/components/card/facility-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    filters: {
        q: string;
        date: string;
    };
    likedRoomIds: number[];
};

export default function FacilitiesIndex({ data, filters, likedRoomIds }: Props) {
    const [q, setQ] = useState(filters.q ?? '');
    const [date, setDate] = useState(filters.date ?? '');

    const likedSet = useMemo(() => new Set(likedRoomIds), [likedRoomIds]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/facilities',
            { q: q || undefined, date: date || undefined },
            { replace: true, preserveState: true },
        );
    };

    const clearFilters = () => {
        setQ('');
        setDate('');
        router.get('/facilities', {}, { replace: true, preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fasilitas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Daftar Fasilitas
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Cari fasilitas dan filter berdasarkan tanggal
                            ketersediaan.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
                >
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Pencarian
                        </label>
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari nama fasilitas / bangunan..."
                        />
                    </div>

                    <div className="sm:w-60">
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase">
                            Tanggal Booking
                        </label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" className="h-14">
                            Terapkan
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-14"
                            onClick={clearFilters}
                            disabled={!q && !date}
                        >
                            Reset
                        </Button>
                    </div>
                </form>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.data.length ? (
                        data.data.map((room) => (
                            <FacilityCard
                                key={room.id}
                                room={room}
                                isLiked={likedSet.has(room.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                            Tidak ada fasilitas yang sesuai filter.
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

