import { Button } from '@/components/ui/button';
import PaginationLinks from '@/components/ui/pagination-link';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedUserData, UserData } from '@/types/users';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen User',
        href: '/admin/users',
    },
];

type Props = {
    data: PaginatedUserData;
};

const UserManagementIndex = ({ data }: Props) => {
    const userData = data.data;
    const [savingId, setSavingId] = useState<number | null>(null);
    const [roleDrafts, setRoleDrafts] = useState<Record<number, UserData['role']>>(
        () =>
            userData.reduce((acc, user) => {
                acc[user.id] = user.role;
                return acc;
            }, {} as Record<number, UserData['role']>),
    );

    const handleRoleChange = (id: number, role: UserData['role']) => {
        setRoleDrafts((prev) => ({
            ...prev,
            [id]: role,
        }));
    };

    const handleSave = (user: UserData) => {
        const role = roleDrafts[user.id];
        if (!role || role === user.role) return;

        setSavingId(user.id);
        router.put(
            `/admin/users/${user.id}/role`,
            { role },
            {
                preserveState: true,
                onFinish: () => setSavingId(null),
                onSuccess: () => {
                    Toastify({
                        text: 'Role berhasil diperbarui',
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: 'top',
                        position: 'left',
                        stopOnFocus: true,
                        style: {
                            background: '#007E6E',
                        },
                    }).showToast();
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manajemen User
                    </h1>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                            Role
                                        </th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {userData.length > 0 ? (
                                        userData.map((user) => {
                                            const currentRole =
                                                roleDrafts[user.id] || user.role;
                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="transition duration-150 ease-in-out hover:bg-blue-50/50"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <select
                                                            value={currentRole}
                                                            onChange={(e) =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    e.target
                                                                        .value as UserData['role'],
                                                                )
                                                            }
                                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="superadmin">
                                                                Super Admin
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            onClick={() =>
                                                                handleSave(user)
                                                            }
                                                            disabled={
                                                                savingId ===
                                                                    user.id ||
                                                                currentRole ===
                                                                    user.role
                                                            }
                                                        >
                                                            {savingId === user.id
                                                                ? 'Menyimpan...'
                                                                : 'Simpan'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-10 text-center text-base text-gray-500"
                                            >
                                                Belum ada user.
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

export default UserManagementIndex;
