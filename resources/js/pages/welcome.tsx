import AppLogo from '@/components/app-logo';
import { AppearanceToggle } from '@/components/appearance-toggle';
import InputField from '@/components/custom/input';
import FindYourBest from '@/components/page/main/find-your-best';
import Popular from '@/components/page/main/popular';
import Reason from '@/components/page/main/reason';
import CallToAction from '@/components/page/main/calltoaction';
import Footer from '@/components/page/footer/footer';
import { useAppearance } from '@/hooks/use-appearance';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Building } from '@/types/buildings';
import { RoomData } from '@/types/rooms';
import { Combobox } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { BsPeopleFill } from 'react-icons/bs';
import { FaRupiahSign } from 'react-icons/fa6';
import { SlCalender } from 'react-icons/sl';
import { TbBuildingSkyscraper } from 'react-icons/tb';

export default function Welcome({
    canRegister = true,
    buildings,
    rooms,
}: {
    canRegister?: boolean;
    buildings: Building[];
    rooms: RoomData[];
}) {
    const { auth } = usePage<SharedData>().props;
    const { appearance } = useAppearance();
    const [buildingQuery, setBuildingQuery] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
        null,
    );
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedCapacity, setSelectedCapacity] = useState<string | null>(
        null,
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const filteredBuildings = useMemo(() => {
        const query = buildingQuery.trim().toLowerCase();
        if (!query) return buildings;
        return buildings.filter((building) =>
            building.name.toLowerCase().includes(query),
        );
    }, [buildings, buildingQuery]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen w-full bg-[#F8FAFC] font-poppins text-[#1e293b]  ">
                <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white text-gray-900 backdrop-blur-md   ">
                    <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 lg:px-6">
                        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                            <AppLogo />
                        </Link>

                        <nav className="flex items-center gap-3 sm:gap-6">
                            <Link
                                href="/"
                                className="hidden text-sm font-black text-gray-600 transition-colors hover:text-[#1f9cd7] md:block"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/facilities"
                                className="hidden text-sm font-black text-gray-600 transition-colors hover:text-[#1f9cd7] md:block"
                            >
                                Fasilitas
                            </Link>

                            <div className="h-4 w-[1px] bg-gray-200 md:block" />

                            {auth.user ? (
                                <Link
                                    href={
                                        auth.user.role === 'user'
                                            ? '/facilities'
                                            : dashboard()
                                    }
                                    className="group relative flex items-center gap-2 rounded-full bg-[#1f9cd7] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#1785b7] hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                                >
                                    <span>
                                        {auth.user.role === 'user'
                                            ? 'Booking Sekarang'
                                            : 'Dashboard'}
                                    </span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full px-4 py-2 text-sm font-black text-gray-700 transition-colors hover:bg-gray-100  "
                                        >
                                            Daftar
                                        </Link>
                                    )}

                                    <Link
                                        href={login()}
                                        className="rounded-full bg-[#1f9cd7] px-5 py-2 text-sm font-black text-white shadow-md transition-all hover:bg-[#1785b7] hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="relative">
                    <div className="relative overflow-hidden pt-8 pb-20 lg:pt-12">
                        {/* Hero Background Decoration */}
                        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent " />

                        <FindYourBest />

                        <div className="mx-auto -mt-16 w-full max-w-[1100px] px-4">
                            <form className="relative z-10 overflow-hidden rounded-3xl border border-gray-100 bg-white text-gray-900 p-2 shadow-2xl backdrop-blur-2xl   ">
                                <div className="flex flex-col gap-2 p-2 lg:flex-row lg:items-center lg:gap-4">
                                    <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                        <Combobox
                                            by="id"
                                            value={selectedBuilding}
                                            onChange={(building) => {
                                                setSelectedBuilding(building);
                                                setBuildingQuery('');
                                            }}
                                            nullable
                                        >
                                            {({ open }) => (
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                                                        <TbBuildingSkyscraper className="h-5 w-5 text-blue-500" />
                                                    </div>

                                                    <Combobox.Input
                                                        className="h-14 w-full rounded-2xl border-none bg-white/50 pl-12 text-sm font-medium transition-all focus:bg-white focus:ring-2 focus:ring-blue-400  "
                                                        placeholder="Pilih Fasilitas"
                                                        displayValue={(
                                                            building: Building | null,
                                                        ) =>
                                                            building?.name ?? ''
                                                        }
                                                        onChange={(event) =>
                                                            setBuildingQuery(
                                                                event.target.value,
                                                            )
                                                        }
                                                    />

                                                    {open && (
                                                        <Combobox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-gray-100 bg-white py-2 text-sm shadow-xl focus:outline-none  ">
                                                            {filteredBuildings.length ===
                                                                0 &&
                                                            buildingQuery.trim() !==
                                                                '' ? (
                                                                <div className="px-4 py-3 text-gray-500">
                                                                    Tidak ada
                                                                    hasil.
                                                                </div>
                                                            ) : (
                                                                filteredBuildings.map(
                                                                    (
                                                                        item,
                                                                    ) => (
                                                                        <Combobox.Option
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item
                                                                            }
                                                                            className={({
                                                                                active,
                                                                            }) =>
                                                                                `cursor-pointer px-4 py-3 transition-colors ${
                                                                                    active
                                                                                        ? 'bg-blue-50 text-blue-600'
                                                                                        : 'text-gray-700'
                                                                                }`
                                                                            }
                                                                        >
                                                                            {item.name}
                                                                        </Combobox.Option>
                                                                    ),
                                                                )
                                                            )}
                                                        </Combobox.Options>
                                                    )}
                                                </div>
                                            )}
                                        </Combobox>

                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                                                <FaRupiahSign className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <InputField
                                                className="h-14 w-full rounded-2xl border-none bg-white/50 pl-12 text-sm font-medium transition-all focus:bg-white focus:ring-2 focus:ring-blue-400  "
                                                onChange={(e) =>
                                                    setSelectedPrice(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Budget"
                                                type="text"
                                                value={selectedPrice ?? ''}
                                            />
                                        </div>

                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                                                <BsPeopleFill className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <InputField
                                                className="h-14 w-full rounded-2xl border-none bg-white/50 pl-12 text-sm font-medium transition-all focus:bg-white focus:ring-2 focus:ring-blue-400  "
                                                onChange={(e) =>
                                                    setSelectedCapacity(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Kapasitas"
                                                type="number"
                                                value={selectedCapacity ?? ''}
                                            />
                                        </div>

                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                                                <SlCalender className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <InputField
                                                className="h-14 w-full rounded-2xl border-none bg-white/50 pl-12 text-sm font-medium transition-all focus:bg-white focus:ring-2 focus:ring-blue-400  "
                                                onChange={(e) =>
                                                    setSelectedDate(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tanggal"
                                                type="date"
                                                value={selectedDate ?? ''}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="h-14 rounded-2xl bg-[#1f9cd7] px-8 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-[#1785b7] hover:shadow-blue-500/40 active:scale-95 lg:w-auto"
                                    >
                                        Cari Sekarang
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-20 pb-20">
                        <Popular rooms={rooms} />
                        <Reason />
                        <CallToAction />
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
