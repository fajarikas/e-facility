import { Button } from "@/components/button/button";
import { ButtonHub } from "@/components/button/button";
import React from "react";

type Props = {};

const CallToAction = (props: Props) => {
  return (
    <div className="w-full bg-calltoaction px-4 py-8 lg:py-14">
      <div className="mx-auto max-w-11/12 flex flex-col lg:flex-row items-center justify-between gap-10">

        <div className="flex flex-col space-y-3 lg:space-y-4 max-w-[500px]">
          <h1 className="text-2xl font-bold text-black lg:text-4xl">
            Siap Menyewa Fasilitas Instansi Kami?
          </h1>

          <p className="text-sm text-black font-normal lg:text-base">
            Mulai cari dan pesan fasilitas BMN Anda hari ini. Proses transparan,
            legal, dan tanpa ribet birokrasi.
          </p>

          <div className="flex flex-col gap-2 mt-2">
            <Button
              name="Cek Ketersediaan & Pesan Sekarang"
              onClick={() => console.log("Pesan clicked")}
            />
            <ButtonHub
              name="Hubungi Kami (Untuk Info Lebih Lanjut)"
              onClick={() => console.log("Hubungi clicked")}
              image={['/images/icons/whatsapp.svg']}
            />
          </div>
        </div>

        <div className="hidden lg:block w-full lg:w-[420px] calltoaction-img">
          <img
            src="/images/landingpage/calltoact.webp" 
            alt="Call to Action Image"
            className="w-full h-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default CallToAction;
