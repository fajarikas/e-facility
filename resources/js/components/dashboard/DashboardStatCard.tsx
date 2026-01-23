import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

type Props = {
    title: string;
    value: string;
    description?: string;
    icon?: ReactNode;
    tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const toneClassName: Record<NonNullable<Props['tone']>, string> = {
    default: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
};

export default function DashboardStatCard({
    title,
    value,
    description,
    icon,
    tone = 'default',
}: Props) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3 text-sm font-medium">
                    <span className="text-muted-foreground">{title}</span>
                    {icon ? (
                        <span className="text-muted-foreground">{icon}</span>
                    ) : null}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        'text-2xl font-semibold tracking-tight',
                        toneClassName[tone],
                    )}
                >
                    {value}
                </div>
                {description ? (
                    <CardDescription className="mt-2">
                        {description}
                    </CardDescription>
                ) : null}
            </CardContent>
        </Card>
    );
}

