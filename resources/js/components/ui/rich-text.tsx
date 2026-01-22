import { sanitizeHtml } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type Props = {
    html: string;
    className?: string;
};

export function RichText({ html, className }: Props) {
    const safeHtml = useMemo(() => sanitizeHtml(html), [html]);

    return (
        <div
            className={cn(
                'prose prose-sm max-w-none text-gray-700',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
}

