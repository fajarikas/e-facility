import ReasonCard from '@/components/card/reason-card';

export default function Reason() {
    return (
        <div className="">
            <div className="bg-reason w-full px-4 py-5 lg:px-0 lg:py-14">
                <div className="mx-auto w-full max-w-[1280px]">
                    <h2 className="text-center text-4xl font-bold text-white">
                        Mengapa Memilih Kami?
                    </h2>
                    <div className="mt-10 flex items-start justify-center space-x-5">
                        <ReasonCard
                            description="Transaksi sewa fasilitas BMN sesuai Peraturan Pemerintah dan tercatat sebagai Penerimaan Negara Bukan Pajak (PNBP) yang sah."
                            image="/images/icons/resmi.webp"
                            title="Resmi dan Legal"
                        />
                        <ReasonCard
                            description="Harga sewa dihitung berdasarkan regulasi resmi dan ditampilkan secara terbuka, tanpa biaya tersembunyi."
                            image="/images/icons/tarif.webp"
                            title="Tarif Transparan"
                        />
                        <ReasonCard
                            description="Pilihan Aula, Mess, dan Ruang Kelas yang terawat optimal, bersih, dan dilengkapi sarana penunjang modern (AC, Wi-Fi)."
                            image="/images/icons/terawat.webp"
                            title="Fasilitas Terawat"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
