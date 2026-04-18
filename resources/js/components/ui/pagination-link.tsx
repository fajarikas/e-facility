import { router } from '@inertiajs/react';
import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationLinksProps {
    links: PaginationLink[];
    from: number;
    to: number;
    total: number;
}

const PaginationLinks: React.FC<PaginationLinksProps> = ({ links, from, to, total }) => {
    
    const formatLinkLabel = (label: string) => {
        if (label.includes('Previous')) return '« Prev';
        if (label.includes('Next')) return 'Next »';
        return label;
    };

    return (
        <div className="py-6 flex flex-col items-center justify-center w-full gap-4">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 ">
                Menampilkan <span className="text-[#1f9cd7]">{from}</span> – <span className="text-[#1f9cd7]">{to}</span> dari <span className="text-[#1f9cd7]">{total}</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        className={cn(
                            "min-w-[2.5rem] h-10 px-3 flex items-center justify-center rounded-xl border text-sm font-black transition-all active:scale-90",
                            link.active
                                ? "bg-[#1f9cd7] border-[#1f9cd7] text-white shadow-lg shadow-blue-500/20"
                                : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50     ",
                            !link.url && "opacity-40 cursor-not-allowed grayscale"
                        )}
                        dangerouslySetInnerHTML={{ __html: formatLinkLabel(link.label) }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaginationLinks;
