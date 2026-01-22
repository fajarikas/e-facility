import { User } from './index';
import { RoomData } from './rooms';
import { DataMaster, PaymentMethod } from './data-master';

export interface TransactionDetailData {
    id: number;
    transaction_date: string;
    user: User;
}

export interface TransactionData {
    id: number;
    check_in_date: string;
    check_out_date: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_address?: string | null;
    status?: 'pending_payment' | 'booked' | 'cancelled' | 'expired';
    expires_at?: string | null;
    total_harga: number;
    is_booked: 'Yes' | 'No';
    room: RoomData;
    details: TransactionDetailData[];
    data_master?: DataMaster | null;
    payment_method?: PaymentMethod | null;
}

export interface TransactionPaginationLink {
    active: boolean;
    label: string;
    url: string | null;
}

export interface PaginatedTransactionData {
    data: TransactionData[];
    from: number;
    to: number;
    total: number;
    per_page: number;
    links: TransactionPaginationLink[];
}
