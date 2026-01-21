export interface DataMaster {
    id: number;
    name: string;
    contact: string;
    va_number: string;
}

export interface PaymentMethod {
    id: number;
    data_master_id: number;
    type: 'va' | 'bank_transfer';
    bank_name: string;
    account_number: string;
    account_holder?: string | null;
    is_active: boolean;
}
