import { Link } from '@inertiajs/react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';
import { MdLocationOn } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="border-t border-gray-100 bg-white pt-20 pb-10  ">
            <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo/bpmp.webp" alt="Logo" className="h-10 w-10 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight ">BPMP BABEL</span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">E-Facility Platform</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 ">
                            Penyedia layanan penyewaan fasilitas terbaik di Bangka Belitung. Berkomitmen memberikan kemudahan bagi instansi dan publik.
                        </p>
                        <div className="flex items-center gap-4">
                            {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-[#1f9cd7] hover:text-white  ">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-1">
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-900 ">Navigasi</h4>
                        <ul className="flex flex-col gap-4">
                            {['Beranda', 'Cari Fasilitas', 'Tentang Kami', 'Syarat & Ketentuan', 'Kebijakan Privasi'].map((item, i) => (
                                <li key={i}>
                                    <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-[#1f9cd7] ">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-900 ">Kontak Kami</h4>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ">
                                    <MdLocationOn className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-900 ">Alamat</span>
                                    <span className="text-sm leading-relaxed text-gray-600 ">
                                        Kompleks Perkantoran Pemerintah Provinsi Kep. Bangka Belitung, Pangkalpinang.
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ">
                                    <HiPhone className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-900 ">Telepon</span>
                                    <span className="text-sm text-gray-600 ">(0717) 439240</span>
                                </div>
                            </div>
                            <div className="flex gap-4 sm:col-span-2">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ">
                                    <HiMail className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-900 ">Email Resmi</span>
                                    <span className="text-sm text-gray-600 ">bpmp.babel@kemdikbud.go.id</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 border-t border-gray-100 pt-10 text-center ">
                    <p className="text-xs text-gray-500 ">
                        &copy; 2026 BPMP Provinsi Kepulauan Bangka Belitung. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
