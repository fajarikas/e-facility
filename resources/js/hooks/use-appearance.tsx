import { useCallback, useState } from 'react';

export type Appearance = 'light';

export function initializeTheme() {
    // Force light mode on document root
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
    }
}

export function useAppearance() {
    // Always return light mode
    const appearance: Appearance = 'light';
    
    const updateAppearance = useCallback((mode: Appearance) => {
        // Do nothing, force light
    }, []);

    return { appearance, updateAppearance } as const;
}
