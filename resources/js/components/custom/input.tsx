import React, { ReactNode } from 'react';

type Props = {
    icon: ReactNode;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type: string;
};

const InputField = ({ icon, onChange, placeholder, value, type }: Props) => {
    return (
        <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                {icon}
            </div>
            <input
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pr-9 pl-10 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
            />
        </div>
    );
};

export default InputField;
