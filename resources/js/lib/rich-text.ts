export function sanitizeHtml(input: string): string {
    if (!input) return '';
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
        return input;
    }

    const doc = new DOMParser().parseFromString(input, 'text/html');

    const allowedTags = new Set([
        'P',
        'BR',
        'STRONG',
        'B',
        'EM',
        'I',
        'U',
        'UL',
        'OL',
        'LI',
        'A',
        'H1',
        'H2',
        'H3',
        'H4',
        'BLOCKQUOTE',
    ]);

    const allowedAttrsByTag: Record<string, Set<string>> = {
        A: new Set(['href', 'target', 'rel']),
    };

    const isSafeHref = (href: string) => {
        const trimmed = href.trim();
        return (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('mailto:') ||
            trimmed.startsWith('tel:') ||
            trimmed.startsWith('#')
        );
    };

    const unwrap = (el: Element) => {
        const parent = el.parentNode;
        if (!parent) return;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
    };

    const walk = (root: ParentNode) => {
        const elements = Array.from(root.querySelectorAll('*'));
        for (const el of elements) {
            const tag = el.tagName.toUpperCase();

            if (!allowedTags.has(tag)) {
                unwrap(el);
                continue;
            }

            for (const attr of Array.from(el.attributes)) {
                const name = attr.name.toLowerCase();
                const allowed =
                    allowedAttrsByTag[tag]?.has(attr.name) ?? false;

                if (name.startsWith('on') || name === 'style') {
                    el.removeAttribute(attr.name);
                    continue;
                }

                if (!allowed) {
                    el.removeAttribute(attr.name);
                }
            }

            if (tag === 'A') {
                const href = el.getAttribute('href') || '';
                if (!href || !isSafeHref(href)) {
                    el.removeAttribute('href');
                } else {
                    el.setAttribute('target', '_blank');
                    el.setAttribute('rel', 'noopener noreferrer');
                }
            }
        }
    };

    walk(doc.body);
    return doc.body.innerHTML;
}

export function htmlToText(input: string): string {
    if (!input) return '';
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
        return input;
    }

    const doc = new DOMParser().parseFromString(input, 'text/html');
    const text = doc.body.textContent || '';
    return text.replace(/\s+/g, ' ').trim();
}

