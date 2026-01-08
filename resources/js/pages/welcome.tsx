import { dashboard, login, logout, register } from '@/routes';
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
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a] font-poppins">
                <header className="mb-6 w-full max-w-hidden text-sm not-has-[nav]:hidden md:max-w-[1280px] lg:mb-12 lg:text-base">
                    <div className="flex items-center justify-between">

                        {/* KIRI: LOGO */}
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/logo/bpmp.webp"
                                alt="Logo"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="hidden lg:flex text-base font-bold text-[18px]">
                                BPMP BABEL
                            </span>
                        </div>

                        {/* KANAN: TOMBOL */}
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-full border border-[#19140035] px-5 py-1.5 text-m leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-full border border-[#222325] px-5 py-1.5 text-m font-semibold leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>

                                    {canRegister && (
                                        <Link
                                            href={login()}
                                            className="rounded-full border px-5 py-1.5 text-m font-semibold leading-normal text-white bg-[#1f9cd7] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Login
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>

                    </div>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className=" w-full max-w-11/12 lg:max-w-[1280px] margin-auto flex flex-col gap-4 lg:gap-6">
                        
                        <h1 className="text-[16px] font-bold text-[#1b1b18] dark:text-[#EDEDEC] lg:text-3xl text-center w-full">
                            Cari Fasilitas Terbaik Pilihamnu
                        </h1>
                        <p className="text-[12px] text-[#7a7a7a] dark:text-[#7a7a7a] lg:text-m text-center w-full">
                            Platform Resmi dan Terpercaya untuk Penyewaan Fasilitas Instansi BPMP Provinsi Kepulauan Bangka Belitung 
                        </p>
                      <div className="relative w-full flex justify-center">
                            <div className="relative w-full max-w-[1200px]">
                                <img
                                    src="/images/landingpage/contoh.webp"
                                    alt="Illustration Welcome"
                                    className="w-full h-auto mt-4 lg:mt-8"
                                />

                                <span className="absolute bottom-2 right-4 text-[10px] text-white/80">
                                    © 2026 BPMP Provinsi Kepulauan Bangka Belitung
                                </span>
                            </div>
                        </div>

                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
