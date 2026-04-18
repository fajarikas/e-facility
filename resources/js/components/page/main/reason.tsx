import { motion } from 'framer-motion';
import { FaCheckCircle, FaHandshake, FaShieldAlt, FaStar } from 'react-icons/fa';

const Reason = () => {
    const reasons = [
        {
            icon: <FaShieldAlt className="h-8 w-8 text-blue-500" />,
            title: 'Resmi & Terpercaya',
            description: 'Platform resmi BPMP Provinsi Kepulauan Bangka Belitung dengan jaminan transparansi penuh.',
        },
        {
            icon: <FaHandshake className="h-8 w-8 text-blue-500" />,
            title: 'Proses Mudah',
            description: 'Sistem booking online yang ringkas, mulai dari pengecekan jadwal hingga pembayaran.',
        },
        {
            icon: <FaStar className="h-8 w-8 text-blue-500" />,
            title: 'Fasilitas Premium',
            description: 'Gedung dan ruangan dengan standar kualitas tinggi untuk menunjang kesuksesan agenda Anda.',
        },
        {
            icon: <FaCheckCircle className="h-8 w-8 text-blue-500" />,
            title: 'Pelayanan Cepat',
            description: 'Tim support kami siap membantu kebutuhan penyewaan Anda dengan respon yang cepat.',
        },
    ];

    return (
        <section className="bg-[#f9fafb] py-24 ">
            <div className="mx-auto max-w-[1280px] px-4 lg:px-6 text-left">
                <div className="mb-16 text-left md:text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl ">
                        Mengapa Memilih <span className="text-[#1f9cd7]">E-Facility BPMP?</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-600 ">
                        Kami memberikan pengalaman penyewaan fasilitas terbaik dengan mengutamakan kemudahan dan kepuasan pelanggan.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative rounded-[2rem] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl  ring-1 ring-gray-100 "
                        >
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-[#1f9cd7]  group-hover:">
                                <div className="transition-colors group-hover:text-white">
                                    {item.icon}
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900 ">
                                {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600 ">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reason;
