import InputField from '@/components/custom/input';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Building } from '@/types/buildings';
import { Combobox } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { FaRupiahSign } from 'react-icons/fa6';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { BsPeopleFill } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";

export default function Welcome({
    canRegister = true,
    buildings,
}: {
    canRegister?: boolean;
    buildings: Building[];
}) {
    const { auth } = usePage<SharedData>().props;
    const [buildingQuery, setBuildingQuery] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
        null,
    );
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedCapacity, setSelectedCapacity] = useState<string | null>(
        null,
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    console.log('🚀 ~ Welcome ~ selectedDate:', selectedDate);
    console.log(selectedCapacity)

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
            <div className="min-h-screen w-full bg-[#FDFDFC] font-poppins text-[#1b1b18] dark:bg-[#0a0a0a]">
                {/* WRAPPER */}
                <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {/* HEADER */}
                    <header className="mb-6 text-sm lg:mb-12 lg:text-base">
                        <div className="flex items-center justify-between gap-3">
                            {/* KIRI: LOGO */}
                            <div className="flex shrink-0 items-center gap-2">
                                <img
                                    src="/images/logo/bpmp.webp"
                                    alt="Logo"
                                    className="h-8 w-8 object-contain"
                                />
                                <span className="hidden text-[18px] font-bold lg:block">
                                    BPMP BABEL
                                </span>
                            </div>

                            {/* KANAN: TOMBOL */}
                            <nav className="flex items-center gap-2 sm:gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full border border-[#19140035] px-3 py-1 text-xs whitespace-nowrap hover:border-[#1915014a] sm:px-5 sm:py-1.5 sm:text-sm dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-full border border-[#222325] px-3 py-1 text-xs font-semibold whitespace-nowrap hover:border-[#1915014a] sm:px-5 sm:py-1.5 sm:text-sm dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                            >
                                                Register
                                            </Link>
                                        )}

                                        <Link
                                            href={login()}
                                            className="rounded-full border bg-[#1f9cd7] px-3 py-1 text-xs font-semibold whitespace-nowrap text-white hover:bg-[#1785b7] sm:px-5 sm:py-1.5 sm:text-sm dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </header>

                    {/* MAIN */}
                    <main className="flex flex-col gap-4 lg:gap-6">
                        <h1 className="text-center text-[16px] font-bold lg:text-3xl dark:text-[#EDEDEC]">
                            Cari Fasilitas Terbaik Pilihamnu
                        </h1>

                        <p className="text-center text-[12px] text-[#7a7a7a] lg:text-sm">
                            Platform Resmi dan Terpercaya untuk Penyewaan
                            Fasilitas Instansi BPMP Provinsi Kepulauan Bangka
                            Belitung
                        </p>

                        <div className="relative w-full overflow-hidden rounded-2xl">
                            <img
                                src="/images/landingpage/contoh.webp"
                                alt="Illustration Welcome"
                                className="h-auto w-full"
                            />
                            <span className="absolute right-3 bottom-2 text-[10px] text-white/80">
                                © 2026 BPMP Provinsi Kepulauan Bangka Belitung
                            </span>
                        </div>
                        <form className="w-full">
                            <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-3">
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
                                            <div className="relative w-full">
                                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                    <TbBuildingSkyscraper className="h-4 w-4 text-blue-500" />
                                                </div>

                                                <Combobox.Input
                                                    className="h-10 w-full rounded-xl border border-gray-200 bg-white pr-9 pl-9 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
                                                    placeholder="Jenis Fasilitas"
                                                    displayValue={(
                                                        building: Building | null,
                                                    ) => building?.name ?? ''}
                                                    onChange={(event) =>
                                                        setBuildingQuery(
                                                            event.target.value,
                                                        )
                                                    }
                                                />

                                                <Combobox.Button className="absolute inset-y-0 right-3 flex items-center">
                                                    <svg
                                                        className="h-4 w-4 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 011.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0l-4.25-4.53a.75.75 0 01.02-1.06z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </Combobox.Button>

                                                <input
                                                    type="hidden"
                                                    name="building_id"
                                                    value={
                                                        selectedBuilding?.id ??
                                                        ''
                                                    }
                                                />

                                                {open && (
                                                    <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg focus:outline-none">
                                                        {filteredBuildings.length ===
                                                            0 &&
                                                        buildingQuery.trim() !==
                                                            '' ? (
                                                            <div className="px-3 py-2 text-gray-500">
                                                                Tidak ada hasil.
                                                            </div>
                                                        ) : (
                                                            filteredBuildings.map(
                                                                (item) => (
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
                                                                            `cursor-pointer px-3 py-2 select-none ${
                                                                                active
                                                                                    ? 'bg-blue-50 text-blue-700'
                                                                                    : 'text-gray-700'
                                                                            }`
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                        }) => (
                                                                            <span
                                                                                className={`block truncate ${
                                                                                    selected
                                                                                        ? 'font-semibold'
                                                                                        : 'font-normal'
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </Combobox.Option>
                                                                ),
                                                            )
                                                        )}
                                                    </Combobox.Options>
                                                )}
                                            </div>
                                        )}
                                    </Combobox>

                                    <InputField
                                        icon={
                                            <FaRupiahSign className="h-4 w-4 text-blue-500" />
                                        }
                                        onChange={(e) =>
                                            setSelectedPrice(e.target.value)
                                        }
                                        placeholder="Harga"
                                        type="text"
                                        value={selectedPrice ?? ''}
                                    />

                                    <InputField
                                        icon={
                                            <BsPeopleFill className="h-4 w-4 text-blue-500" />
                                        }
                                        onChange={(e) =>
                                            setSelectedCapacity(e.target.value)
                                        }
                                        placeholder="Kapasitas"
                                        type="number"
                                        value={selectedCapacity ?? ''}
                                    />
                                     <InputField
                                        icon={
                                            <SlCalender className="h-4 w-4 text-blue-500" />
                                        }
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                        placeholder="Tanggal"
                                        type="date"
                                        value={selectedDate ?? ''}
                                    />
                                    

                                    <div className="hidden lg:block lg:flex-1" />

                                    <button
                                        type="submit"
                                        className="h-10 w-full rounded-xl bg-[#1f9cd7] px-6 text-sm font-semibold text-white transition hover:bg-[#1785b7] active:bg-[#136d95] sm:col-span-2 lg:w-auto"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="bg-white">
                            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

                                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <div className="p-3">
                                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=80"
                                                    alt="Aula Lama"
                                                    className="h-44 w-full object-cover"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Aula Lama
                                                    </p>
                                                    <p className="text-xs font-semibold text-green-600">
                                                        Tersedia
                                                    </p>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Gedung Depati Barin
                                                </p>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-blue-600">
                                                        Rp 2.200.000/hari
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600"
                                                        aria-label="Favorit"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-5 w-5"
                                                        >
                                                            <path d="M20.8 4.6c-1.6-1.7-4.3-1.7-5.9 0L12 7.5 9.1 4.6c-1.6-1.7-4.3-1.7-5.9 0-1.8 1.9-1.8 4.9 0 6.8l2.9 3 5.9 6.1 5.9-6.1 2.9-3c1.8-1.9 1.8-4.9 0-6.8z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <div className="p-3">
                                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80"
                                                    alt="Aula Baru"
                                                    className="h-44 w-full object-cover"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Aula Baru
                                                    </p>
                                                    <p className="text-xs font-semibold text-green-600">
                                                        Tersedia
                                                    </p>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Gedung Depati Barin
                                                </p>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-blue-600">
                                                        Rp 2.200.000/hari
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600"
                                                        aria-label="Favorit"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-5 w-5"
                                                        >
                                                            <path d="M20.8 4.6c-1.6-1.7-4.3-1.7-5.9 0L12 7.5 9.1 4.6c-1.6-1.7-4.3-1.7-5.9 0-1.8 1.9-1.8 4.9 0 6.8l2.9 3 5.9 6.1 5.9-6.1 2.9-3c1.8-1.9 1.8-4.9 0-6.8z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <div className="p-3">
                                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                                                    alt="Asrama"
                                                    className="h-44 w-full object-cover"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Asrama
                                                    </p>
                                                    <p className="text-xs font-semibold text-green-600">
                                                        Tersedia
                                                    </p>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Asrama Pulau Lepar
                                                </p>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-blue-600">
                                                        Rp 250.000/malam
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600"
                                                        aria-label="Favorit"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-5 w-5"
                                                        >
                                                            <path d="M20.8 4.6c-1.6-1.7-4.3-1.7-5.9 0L12 7.5 9.1 4.6c-1.6-1.7-4.3-1.7-5.9 0-1.8 1.9-1.8 4.9 0 6.8l2.9 3 5.9 6.1 5.9-6.1 2.9-3c1.8-1.9 1.8-4.9 0-6.8z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 4 */}
                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <div className="p-3">
                                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                                                    alt="Ruang Kelas"
                                                    className="h-44 w-full object-cover"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Ruang Kelas
                                                    </p>
                                                    <p className="text-xs font-semibold text-green-600">
                                                        Tersedia
                                                    </p>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Ruang Kelas 1
                                                </p>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-blue-600">
                                                        Rp 220.000/hari
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600"
                                                        aria-label="Favorit"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-5 w-5"
                                                        >
                                                            <path d="M20.8 4.6c-1.6-1.7-4.3-1.7-5.9 0L12 7.5 9.1 4.6c-1.6-1.7-4.3-1.7-5.9 0-1.8 1.9-1.8 4.9 0 6.8l2.9 3 5.9 6.1 5.9-6.1 2.9-3c1.8-1.9 1.8-4.9 0-6.8z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
