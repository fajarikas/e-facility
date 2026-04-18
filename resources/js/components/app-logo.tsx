export default function AppLogo({ className }: { className?: string }) {
    return (
        <div className="flex items-center gap-2 group">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-white p-1.5 shadow-md ring-1 ring-gray-100 transition-transform group-hover:scale-105  ">
                <img src="/images/logo/bpmp.webp" width={28} height={28} className="object-contain" alt="BPMP Logo" />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-slate-900 ">
                    BPMP <span className="text-[#1f9cd7]">BABEL</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    E-Facility
                </span>
            </div>
        </div>
    );
}
