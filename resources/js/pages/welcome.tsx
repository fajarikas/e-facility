import { logout, dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen w-full bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] font-poppins">
                {/* WRAPPER */}
                <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

                    {/* HEADER */}
                    <header className="mb-6 lg:mb-12 text-sm lg:text-base">
                    <div className="flex items-center justify-between gap-3">
                        {/* KIRI: LOGO */}
                        <div className="flex items-center gap-2 shrink-0">
                        <img
                            src="/images/logo/bpmp.webp"
                            alt="Logo"
                            className="h-8 w-8 object-contain"
                        />
                        <span className="hidden lg:block text-[18px] font-bold">
                            BPMP BABEL
                        </span>
                        </div>

                        {/* KANAN: TOMBOL */}
                        <nav className="flex items-center gap-2 sm:gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="whitespace-nowrap rounded-full border border-[#19140035]
                                        px-3 py-1 text-xs sm:px-5 sm:py-1.5 sm:text-sm
                                        hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                            ) : (
                            <>
                                {canRegister && (
                                <Link
                                    href={register()}
                                    className="whitespace-nowrap rounded-full border border-[#222325]
                                            px-3 py-1 text-xs sm:px-5 sm:py-1.5 sm:text-sm font-semibold
                                            hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                                )}

                                <Link
                                href={login()}
                                className="whitespace-nowrap rounded-full border
                                            px-3 py-1 text-xs sm:px-5 sm:py-1.5 sm:text-sm font-semibold
                                            text-white bg-[#1f9cd7] hover:bg-[#1785b7]
                                            dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
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
                    <h1 className="text-[16px] font-bold dark:text-[#EDEDEC] lg:text-3xl text-center">
                        Cari Fasilitas Terbaik Pilihamnu
                    </h1>

                    <p className="text-[12px] text-[#7a7a7a] lg:text-sm text-center">
                        Platform Resmi dan Terpercaya untuk Penyewaan Fasilitas Instansi BPMP Provinsi Kepulauan Bangka Belitung
                    </p>

                    {/* GAMBAR + COPYRIGHT DI DALAM */}
                    <div className="relative w-full overflow-hidden rounded-2xl">
                        <img
                        src="/images/landingpage/contoh.webp"
                        alt="Illustration Welcome"
                        className="w-full h-auto"
                        />
                        <span className="absolute bottom-2 right-3 text-[10px] text-white/80">
                        © 2026 BPMP Provinsi Kepulauan Bangka Belitung
                        </span>
                    </div>
                        <form className="w-full">
                            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">

                                {/* Jenis Fasilitas */}
                                <div className="relative w-full lg:w-[170px]">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                        <svg
                                            className="h-4 w-4 text-blue-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 10.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8.5M12 3 3 10h18L12 3Z"
                                            />
                                        </svg>
                                    </div>
                                    <select className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
                                    <option>Jenis Fasilitas</option>
                                    <option>Ruang Rapat</option>
                                    <option>Aula</option>
                                    <option>Lab</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
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
                                    </div>
                                </div>

                                {/* Harga */}
                                <div className="relative w-full lg:w-[120px]">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <span className="text-blue-500 text-sm font-semibold">Rp</span>
                                    </div>
                                    <select className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
                                    <option>Harga</option>
                                    <option>&lt; 100k</option>
                                    <option>100k - 300k</option>
                                    <option>&gt; 300k</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
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
                                    </div>
                                </div>

                                {/* Kapasitas */}
                                <div className="relative w-full lg:w-[190px]">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4Z"/>
                                    </svg>
                                    </div>
                                    <select className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
                                    <option>Kapasitas</option>
                                    <option>1-10</option>
                                    <option>11-30</option>
                                    <option>31+</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
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
                                    </div>
                                </div>

                                {/* Lokasi */}
                                <div className="relative w-full lg:w-[190px]">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"/>
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                    </svg>
                                    </div>
                                    <select className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
                                    <option>Lokasi</option>
                                    <option>Pangkalpinang</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
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
                                    </div>
                                </div>

                                {/* Spacer khusus desktop */}
                                <div className="hidden lg:block lg:flex-1" />

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="h-10 w-full sm:col-span-2 lg:w-auto rounded-xl bg-[#1f9cd7] px-6 text-sm font-semibold text-white hover:bg-[#1785b7] active:bg-[#136d95] transition"
                                >
                                    Search
                                </button>
                                </div>
                            </div>
                            </form>
                        <div className="bg-white">
                            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-poppins">
                                Paling Diminati
                                </h2>

                                <a
                                href="#"
                                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                                >
                                See More
                                </a>
                            </div>

                            {/* Grid */}
                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Card 1 */}
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
                                        <p className="text-sm font-semibold text-gray-900">Aula Lama</p>
                                        <p className="text-xs font-semibold text-green-600">Tersedia</p>
                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">Gedung Depati Barin</p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-blue-600">
                                        Rp 2.200.000/hari
                                        </p>

                                        <button
                                        type="button"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200"
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
                                        <p className="text-sm font-semibold text-gray-900">Aula Baru</p>
                                        <p className="text-xs font-semibold text-green-600">Tersedia</p>
                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">Gedung Depati Barin</p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-blue-600">
                                        Rp 2.200.000/hari
                                        </p>

                                        <button
                                        type="button"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200"
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
                                        <p className="text-sm font-semibold text-gray-900">Asrama</p>
                                        <p className="text-xs font-semibold text-green-600">Tersedia</p>
                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">Asrama Pulau Lepar</p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-blue-600">
                                        Rp 250.000/malam
                                        </p>

                                        <button
                                        type="button"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200"
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
                                        <p className="text-sm font-semibold text-gray-900">Ruang Kelas</p>
                                        <p className="text-xs font-semibold text-green-600">Tersedia</p>
                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">Ruang Kelas 1</p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-blue-600">
                                        Rp 220.000/hari
                                        </p>

                                        <button
                                        type="button"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200"
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
