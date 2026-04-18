import { motion } from 'framer-motion';

const FindYourBest = () => {
    return (
        <section className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 pt-4 pb-24 lg:px-6 lg:pt-8 lg:pb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase  ">
                    Solusi Penyewaan Fasilitas Terpercaya
                </span>
                <h1 className="mb-6 max-w-4xl text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl ">
                    Temukan <span className="text-[#1f9cd7]">Fasilitas Terbaik</span> Untuk Agenda Anda
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg ">
                    Platform resmi penyewaan gedung dan fasilitas BPMP Provinsi Kepulauan Bangka Belitung.
                    Proses mudah, transparan, dan terpercaya untuk kebutuhan instansi maupun personal.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
            >
                <div className="aspect-[21/9] w-full">
                    <img
                        src="/images/landingpage/contoh.webp"
                        alt="BPMP Babel Facilities"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between lg:bottom-10 lg:left-10 lg:right-10">
                    <div className="flex items-center gap-4 text-white">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-lg">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">1,000+ Pengguna</span>
                            <span className="text-[10px] opacity-80 uppercase tracking-widest">Telah menyewa fasilitas kami</span>
                        </div>
                    </div>
                    <span className="hidden text-xs font-medium text-white/70 sm:block">
                        © 2026 BPMP Provinsi Kepulauan Bangka Belitung
                    </span>
                </div>
            </motion.div>
        </section>
    );
};

export default FindYourBest;
