import { BiLogoGmail } from 'react-icons/bi';
import { FaPhone } from 'react-icons/fa6';
import { SiOrganicmaps } from 'react-icons/si';
type Props = {};

export const Footer = (props: Props) => {
    return (
        <div className="mx-auto my-10 w-11/12 max-w-7xl">
            <div className="bg-footer w-full rounded-3xl px-4 py-5 text-white lg:px-0 lg:py-10">
                <div className="px-10">
                    <div className="flex items-start justify-between">
                        <div className="flex w-4/6 flex-col">
                            <h3 className="text-3xl font-extrabold">
                                Hubungi kami
                            </h3>
                            <div className="mt-3">
                                <div className="flex items-center space-x-3">
                                    <FaPhone size={13} color="white" />
                                    <p className="font-medium">
                                        +628 1171176160
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <BiLogoGmail size={13} color="white" />
                                    <p className="font-medium">
                                        bpmp.babel@kemdikbud.go.id
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <SiOrganicmaps size={13} color="white" />
                                    <p className="font-medium">
                                        Jl. Pulau Bangka, Padang Baru, Kec.
                                        Bukitintan, Kabupaten Bangka Tengah,
                                        Kepulauan Bangka Belitung 33684
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-2/6 flex-col">
                            <h3 className="text-right text-3xl font-extrabold">
                                Unit Layanan Terpadu
                            </h3>
                            <div className="mt-3">
                                <p className="text-right font-medium text-white">
                                    Jam Layanan
                                </p>
                                <p className="text-right font-medium text-white">
                                    08.00 - 16.00 WIB
                                </p>
                                <div className="mt-4">
                                    <p className="text-right font-bold text-white">
                                        Follow Sosial Media Kami
                                    </p>
                                    <div className="mt-1 flex items-center justify-end space-x-1">
                                        <img
                                            className="w-7"
                                            src="/images/icons/fb.png"
                                        />
                                        <img
                                            className="w-7"
                                            src="/images/icons/ig.png"
                                        />
                                        <img
                                            className="w-7"
                                            src="/images/icons/x.png"
                                        />
                                        <img
                                            className="w-7"
                                            src="/images/icons/yt.png"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 border-t-2 border-t-white">
                    <div className="flex w-full items-end justify-between px-10">
                        <div className="">
                            <p className="mt-4 text-3xl font-extrabold text-white">
                                BPMP BABEL
                            </p>
                            <p className="mt-1">
                                © 2025 BPMP Provinsi Kepulauan Bangka Belitung
                            </p>
                        </div>
                        <p className="mt-1 font-semibold">
                            Pangkal Pinang, Kepulauan Bangka Belitung
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
