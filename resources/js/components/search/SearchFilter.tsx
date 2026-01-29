import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search as SearchIcon } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useId, useState } from 'react';

type SearchFilterProps = {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    label?: string;
    name?: string;
    id?: string;
    className?: string;
    inputClassName?: string;
    buttonClassName?: string;
    buttonLabel?: string;
    showButton?: boolean;
    disabled?: boolean;
};

export default function SearchFilter({
    value,
    defaultValue = '',
    onChange,
    onSubmit,
    placeholder = 'Cari data',
    label = 'Search',
    name = 'search',
    id,
    className,
    inputClassName,
    buttonClassName,
    buttonLabel = 'Cari',
    showButton = true,
    disabled = false,
}: SearchFilterProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const resolvedValue = value ?? internalValue;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        if (value === undefined) {
            setInternalValue(nextValue);
        }
        onChange?.(nextValue);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.(resolvedValue);
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={cn(
                'flex w-full flex-col gap-2 sm:flex-row sm:items-center',
                className,
            )}
        >
            <label htmlFor={inputId} className="sr-only">
                {label}
            </label>
            <div className="relative w-full">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id={inputId}
                    name={name}
                    type="search"
                    value={resolvedValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={cn('h-10 pl-9', inputClassName)}
                    disabled={disabled}
                />
            </div>
            {showButton && (
                <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="bg-neutral-900 text-white hover:bg-neutral-800"
                    disabled={disabled}
                >
                    {buttonLabel}
                </Button>
            )}
        </form>
    );
}
