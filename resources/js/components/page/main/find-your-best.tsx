type Props = {};

const FindYourBest = (props: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 lg:gap-6">
            <h1 className="text-center text-[16px] font-bold lg:text-3xl dark:text-[#EDEDEC]">
                Cari Fasilitas Terbaik Pilihamnu
            </h1>

            <p className="text-center text-[12px] text-[#7a7a7a] lg:text-sm">
                Platform Resmi dan Terpercaya untuk Penyewaan Fasilitas Instansi
                BPMP Provinsi Kepulauan Bangka Belitung
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
        </div>
    );
};

export default FindYourBest;
