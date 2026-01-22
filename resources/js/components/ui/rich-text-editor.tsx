import { sanitizeHtml } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef } from 'react';

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tulis deskripsi...',
    className,
}: Props) {
    const editorRef = useRef<HTMLDivElement>(null);

    const sanitizedValue = useMemo(() => sanitizeHtml(value), [value]);

    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        if (el.innerHTML !== sanitizedValue) {
            el.innerHTML = sanitizedValue || '';
        }
    }, [sanitizedValue]);

    const exec = (command: string, commandValue?: string) => {
        if (typeof document === 'undefined') return;
        document.execCommand(command, false, commandValue);
        const html = editorRef.current?.innerHTML ?? '';
        onChange(sanitizeHtml(html));
    };

    const onInput = () => {
        const html = editorRef.current?.innerHTML ?? '';
        onChange(sanitizeHtml(html));
    };

    const setBlock = (tag: 'p' | 'h2' | 'h3' | 'blockquote') => {
        exec('formatBlock', tag);
    };

    const addLink = () => {
        const url = window.prompt('Masukkan link (https://...)');
        if (!url) return;
        exec('createLink', url);
    };

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2">
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => exec('bold')}
                >
                    Bold
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => exec('italic')}
                >
                    Italic
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => exec('underline')}
                >
                    Underline
                </button>
                <span className="mx-1 h-6 w-px bg-gray-200" />
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => exec('insertUnorderedList')}
                >
                    Bullets
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => exec('insertOrderedList')}
                >
                    Numbered
                </button>
                <span className="mx-1 h-6 w-px bg-gray-200" />
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => setBlock('p')}
                >
                    P
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => setBlock('h2')}
                >
                    H2
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => setBlock('h3')}
                >
                    H3
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => setBlock('blockquote')}
                >
                    Quote
                </button>
                <span className="mx-1 h-6 w-px bg-gray-200" />
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={addLink}
                >
                    Link
                </button>
                <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => exec('removeFormat')}
                >
                    Clear
                </button>
            </div>

            <div
                ref={editorRef}
                role="textbox"
                contentEditable
                onInput={onInput}
                data-placeholder={placeholder}
                className={cn(
                    'min-h-28 rounded-lg border border-gray-400 bg-white px-3 py-2 text-sm focus:outline-blue-500',
                    'empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]',
                )}
            />
        </div>
    );
}

