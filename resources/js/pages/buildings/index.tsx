import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { buildings } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/paginaton';
import { Head, router } from '@inertiajs/react';

type Props = {};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bangunan',
        href: buildings().url,
    },
];

const getBMNType = (name: string) => {
    let bmnClass: string;
    switch (name) {
        case 'Type A':
            bmnClass = 'bg-green-200 text-green-800';
            break;
        case 'Type B':
            bmnClass = 'bg-blue-200 text-blue-800';
            break;
        case 'Type C':
            bmnClass = 'bg-yellow-200 text-yellow-800';
            break;
        default:
            bmnClass = 'bg-gray-200 text-gray-800';
    }
    return bmnClass;
};
const Buildings = ({ data }: { data: PaginatedData }) => {
    const buildingData = data.data;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bangunan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-xl font-bold">Daftar Tipe Bangunan</h1>
                    <Button onClick={() => router.get('buildings/create')}>
                        Tambah
                    </Button>
                </div>
                <div className="rounded-md border bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Nama Bangunan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Alamat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Jenis BMN
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {buildingData.length > 0 ? (
                                buildingData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                            {item.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                            {item.address}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900`}
                                        >
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${getBMNType(item.bmn_type)}`}
                                            >
                                                {item.bmn_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        Belum ada data bangunan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {data.total > data.per_page && (
                        <PaginationLinks
                            from={data.from}
                            links={data.links}
                            to={data.to}
                            total={data.total}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Buildings;
