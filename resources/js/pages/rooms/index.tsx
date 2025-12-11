import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { rooms } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { PaginatedRoomData } from '@/types/rooms';
import { Head } from '@inertiajs/react';
import { IoMdEye, IoMdTrash } from 'react-icons/io';
import { MdEditDocument } from 'react-icons/md';

type Props = {};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ruangan',
        href: rooms().url,
    },
];

const index = ({ data }: { data: PaginatedRoomData }) => {
    const roomData = data.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ruangan" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Daftar Ruangan
                    </h1>
                    <Button onClick={() => console.log()}>
                        Tambah Ruangan
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="sticky left-0 w-1 rounded-tl-xl bg-gray-50 px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase"></th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Nama Ruangan
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Harga/Malam
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Kapasitas
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Toilet Count
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Luas (m²)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Nama Bangunan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Alamat Bangunan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Jenis BMN
                                        </th>
                                        <th className="rounded-tr-xl px-6 py-3"></th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {roomData.length > 0 ? (
                                        roomData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition duration-150 ease-in-out hover:bg-blue-50/50"
                                            >
                                                {/* Kolom Aksi (DETAIL - Tetap di sini) */}
                                                <td
                                                    // onClick={() =>
                                                    //     handleShowDetail(item)
                                                    // }
                                                    className="sticky left-0 cursor-pointer bg-white px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 hover:bg-blue-50/50"
                                                >
                                                    <IoMdEye
                                                        size={20}
                                                        className="text-gray-600 transition hover:text-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-700">
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0,
                                                        },
                                                    ).format(
                                                        Number(item.price) || 0,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-700">
                                                    {item.capacity_count}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-700">
                                                    {item.toilet_count}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-700">
                                                    {item.area} m²
                                                </td>
                                                <td className="line-clamp-3 max-w-xs overflow-hidden px-6 py-4 text-sm text-ellipsis text-gray-700">
                                                    {item.description}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {item.building.name}
                                                </td>
                                                <td className="max-w-sm overflow-hidden px-6 py-4 text-sm text-ellipsis text-gray-700">
                                                    {item.building.address}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                                    {item.building.bmn_type}
                                                </td>

                                                <td
                                                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900`}
                                                >
                                                    <button
                                                        type="button"
                                                        // onClick={() => handleEdit(item)}
                                                        className={`inline-flex cursor-pointer items-center rounded-full font-medium transition hover:scale-110`}
                                                        title="Edit"
                                                    >
                                                        <MdEditDocument
                                                            color="blue"
                                                            size={20}
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        // onClick={() => openConfirm(item.id)}
                                                        // disabled={
                                                        //     deletingId ===
                                                        //     Number(item.id)
                                                        // }
                                                        className={`inline-flex cursor-pointer items-center rounded-full font-medium transition hover:scale-110 disabled:opacity-50`}
                                                        title="Hapus"
                                                    >
                                                        <IoMdTrash
                                                            color="red"
                                                            size={20}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={12}
                                                className="px-6 py-10 text-center text-base text-gray-500"
                                            >
                                                Belum ada data ruangan yang
                                                tersedia.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {data.total > data.per_page && (
                    <PaginationLinks
                        from={data.from}
                        links={data.links}
                        to={data.to}
                        total={data.total}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default index;
