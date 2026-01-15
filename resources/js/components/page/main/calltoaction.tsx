import { Button, ButtonHub } from '@/components/button/button';

type Props = {};

const CallToAction = (props: Props) => {
    return (
        <div className="bg-calltoaction w-full px-4 py-8 lg:py-14">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 lg:flex-row">
                <div className="flex max-w-[500px] flex-col space-y-3 lg:space-y-4">
                    <h1 className="text-2xl font-bold text-black lg:text-4xl">
                        Siap Menyewa Fasilitas Instansi Kami?
                    </h1>

                    <p className="text-sm font-normal text-black lg:text-base">
                        Mulai cari dan pesan fasilitas BMN Anda hari ini. Proses
                        transparan, legal, dan tanpa ribet birokrasi.
                    </p>

                    <div className="mt-2 flex flex-col gap-2">
                        <Button
                            name="Cek Ketersediaan & Pesan Sekarang"
                            onClick={() => console.log('Pesan clicked')}
                        />
                        <ButtonHub
                            name="Hubungi Kami (Untuk Info Lebih Lanjut)"
                            onClick={() => console.log('Hubungi clicked')}
                            image={['/images/icons/whatsapp.svg']}
                        />
                    </div>
                </div>

                <div className="calltoaction-img hidden w-full lg:block lg:w-[420px]">
                    <img
                        src="/images/landingpage/calltoact.webp"
                        alt="Call to Action Image"
                        className="h-auto w-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default CallToAction;
