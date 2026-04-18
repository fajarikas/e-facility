import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type Props = {
    title: string;
    value: string;
    description?: string;
    icon?: ReactNode;
    tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const toneConfig: Record<NonNullable<Props['tone']>, { text: string; bg: string; icon: string }> = {
    default: {
        text: 'text-gray-900 
        bg: 'bg-gray-50 
        icon: 'text-gray-500 
    },
    success: {
        text: 'text-emerald-600 
        bg: 'bg-emerald-50 
        icon: 'text-emerald-600 
    },
    warning: {
        text: 'text-amber-600 
        bg: 'bg-amber-50 
        icon: 'text-amber-600 
    },
    danger: {
        text: 'text-rose-600 
        bg: 'bg-rose-50 
        icon: 'text-rose-600 
    },
    info: {
        text: 'text-blue-600 
        bg: 'bg-blue-50 
        icon: 'text-blue-600 
    },
};

export default function DashboardStatCard({
    title,
    value,
    description,
    icon,
    tone = 'default',
}: Props) {
    const config = toneConfig[tone];

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Card className="group relative overflow-hidden border-none bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-xl  ">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {title}
                    </CardTitle>
                    {icon && (
                        <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                            config.bg,
                            config.icon
                        )}>
                            {icon}
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <div className={cn('text-2xl font-black tracking-tight', config.text)}>
                        {value}
                    </div>
                    {description && (
                        <p className="mt-2 text-xs font-medium text-muted-foreground">
                            {description}
                        </p>
                    )}
                </CardContent>
                {/* Decorative background element */}
                <div className={cn(
                    "absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-[0.03] transition-transform group-hover:scale-110  ",
                    config.bg
                )} />
            </Card>
        </motion.div>
    );
}
