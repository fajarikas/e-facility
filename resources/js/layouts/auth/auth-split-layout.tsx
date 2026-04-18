import AppLogoIcon from '@/components/app-logo-icon';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid min-h-screen grid-cols-1 overflow-hidden font-poppins lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center bg-white p-8  lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f9cd7] p-2 shadow-lg shadow-blue-500/20">
                            <img src="/images/logo/bpmp.webp" alt="Logo" className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight ">BPMP BABEL</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">E-Facility Platform</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900  lg:text-4xl">
                            {title}
                        </h1>
                        <p className="text-base font-medium text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}

                    <div className="pt-8 text-center text-xs font-medium text-muted-foreground">
                        &copy; 2026 BPMP Provinsi Kepulauan Bangka Belitung.
                        <br />Seluruh hak cipta dilindungi.
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-[#1f9cd7] lg:block">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/40 via-transparent to-transparent" />
                
                <div className="flex h-full flex-col items-center justify-center p-12 text-white">
                    <div className="relative z-10 max-w-lg space-y-6 text-center">
                        <h2 className="text-4xl font-black leading-tight tracking-tight lg:text-5xl">
                            Solusi <span className="text-blue-200">Sewa Gedung</span> Terbaik & Terpercaya
                        </h2>
                        <p className="text-lg font-medium text-blue-50/90">
                            Nikmati kemudahan dalam mengelola dan memesan fasilitas premium BPMP Babel dalam satu platform yang terintegrasi.
                        </p>
                        
                        <div className="relative mt-12 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20">
                            <img
                                src="/images/login/preview.webp"
                                alt="Dashboard Preview"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-[-10%] right-[-10%] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute top-[-5%] left-[-5%] h-48 w-48 rounded-full bg-blue-300/20 blur-2xl" />
            </div>
        </div>
    );
}
