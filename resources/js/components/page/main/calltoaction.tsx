import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const CallToAction = () => {
    return (
        <section className="mx-auto max-w-[1280px] px-4 py-20 lg:px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-[3rem] bg-[#1f9cd7] px-8 py-16 text-center text-white lg:py-24 shadow-2xl shadow-blue-500/20"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent" />
                <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl " />

                <div className="relative z-10 flex flex-col items-center">
                    <h2 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Siap Mewujudkan <span className="text-blue-200">Agenda Sukses</span> Anda?
                    </h2>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-50/90">
                        Ribuan instansi dan perorangan telah mempercayakan fasilitas kami.
                        Dapatkan penawaran terbaik sekarang juga.
                    </p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <Link
                            href="/register"
                            className="rounded-full bg-white px-10 py-4 text-sm font-bold text-[#1f9cd7] transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="/facilities"
                            className="rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
                        >
                            Lihat Fasilitas
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CallToAction;
