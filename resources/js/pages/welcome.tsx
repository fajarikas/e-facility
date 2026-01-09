import InputField from '@/components/custom/input';
import FindYourBest from '@/components/page/main/find-your-best';
import Popular from '@/components/page/main/popular';
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
    const [buildingQuery, setBuildingQuery] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
        null,
    );
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedCapacity, setSelectedCapacity] = useState<string | null>(
        null,
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    console.log(selectedCapacity);

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
                <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <header className="mb-6 text-sm lg:mb-12 lg:text-base">
                        <div className="flex items-center justify-between gap-3">
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
                        <FindYourBest />
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
                            <Popular rooms={rooms} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
