import { router } from '@inertiajs/react';
import React from 'react';

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
        if (label.includes('Previous')) return '« Previous';
        if (label.includes('Next')) return 'Next »';
        return label;
    };

    const processedLinks = links; 

    return (
        <div className="py-4 flex flex-col justify-center w-full items-center">
            <div className="mb-2 text-sm text-gray-600">Menampilkan {from} &ndash; {to} dari {total}</div>

            <div className="flex flex-wrap gap-1">
                {processedLinks.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        className={`
                            px-3 py-1 text-sm rounded-md border cursor-pointer  
                            ${link.active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }
                            ${!link.url && 'opacity-50 cursor-not-allowed'}
                        `}
                            dangerouslySetInnerHTML={{ __html: formatLinkLabel(link.label) }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaginationLinks;