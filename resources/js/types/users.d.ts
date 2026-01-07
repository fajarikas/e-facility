export interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'user';
    created_at: string;
}

export interface UserPaginationLink {
    active: boolean;
    label: string;
    url: string | null;
}

export interface PaginatedUserData {
    data: UserData[];
    from: number;
    to: number;
    total: number;
    per_page: number;
    links: UserPaginationLink[];
}
