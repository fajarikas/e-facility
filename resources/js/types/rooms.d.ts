import { Building } from './buildings';

export interface RoomData {
    id: number;
    name: string;
    price: number;
    capacity_count: number;
    toilet_count: number;
    area: number;
    description: string;
    building_id: number;
    building: Building;
}

export interface PaginationLink {
    active: boolean;
    label: string;
    page: number;
    url: string;
}

export interface PaginatedRoomData {
    current_page: number;
    data: RoomData[];
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
