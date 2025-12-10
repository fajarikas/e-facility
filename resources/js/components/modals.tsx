'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    widthClass?: string;
    title: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    widthClass = 'max-w-lg',
}) => {
    // This component is client-only (`use client`), it's safe to access DOM directly.
    const portalContainer =
        typeof document !== 'undefined'
            ? document.getElementById('modal-root')
            : null;

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!portalContainer) {
        return null;
    }

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/70"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`relative flex max-h-[90vh] w-11/12 flex-col rounded-lg bg-white text-[#454545] shadow-lg ${widthClass}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 cursor-pointer text-[#454545] hover:text-[#454545]/90"
                            aria-label="Tutup modal"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {title && (
                            <div className="border-b border-[#454545] p-6">
                                <h1 className="text-center text-2xl font-bold uppercase">
                                    {title}
                                </h1>
                            </div>
                        )}

                        <div className="overflow-y-auto p-6">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        portalContainer,
    );
};

export default Modal;
