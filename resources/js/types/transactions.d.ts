import { User } from './index';
import { RoomData } from './rooms';

export interface TransactionDetailData {
    id: number;
    transaction_date: string;
    user: User;
}

export interface TransactionData {
    id: number;
    check_in_date: string;
    check_out_date: string;
    total_harga: number;
    is_booked: 'Yes' | 'No';
    room: RoomData;
    details: TransactionDetailData[];
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
