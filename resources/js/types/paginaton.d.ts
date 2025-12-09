import { Building } from './buildings';

export interface PaginationLink {
    active: boolean;
    label: string;
    page: number;
    url: string;
}

export interface PaginatedData {
    current_page: number;
    data: Building[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
